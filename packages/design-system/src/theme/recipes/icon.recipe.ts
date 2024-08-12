import { defineRecipe } from '@pandacss/dev';

export const icon = defineRecipe({
  className: 'icon',
  description: 'Styles for the icons',
  base: {},
  variants: {
    size: {
      xl: {
        h: '2rem',
        w: '2rem',
      },
      lg: {
        h: '1rem',
        w: '1rem',
      },
      md: {
        h: '0.875rem',
        w: '0.875rem',
      },
      sm: {
        h: '0.75rem',
        w: '0.75rem',
      },
      xs: {
        h: '0.5rem',
        w: '0.5rem',
      },
    },
    left: {
      none: {},
      sm: {
        ml: '2',
      },
      auto: {
        ml: 'auto',
      },
    },
    right: {
      none: {},
      sm: {
        mr: '2',
      },
      auto: {
        mr: 'auto',
      },
    },
    fillCurrent: {
      true: {
        fill: 'currentColor',
      },
    },
    dimmed: {
      true: {
        opacity: '0.5',
      },
    },
  },

  defaultVariants: {
    size: 'xs',
    left: 'none',
    right: 'none',
    fillCurrent: false,
    dimmed: false,
  },
});
