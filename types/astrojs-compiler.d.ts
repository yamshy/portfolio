/* eslint-disable no-unused-vars */
declare module '@astrojs/compiler' {
  interface TransformOptions {
    filename?: string;
  }

  interface TransformResult {
    code: string;
    map?: string | null;
  }

  export const transform: (
    source: string,
    options?: TransformOptions,
  ) => Promise<TransformResult>;
}
