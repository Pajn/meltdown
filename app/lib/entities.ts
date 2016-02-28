import {SelectionState} from 'draft-js'

export type Comment = {
  id: number
  entityKey: string
  selection: SelectionState
  text: string
}

export type File = {
  path: string[]
  name: string
  slug: string
}

export type Directory = File & {
  files: {[slug: string]: File|Directory}
}
