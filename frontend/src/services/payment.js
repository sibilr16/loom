import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/payment",
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
