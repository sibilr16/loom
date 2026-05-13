import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
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
  useCompleteProfileMutation,
  useSendPhoneNumberMutation,
  useSendOtpMutation,
  useGetMeQuery,
  useSaveAddressMutation,
  useLogoutMutation,
} = authApi;
