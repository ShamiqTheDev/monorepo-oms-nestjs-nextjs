import { defineSemanticTokens } from '@pandacss/dev';

export const semanticTokens = defineSemanticTokens({
  colors: {
    brand: {
      value: {
        base: '{colors.primary.500}',
        _dark: '{colors.primary.400}',
      },
    },

    bg: {
      DEFAULT: {
        value: {
          base: '{colors.gray.100}',
          _dark: '{colors.gray.900}',
        },
      },

      subtle: {
        value: {
          base: '{colors.gray.50}',
          _dark: '{colors.gray.875}',
        },
      },
    },

    text: {
      DEFAULT: {
        value: {
          base: '{colors.gray.900}',
          _dark: '{colors.gray.100}',
        },
      },

      subtle: {
        value: {
          base: '{colors.gray.700}',
          _dark: '{colors.gray.300}',
        },
      },
    },
  },
});
