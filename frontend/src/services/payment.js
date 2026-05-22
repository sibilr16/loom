import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://loom-h6m8.onrender.com/api/payment",
    credentials: "include",
  }),
  tagTypes: ["Cart", "Order"],
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
      invalidatesTags: ["Cart", "Order"],
    }),
    getMyOrders: builder.query({
      query: () => "/my-orders",
      providesTags: ["Order"],
    }),
    getAllOrders: builder.query({
      query: () => "/all-orders",
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useMakePaymentMutation,
  useVerifyPaymentMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = paymentApi;
