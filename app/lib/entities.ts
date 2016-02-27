export type File = {
  path: string[]
  name: string
  slug: string
}

export type Directory = File & {
  files: {[slug: string]: File|Directory}
}
