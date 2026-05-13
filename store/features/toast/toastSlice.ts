import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToastState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  productName?: string;
  productImage?: string;
  productPrice?: string | number;
  actionLabel?: string;
  actionLink?: string;
}

const initialState: ToastState = {
  isOpen: false,
  message: "",
  type: 'success',
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<ToastState, 'isOpen'>>) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.productName = action.payload.productName;
      state.productImage = action.payload.productImage;
      state.productPrice = action.payload.productPrice;
      state.actionLabel = action.payload.actionLabel;
      state.actionLink = action.payload.actionLink;
    },
    hideToast: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
