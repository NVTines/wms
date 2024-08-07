import { persistor, store } from '@/redux/store';
import { RoutesConfig } from '@/routes';
import { ConfigProvider, theme } from 'antd';
import locale from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import utc from 'dayjs/plugin/utc';

dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(quarterOfYear);
dayjs.updateLocale('vi-VN', {});
// import AdvancedFormat from 'dayjs/plugin/advancedFormat' // ES 2015

dayjs.extend(isBetween);
const App = (): JSX.Element => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: "'Poppins', sans-serif",
              },

              algorithm: theme.defaultAlgorithm,
            }}
            locale={locale}
          >
            <RoutesConfig />
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
