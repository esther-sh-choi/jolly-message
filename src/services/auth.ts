import { api } from './api';
import { UserResponse } from './users';

export interface SignUpRequest {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  tokenId?: string;
  agree?: boolean;
}

export interface LoginRequest {
  email?: string;
  password?: string;
  tokenId?: string;
}

export interface ResetPasswordRequest {
  tokenId?: string;
  password?: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signUp: builder.mutation<void, SignUpRequest>({
      query: (credentials) => ({
        url: 'auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'DELETE',
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (values) => ({
        url: `auth/reset-password/${values.tokenId}`,
        method: 'POST',
        body: values,
      }),
    }),
  }),
  overrideExisting: false,
});
