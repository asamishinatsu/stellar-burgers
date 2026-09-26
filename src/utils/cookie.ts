const MILLISECONDS_IN_SECOND = 1000;

export function getCookie(name: string): string | undefined {
  const escapedName = name.replace(/[.*+?^{}$()|[\]\\]/g, '\\$&');
  const matches = new RegExp('(?:^|; )' + escapedName + '=([^;]*)').exec(
    document.cookie
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

/* В тренажере приводится несовсем корректный пример этой функции
 там не задается path и возможна ситуация, когда на разных страницах в cookies
 будут разные токены, поэтому в path нужно задавать корень сайта path: '/' */

export function setCookie(
  name: string,
  value: string,
  props: Record<string, string | number | Date | boolean> = {}
): void {
  props = {
    path: '/',
    ...props,
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * MILLISECONDS_IN_SECOND);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + String(propValue);
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string): void {
  setCookie(name, '', { expires: -1 });
}
