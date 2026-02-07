export function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ');
}
