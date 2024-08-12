'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { createStyleContext } from '@shadow-panda/style-context'
import { styled } from '@atdb/design-system'
import { tooltip } from './index.recipe'

const { withProvider, withContext } = createStyleContext(tooltip)

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = withProvider(styled(TooltipPrimitive.Root), 'root')
export const TooltipTrigger = withContext(styled(TooltipPrimitive.Trigger), 'trigger')
export const TooltipContent = withContext(styled(TooltipPrimitive.Content), 'content', {
  sideOffset: 4,
})
