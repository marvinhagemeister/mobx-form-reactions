export const isHello = (value: string) => value !== "hello"
  ? { hello: true }
  : {};

export const asyncIsHello = (value: string) => new Promise((res, rej) => {
  setTimeout(() => {
    res(isHello(value));
  }, 10);
});
