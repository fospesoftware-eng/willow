// Reads are request-fresh in Express. Saving CMS data needs no Next cache invalidation.
export function unstable_cache<T extends (...args: any[]) => any>(fn: T, ..._options: any[]): T {
  return fn;
}
export function revalidatePath(..._args: any[]) {}
export function revalidateTag(..._args: any[]) {}
