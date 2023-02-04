import { api } from './api';

export interface AddFileRequest extends FormData {
  // file:
  // folder: string;
}

export interface AddFileResponse {
  url: string;
}

export interface AddStockingRequest {
  fireplaceId: string;
  nickname: string;
  message: string;
  color: string;
  pattern: string;
  items: string[];
  imageUrl: string;
  anonymous?: boolean;
}

export const stockingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<AddFileResponse, AddFileRequest>({
      query: (data) => ({
        url: `files${data.get('anonymous') === 'true' ? '/anonymous' : ''}`,
        method: 'POST',
        body: data,
      }),
    }),
    addStocking: builder.mutation<void, AddStockingRequest>({
      query: (stocking) => ({
        url: `stockings${stocking.anonymous ? '/anonymous' : ''}`,
        method: 'POST',
        body: stocking,
      }),
    }),
  }),
  overrideExisting: true,
});
