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

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  qty: number;
}

interface CartResponse {
  items: CartItem[];
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

    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: '/api/cart',
        method: 'GET',
      }),
    }),

    addToCart: builder.mutation<void, Partial<CartItem>>({
      query: (body) => ({
        url: '/api/cart/items',
        method: 'POST',
        body,
      }),
    }),

    updateCartQty: builder.mutation<void, { productId: number; qty: number }>({
      query: (body) => ({
        url: '/api/cart/items',
        method: 'PUT',
        body,
      }),
    }),

    removeFromCart: builder.mutation<void, number>({
      query: (productId) => ({
        url: `/api/cart/items/${productId}`,
        method: 'DELETE',
      }),
    }),

    createOrder: builder.mutation<Order, void>({
      query: () => ({
        url: '/api/orders',
        method: 'POST',
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
    cancelOrder: builder.mutation<{ message: string; order: any }, number>({
  query: (orderId) => ({
    url: `/api/orders/${orderId}/cancel`,
    method: 'PATCH',
  }),
}),
payOrder: builder.mutation<{ message: string; order: any }, number>({
  query: (orderId) => ({
    url: `/api/orders/${orderId}/pay`,
    method: 'PATCH',
  }),
}),


  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useRefreshMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQtyMutation,
  useRemoveFromCartMutation,
  useCreateOrderMutation, 
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  usePayOrderMutation,
} = authApi;
