import { employeeApi, authApi } from '@/services';
import { combineReducers } from '@reduxjs/toolkit';
import auth from '@/redux/features/auth/auth.slice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { projectApi } from '@/services/project';
import { timeEntryApi } from '@/services/timeEntry';
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [timeEntryApi.reducerPath]: timeEntryApi.reducer,
});
export const reducers = persistReducer(persistConfig, rootReducer);
