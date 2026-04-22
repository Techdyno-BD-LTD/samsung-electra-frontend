import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CompareItem {
  id: string;
  title: string;
  brand: string;
  brandLogo?: string;
  image: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  saveAmount: string;
  category?: string;
  type?: string;
  weight?: string;
  color?: string;
  rating?: number;
  ratingCount?: string;
}

type CompareState = {
  slots: Array<CompareItem | null>;
};

const emptySlots = [null, null, null] as Array<CompareItem | null>;

const initialState: CompareState = {
  slots: [...emptySlots],
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    setCompareSlots: (state, action: PayloadAction<Array<CompareItem | null>>) => {
      const incoming = action.payload.slice(0, 3);
      state.slots = [...incoming, ...emptySlots].slice(0, 3);
    },
    clearCompare: (state) => {
      state.slots = [...emptySlots];
    },
    removeAtIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < 3) {
        state.slots[index] = null;
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.slots = state.slots.map((slot) => (slot?.id === action.payload ? null : slot));
    },
    setCompareAtIndex: (state, action: PayloadAction<{ index: number; item: CompareItem | null }>) => {
      const { index, item } = action.payload;
      if (index < 0 || index >= 3) {
        return;
      }

      if (!item) {
        state.slots[index] = null;
        return;
      }

      const duplicateIndex = state.slots.findIndex((slot, idx) => slot?.id === item.id && idx !== index);
      if (duplicateIndex !== -1) {
        state.slots[duplicateIndex] = null;
      }

      state.slots[index] = item;
    },
    toggleCompare: (state, action: PayloadAction<CompareItem>) => {
      const existingIndex = state.slots.findIndex((slot) => slot?.id === action.payload.id);
      if (existingIndex !== -1) {
        state.slots[existingIndex] = null;
        return;
      }

      const emptyIndex = state.slots.findIndex((slot) => slot === null);
      if (emptyIndex !== -1) {
        state.slots[emptyIndex] = action.payload;
        return;
      }

      state.slots[2] = action.payload;
    },
  },
});

export const { clearCompare, removeAtIndex, removeFromCompare, setCompareAtIndex, setCompareSlots, toggleCompare } = compareSlice.actions;

export default compareSlice.reducer;
