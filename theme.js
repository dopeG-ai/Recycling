import { extendTheme } from '@chakra-ui/react';

export const colors = {
  brand: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  }
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: colors.brand,
    background: {
      light: '#F8FAF8',
      dark: '#1A202C',
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
});

export const getTheme = (darkMode) => {
  return {
    ...theme,
    config: {
      ...theme.config,
      initialColorMode: darkMode ? 'dark' : 'light',
    },
  };
};

export default theme;