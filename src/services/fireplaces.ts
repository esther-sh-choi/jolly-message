import { api } from './api';
import querystring from 'query-string';

export interface Stocking {
  uid: string;
  fireplaceId: string;
  userId: string;
  nickname: string;
  color: string;
  pattern: string;
  items: string[];
  message: string;
  imageUrl: string;
  favorite: boolean;
  read: boolean;
}

export interface PaginationMeta {
  page: number;
  take: number;
  totalCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Fireplace {
  uid: string;
  username: string;
  profileImageUrl: string;
  sentCount: number;
  data: Stocking[];
  meta: PaginationMeta;
}

export interface FireplaceRequest {
  id: string;
  page?: number;
  take?: number;
  read?: boolean;
  unread?: boolean;
  favorites?: boolean;
  owner?: boolean;
}

export const fireplacesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFireplace: builder.mutation<Fireplace, FireplaceRequest>({
      query: (objectForQuery) => {
        const { id, owner, ...params } = objectForQuery;
        const queryString = `?${querystring.stringify(params, {
          skipNull: true,
          skipEmptyString: true,
        })}`;
        return {
          url: `fireplaces/${id}${owner ? '/mine' : ''}${queryString}`,
          method: 'GET',
        };
      },
    }),
  }),
  overrideExisting: false,
});
