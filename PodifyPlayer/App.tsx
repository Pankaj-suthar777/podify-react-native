import React from 'react';
import {Provider} from 'react-redux';
import store from './src/store/index';
import AppNavigator from './src/navigation';
import AppContainer from '@components/AppContainer';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <AppNavigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
