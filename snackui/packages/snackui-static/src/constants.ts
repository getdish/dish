import { dirname, join } from 'path'

export const CSS_FILE_NAME = 'snackui_style.css'

export const SNACK_CSS_FILE = join(
  dirname(require.resolve('snackui/node')),
  CSS_FILE_NAME
)
