export function intersect<T>(...args: T[][]) {
  let result: T[] = [...args.shift()];
  for (const arr of args) {
    result = result.filter(v => arr.includes(v));
  }
  return result;
}