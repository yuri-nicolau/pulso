import { t } from "elysia";

// Use instead of `t.UnionEnum`: Elysia 1.4 fills an omitted optional `t.UnionEnum`
// (query or body) with the enum's first value. A union of literals validates the same values
// with no default; the static type is borrowed from UnionEnum so route and Eden types stay exact.
export function oneOf<const T extends readonly [string, ...string[]]>(values: T) {
  return t.Union(values.map((value) => t.Literal(value))) as unknown as ReturnType<
    typeof t.UnionEnum<T>
  >;
}
