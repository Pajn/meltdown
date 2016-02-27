import {Directory} from './entities'

const charsToReplace = /[^a-z0-9.]/g
const repetedDashes = /\-\-+/g

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(charsToReplace, '-')
    .replace(repetedDashes, '')
}

export function getFile(root: Directory, path: string[]) {
  let directory = root
  for (const slug of path) {
    if (!directory || !directory.files) return
    directory = directory.files[slug] as Directory
  }
  return directory
}

export function getUrl(path: string[]) {
  return path.length
    ? `file/${path.join('/')}`
    : '/'
}
