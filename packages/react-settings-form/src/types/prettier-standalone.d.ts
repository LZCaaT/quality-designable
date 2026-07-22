declare module 'prettier/standalone' {
  const prettier: {
    format: (
      source: string,
      options: {
        semi?: boolean
        parser?: (code: string) => any
      }
    ) => string
  }

  export default prettier
}
