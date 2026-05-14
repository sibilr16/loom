import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://loom-h6m8.onrender.com/api/payment",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    makePayment: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/verify-payment",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useMakePaymentMutation, useVerifyPaymentMutation } = paymentApi;
