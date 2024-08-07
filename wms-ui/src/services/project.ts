import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Project } from 'wms-types';
import { PaginatedResult, PayloadPaginate, Response } from '.';
import { setCredentials } from '@/redux/features/auth/auth.slice';
import { baseQueryWithReauth } from './api';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getProjectById: builder.query<Response<Project>, string>({
      query: (id) => `/project/${id}`,
    }),
    getProjectByEmployee: builder.query<Response<Project[]>, number>({
      query: (year) => {
        let url = `/employee/project`;
        if (year) {
          url += `?year=${year}`;
        }
        return url;
      },
    }),

    getProjectByEmployeeWithYear: builder.query<
      Response<Project[]>,
      { id?:string ,  year?: number }
    >({
      query: ({ id,year }) => {
        // console.log('eeee');

        let url = `/employee/project`;
        if(id){
          url += `/${id}`+`?year=${year}`;
        }else
        if (year) {
          url += `?year=${year.toString()}`;
        }
        return url;
      },
    }),
    paginateProjects: builder.mutation<
      Response<PaginatedResult<Project>>,
      PayloadPaginate
    >({
      query: (payload: PayloadPaginate) => ({
        url: `/paginate/projects?page=${payload?.paginate?.page || 1}&limit=${payload?.paginate?.limit || 10}&perPage=${payload?.paginate?.perPage || 10}`,
        method: 'POST',
        body: payload?.body || {},
        providesTags: ['Projects'],
      }),
    }),
    getProjects: builder.query<Response<Project[]>, void>({
      query: () => '/projects',
      providesTags: ['Projects'],
    }),
    searchProject: builder.query<Response<Project[]>, string>({
      query: (content) => `/projects?code=${content}`,
      providesTags: ['Projects'],
    }),

    updateProject: builder.mutation<Response<Project>, Partial<Project>>({
      query: (body) => ({
        url: `/project/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    addProject: builder.mutation<
      Response<Project>,
      Pick<
        Project,
        | 'code'
        | 'name'
        | 'description'
        | 'status'
        | 'type'
        | 'typeLeave'
        | 'limit'
      >
    >({
      query: (body) => ({
        url: `/project`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    removeProject: builder.mutation<Response<Project>, string>({
      query: (id) => ({
        url: `/project/remove/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Projects'],
    }),
  }),
});
export const {
  useGetProjectByIdQuery,
  useGetProjectByEmployeeQuery,
  useGetProjectByEmployeeWithYearQuery,
  useGetProjectsQuery,
  useSearchProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  usePaginateProjectsMutation,
  useRemoveProjectMutation,
} = projectApi;
