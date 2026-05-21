import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://loom-h6m8.onrender.com/api/product",
    credentials: "include",
  }),
  tagTypes: ["Product"], // 👈 add this for cache invalidation
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/add-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"], // 👈 refetch list after add
    }),
    getProducts: builder.query({
      query: () => "/get-products",
      providesTags: ["Product"], // 👈 marks this query as cacheable
    }),
    getProductById: builder.query({
      query: (id) => `get-product/${id}`,
      providesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"], // 👈 refetch list after update
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"], // 👈 refetch list after delete
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
