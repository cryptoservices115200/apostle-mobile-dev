import React from 'react';
import { UIManager, Platform } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider } from 'styled-components/native';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';

import Router from '@/Router';
import { Themes } from '@/styles';
import { DropDownAlert } from '@/views/Components';
import LoadingHud from '@/views/Components/hud';
import { config } from '@/store';

const overmind = createOvermind(config, {
  devtools: false,
});

console.disableYellowBox = true;

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App: React.FC = () => {
  return (
    <Provider value={overmind}>
      <ThemeProvider theme={Themes.base}>
        <ActionSheetProvider>
          <Router />
        </ActionSheetProvider>
        <LoadingHud />
        <DropDownAlert />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
