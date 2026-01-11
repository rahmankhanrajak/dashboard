import { apiSlice } from "./authApi"; 

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<any, { items: any[] }>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
