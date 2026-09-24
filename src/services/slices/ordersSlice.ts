import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logoutUser } from './authSlice';

import type { TOrder, TOrdersState } from '@utils-types';

const initialState: TOrdersState = {
  userOrders: [],
  selectedOrder: null,
  orderModalData: null,
  isUserOrdersLoading: false,
  isOrderDetailsLoading: false,
  isOrderCreating: false,
  userOrdersError: null,
  orderDetailsError: null,
  orderCreateError: null,
  userOrdersRequestId: null,
  orderDetailsRequestId: null,
  orderCreateRequestId: null,
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { state: { orders: TOrdersState } }
>('orders/fetchUserOrders', (_, { signal }) => getOrdersApi(signal), {
  condition: (_, { getState }) => !getState().orders.isUserOrdersLoading,
});

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number, { signal }) => {
    const response = await getOrderByNumberApi(number, signal);
    if (!response.success || !response.orders.length) {
      throw new Error('Заказ не найден');
    }
    return response.orders[0];
  }
);

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { state: { orders: TOrdersState } }
>(
  'orders/createOrder',
  async (ingredientIds) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  },
  {
    condition: (_, { getState }) => !getState().orders.isOrderCreating,
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderCreateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state, action) => {
        state.isUserOrdersLoading = true;
        state.userOrdersError = null;
        state.userOrdersRequestId = action.meta.requestId;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        if (state.userOrdersRequestId !== action.meta.requestId) return;
        state.userOrders = action.payload;
        state.isUserOrdersLoading = false;
        state.userOrdersRequestId = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        if (state.userOrdersRequestId !== action.meta.requestId) return;
        state.isUserOrdersLoading = false;
        state.userOrdersRequestId = null;
        if (!action.meta.aborted) state.userOrdersError = action.error;
      })
      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.selectedOrder = null;
        state.orderDetailsError = null;
        state.isOrderDetailsLoading = true;
        state.orderDetailsRequestId = action.meta.requestId;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (state.orderDetailsRequestId !== action.meta.requestId) return;
        state.selectedOrder = action.payload;
        state.isOrderDetailsLoading = false;
        state.orderDetailsRequestId = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        if (state.orderDetailsRequestId !== action.meta.requestId) return;
        state.isOrderDetailsLoading = false;
        state.orderDetailsRequestId = null;
        if (!action.meta.aborted) state.orderDetailsError = action.error;
      })
      .addCase(createOrder.pending, (state, action) => {
        state.isOrderCreating = true;
        state.orderCreateRequestId = action.meta.requestId;
        state.orderModalData = null;
        state.orderCreateError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (state.orderCreateRequestId !== action.meta.requestId) return;
        state.isOrderCreating = false;
        state.orderCreateRequestId = null;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        if (state.orderCreateRequestId !== action.meta.requestId) return;
        state.isOrderCreating = false;
        state.orderCreateRequestId = null;
        state.orderCreateError = action.error;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearOrderModal } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
