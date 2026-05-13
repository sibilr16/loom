import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/cart",
    credentials: "include",
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/get-cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/add-to-cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation({
      query: (data) => ({
        url: "/delete-cart-item",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: (data) => ({
        url: "/update-cart-item",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useDeleteCartItemMutation,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useGetCartQuery,
} = cartApi;
