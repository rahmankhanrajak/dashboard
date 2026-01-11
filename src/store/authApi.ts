import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

interface RefreshResponse {
  accessToken: string;
}

interface OrderItem {
  id: number;
  productId: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  qty: number;
}

interface Order {
  id: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: '/api/auth/refresh',
        method: 'POST',
      }),
    }),

    createOrder: builder.mutation<any, { items: CartItem[] }>({
      query: (body) => ({
        url: '/api/orders',
        method: 'POST',
        body,
      }),
    }),

    getOrders: builder.query<Order[], void>({
  query: () => ({
    url: '/api/orders',
    method: 'GET',
  }),
}),

getOrderById: builder.query<Order, number>({
  query: (id) => ({
    url: `/api/orders/${id}`,
    method: 'GET',
  }),
}),
  }),
});



export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useRefreshMutation,
  useCreateOrderMutation, 
  useGetOrdersQuery,
useGetOrderByIdQuery,

} = authApi;