import { api } from './api';
import { AddFileRequest, AddFileResponse } from './stockings';

export interface User {
  email?: string;
  username?: string;
  profileImageUrl?: string;
  fireplaceId?: string;
}

export interface UserResponse {
  user: User;
  access_token: string;
}

export interface UpdateUserRequest {
  username?: string;
  profileImageUrl?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUsername: builder.mutation<User, UpdateUserRequest>({
      query: (valuesToUpdate) => ({
        url: `users`,
        method: 'PATCH',
        body: valuesToUpdate,
      }),
    }),
    uploadImage: builder.mutation<AddFileResponse, AddFileRequest>({
      query: (data) => ({
        url: `files`,
        method: 'POST',
        body: data,
      }),
    }),
    updateProfileImageUrl: builder.mutation<User, UpdateUserRequest>({
      query: (valuesToUpdate) => ({
        url: `users`,
        method: 'PATCH',
        body: valuesToUpdate,
      }),
    }),
  }),
  overrideExisting: false,
});
