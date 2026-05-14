import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://loom-h6m8.onrender.com/api/auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/admin-login",
        method: "POST",
        body: data,
      }),
    }),
    sendPhoneNumber: builder.mutation({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    completeProfile: builder.mutation({
      query: (data) => ({
        url: "/complete-profile",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => "/me",
    }),
    saveAddress: builder.mutation({
      query: (data) => ({
        url: "/save-address",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useCompleteProfileMutation,
  useSendPhoneNumberMutation,
  useSendOtpMutation,
  useGetMeQuery,
  useSaveAddressMutation,
  useLogoutMutation,
} = authApi;
