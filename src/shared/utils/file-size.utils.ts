export function kb(size: number) {
  return size * 1024;
}
export function mb(size: number) {
  return size * 1024 * 1024;
}
export function gb(size: number) {
  return size * mb(1000);
}
export function tb(size: number) {
  return size * gb(1000);
}
