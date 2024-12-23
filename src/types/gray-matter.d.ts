declare module 'gray-matter' {
  interface GrayMatterFile<T = string> {
    data: Record<string, any>;
    content: T;
  }

  function matter<T = string>(
    input: string | Buffer,
    options?: any
  ): GrayMatterFile<T>;

  export = matter;
}
