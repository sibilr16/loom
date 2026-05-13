import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/product",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/add-product",
        method: "POST",
        body: data,
      }),
    }),
    getProducts: builder.query({
      query: () => "/get-products",
    }),
    getProductById: builder.query({
      query: (id) => `get-product/${id}`,
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productApi;
