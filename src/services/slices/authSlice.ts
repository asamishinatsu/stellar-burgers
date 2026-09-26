import { deleteCookie, getCookie, setCookie } from '@/utils/cookie';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import type { TLoginData, TRegisterData } from '@api';
import type { SerializedError } from '@reduxjs/toolkit';
import type { TUser } from '@utils-types';

type AuthRequestName =
  | 'checkAuth'
  | 'login'
  | 'register'
  | 'updateUser'
  | 'requestPasswordReset'
  | 'checkPasswordReset'
  | 'confirmPasswordReset'
  | 'logout';

type AuthRequest = {
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: SerializedError | null;
};

type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isChecking: boolean;
  updateUserRequestId: string | null;
  requests: Record<AuthRequestName, AuthRequest>;
};

const createRequest = (): AuthRequest => ({ status: 'idle', error: null });

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  isChecking: false,
  updateUserRequestId: null,
  requests: {
    checkAuth: createRequest(),
    login: createRequest(),
    register: createRequest(),
    updateUser: createRequest(),
    requestPasswordReset: createRequest(),
    checkPasswordReset: createRequest(),
    confirmPasswordReset: createRequest(),
    logout: createRequest(),
  },
};

const clearTokens = (): void => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

export const checkAuth = createAsyncThunk<
  TUser | null,
  void,
  { state: { auth: AuthState } }
>(
  'auth/checkAuth',
  async () => {
    if (!getCookie('accessToken')) {
      if (!localStorage.getItem('refreshToken')) return null;
      try {
        await refreshToken();
      } catch {
        clearTokens();
        return null;
      }
    }

    try {
      const response = await getUserApi();
      return response.user;
    } catch {
      clearTokens();
      return null;
    }
  },
  {
    condition: (_, { getState }) => {
      const { isAuthChecked, isChecking } = getState().auth;
      return !isAuthChecked && !isChecking;
    },
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'auth/login',
  async (credentials) => {
    const response = await loginUserApi(credentials);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'auth/register',
  async (data) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'auth/updateUser',
  async (changes) => (await updateUserApi(changes)).user
);

export const requestPasswordReset = createAsyncThunk<void, { email: string }>(
  'auth/requestPasswordReset',
  async (data) => {
    await forgotPasswordApi(data);
    localStorage.setItem('resetPassword', 'true');
  }
);

export const checkPasswordReset = createAsyncThunk<boolean>(
  'auth/checkPasswordReset',
  () => Boolean(localStorage.getItem('resetPassword'))
);

export const confirmPasswordReset = createAsyncThunk<
  void,
  { password: string; token: string }
>('auth/confirmPasswordReset', async (data) => {
  await resetPasswordApi(data);
  localStorage.removeItem('resetPassword');
});

export const logoutUser = createAsyncThunk<void>('auth/logout', async () => {
  await logoutApi();
  clearTokens();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isChecking = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user ??= action.payload;
        state.isAuthChecked = true;
        state.isChecking = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isChecking = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.updateUserRequestId = null;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.updateUserRequestId = null;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.updateUserRequestId = action.meta.requestId;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.updateUserRequestId !== action.meta.requestId) return;
        state.user = action.payload;
        state.updateUserRequestId = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (state.updateUserRequestId === action.meta.requestId) {
          state.updateUserRequestId = null;
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.updateUserRequestId = null;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addMatcher(
        isAnyOf(
          checkAuth.pending,
          loginUser.pending,
          registerUser.pending,
          updateUser.pending,
          requestPasswordReset.pending,
          checkPasswordReset.pending,
          confirmPasswordReset.pending,
          logoutUser.pending
        ),
        (state, action) => {
          const requestName = action.type.split('/')[1] as AuthRequestName;
          state.requests[requestName] = {
            status: 'pending',
            error: null,
          };
        }
      )
      .addMatcher(
        isAnyOf(
          checkAuth.fulfilled,
          loginUser.fulfilled,
          registerUser.fulfilled,
          updateUser.fulfilled,
          requestPasswordReset.fulfilled,
          checkPasswordReset.fulfilled,
          confirmPasswordReset.fulfilled,
          logoutUser.fulfilled
        ),
        (state, action) => {
          const requestName = action.type.split('/')[1] as AuthRequestName;
          state.requests[requestName] = {
            status: 'fulfilled',
            error: null,
          };
        }
      )
      .addMatcher(
        isAnyOf(
          checkAuth.rejected,
          loginUser.rejected,
          registerUser.rejected,
          updateUser.rejected,
          requestPasswordReset.rejected,
          checkPasswordReset.rejected,
          confirmPasswordReset.rejected,
          logoutUser.rejected
        ),
        (state, action) => {
          const requestName = action.type.split('/')[1] as AuthRequestName;
          state.requests[requestName] = {
            status: 'rejected',
            error: action.error,
          };
        }
      );
  },
});

export const authReducer = authSlice.reducer;
