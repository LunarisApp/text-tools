export declare function lruCache(
  target: any,
  name: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor;
export declare function clearCache(): void;
export declare function getGradeSuffix(grade: number): string;
export declare function assertDelta(
  actual: number,
  expected: number,
  delta?: number,
): void;
