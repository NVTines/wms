import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

const slice = createSlice({
  name: 'auth',
  initialState: { accessToken: null, refreshToken: null } as {
    currentUser: null | string;
    accessToken: null | string;
    refreshToken: null | string;
  },
  reducers: {
    setCredentials: (
      state,
      {
        payload: { currentUser, accessToken, refreshToken },
      }: PayloadAction<{
        currentUser: string | null;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.currentUser = currentUser;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },

    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.accessToken;
export const selectCurrentCode = (state: RootState) => state.auth.currentUser;
