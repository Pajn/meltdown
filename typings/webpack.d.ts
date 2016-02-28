declare var module: {
  hot: {
    accept(path: string, fn: (updatedModules: any) => void)
  }
}

declare function require(path: string): any
