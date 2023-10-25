export class UserHelper {
  static findKeyForValue(
    object: Record<string, any>,
    value: string
  ): string | null {
    const foundKey = Object.keys(object).find((key) => object[key] === value);
    return foundKey ?? null;
  }
}
