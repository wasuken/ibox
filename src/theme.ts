import { Theme, ThemeConfig } from '@chakra-ui/react';

// カラーモードの設定
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// テーマの拡張
const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      500: '#0070f3',
      600: '#0058c1',
      700: '#004494',
      900: '#001a33',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    // アイコンコンポーネントの明示的なスタイル設定
    Icon: {
      baseStyle: {
        // 明示的な基本スタイルを指定
      },
    },
  },
});

export default theme;
