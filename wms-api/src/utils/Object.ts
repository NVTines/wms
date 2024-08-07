export const map = <T>(values: any, ctor: any): T => {
  return Object.keys(ctor as any).reduce((acc: any, key: string) => {
    acc[key] = values[key] as any;
    return acc;
  }, {}) as T;
};
