import { defineTextStyles } from '@pandacss/dev';

export const textStyles = defineTextStyles({
  textStyles: {
    headings: {
      h1: {
        value: {
          fontWeight: 500,
          fontSize: '4xl',
          lineHeight: '1',
          letterSpacing: '-0.025em',
        },
      },

      h2: {
        value: {
          fontWeight: 400,
          fontSize: 'xl',
          lineHeight: '1',
          letterSpacing: '-0.025em',
        },
      },

      h3: {
        value: {
          fontWeight: 400,
          fontSize: 'lg',
          lineHeight: '1.1',
          letterSpacing: '-0.025em',
        },
      },

      h4: {
        value: {
          fontWeight: 400,
          fontSize: 'md',
          lineHeight: '1.15',
        },
      },
    },
  },
});
