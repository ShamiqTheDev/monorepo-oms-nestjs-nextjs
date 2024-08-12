import { styled, HTMLStyledProps } from '@atdb/design-system'
import { textarea } from './index.recipe'

export const Textarea = styled('textarea', textarea)
export type TextareaProps = HTMLStyledProps<typeof Textarea>
