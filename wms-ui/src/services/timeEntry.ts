import { createApi } from '@reduxjs/toolkit/query/react';
import { PrismaModel } from 'wms-types';
import { Response } from '.';
import { baseQueryWithReauth } from './api';

export const timeEntryApi = createApi({
  reducerPath: 'timeEntryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['TimeEntry'],
  endpoints: (builder) => ({
    getTimeEntries: builder.query<
      Response<PrismaModel.TimeEntryProject[]>,
      void
    >({
      query: () => '/time-entries',
      providesTags: ['TimeEntry'],
    }),

    getTimeEntryEmployee: builder.query<
      Response<PrismaModel.TimeEntryProject[]>,
      string | null
    >({
      query: (employeeId: string | null = null) => {
        if (employeeId) {
          // INFO: get employee's time entries by employeeId
          return `/employee/time-entries/${employeeId}`;
        } else {
          // INFO: get self employee's by token
          return `/employee/time-entries`;
        }
      },
      providesTags: ['TimeEntry'],
    }),

    updateTimeEntryEmployee: builder.mutation<
      Response<PrismaModel.TimeEntryProject[]>,
      Partial<PrismaModel.TimeEntryProject>[]
    >({
      query: (timeEntries: Partial<PrismaModel.TimeEntryProject>[]) => ({
        url: `/employee/time-entries`,
        method: 'PUT',
        body: timeEntries,
      }),
      invalidatesTags: ['TimeEntry'],
    }),
  }),
});

export const {
  useGetTimeEntriesQuery,
  useGetTimeEntryEmployeeQuery,
  useUpdateTimeEntryEmployeeMutation,
} = timeEntryApi;
