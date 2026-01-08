import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3036",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    console.log('Token expired, attempting refresh...');
    
    const refreshResult = await baseQuery(
      { url: "/api/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data && (refreshResult.data as any).accessToken) {
      api.dispatch(setAccessToken((refreshResult.data as any).accessToken));
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('Refresh failed, logging out...');
      api.dispatch(logout());
    }
  }

  return result;
};