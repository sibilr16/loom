import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import uiReducer from "./features/uiSlice.js";
import phoneReducer from "./features/phoneSlice.js";
import { authApi } from "./services/auth.js";
import { productApi } from "./services/product.js";
import { cartApi } from "./services/cart.js";
import { paymentApi } from "./services/payment.js";
import { userApi } from "./services/user.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    phone: phoneReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware)
      .concat(paymentApi.middleware),
});
