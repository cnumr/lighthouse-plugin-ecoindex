declare namespace Util {
  /**
   * If `S` is a kebab-style string `S`, convert to camelCase.
   */
  type KebabToCamelCase<S> = S extends `${infer T}-${infer U}`
    ? `${T}${Capitalize<KebabToCamelCase<U>>}`
    : S

  /** Returns T with any kebab-style property names rewritten as camelCase. */
  type CamelCasify<T> = {
    [K in keyof T as KebabToCamelCase<K>]: T[K]
  }
}
export default Util
