import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { resetAuth, setAuth } from '../stores/auth';
import { RootState } from '../stores/store';
import { UserResponse } from './users';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV !== 'production' ? 'http://localhost:3001/api' : 'https://server.jollymessage.com/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
      },
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      api.dispatch(setAuth(refreshResult.data as UserResponse));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(resetAuth());
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
