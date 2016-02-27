import {action, Payload} from '../lib/action-creator'
import {slugify} from '../lib/file-tools'

export const createDirectory = action(
  'CreateDirectory', new Payload<{name: string, slug: string, path: string[]}>(),
  (name: string, path: string[]) => ({name, slug: slugify(name), path})
)

export const createFile = action(
  'CreateFile', new Payload<{name: string, slug: string, path: string[]}>(),
  (name: string, path: string[]) => ({name, slug: slugify(name), path})
)
