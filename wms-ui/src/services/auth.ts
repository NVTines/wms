import { createApi } from '@reduxjs/toolkit/query/react';
import { Response } from '.';
import { baseQuery } from './api';

export type LoginModel = {
  code: string;
  password: string;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    authorize: builder.mutation<
      Response<{ accessToken: string; refreshToken: string }>,
      LoginModel
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: body,
      }),
      transformResponse: (
        response: Response<{ accessToken: string; refreshToken: string }>,
        meta,
        arg,
      ) => response,
    }),
  }),
});

export const { useAuthorizeMutation } = authApi;
