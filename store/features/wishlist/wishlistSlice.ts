import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface WishlistItem {
  id: string; // This is the slug for storefront tracking
  productId: number; // Database ID
  title: string;
  brand: string;
  category?: string;
  image: string;
  price: string | number;
  originalPrice?: string | number;
  discountLabel?: string;
  saveAmount?: string | number;
  model?: string;
  // Metadata for local UI state
  color?: string;
  type?: string;
  weight?: string;
  rating?: number;
  ratingCount?: string;
  brandLogo?: string;
  emiPrice?: string;
  emiPercent?: string;
  tags?: string[];
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return [];

      const response = await fetch("/api/v2/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        return result.data.map((item: any) => {
          const p = item.product;
          const unitPrice = Number(p.unit_price);
          const discount = Number(p.discount);
          const discountType = p.discount_type;
          
          let originalPrice = unitPrice;
          let price = unitPrice;
          let discountLabel = "";
          let saveAmount = 0;

          if (discount > 0) {
            if (discountType === "amount") {
              price = unitPrice - discount;
              saveAmount = discount;
              discountLabel = `${discount} Off`;
            } else {
              saveAmount = (unitPrice * discount) / 100;
              price = unitPrice - saveAmount;
              discountLabel = `${discount}% Off`;
            }
            originalPrice = unitPrice;
          }

          return {
            id: p.slug,
            productId: p.id,
            title: p.name,
            brand: p.brand_name,
            category: p.category_name,
            image: p.thumbnail_img,
            price: price,
            originalPrice: discount > 0 ? originalPrice : undefined,
            discountLabel: discount > 0 ? discountLabel : undefined,
            saveAmount: discount > 0 ? saveAmount : undefined,
            model: p.model_number,
          } as WishlistItem;
        });
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlistAsync",
  async (product: WishlistItem, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Not authenticated");

      const response = await fetch(`/api/v2/wishlist/${product.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.result) {
        return product;
      }
      return rejectWithValue(result.message || "Failed to add to wishlist");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlistAsync",
  async (slug: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) return rejectWithValue("Not authenticated");

      const response = await fetch(`/api/v2/wishlist/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.result) {
        return slug;
      }
      return rejectWithValue(result.message || "Failed to remove from wishlist");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        const exists = state.items.some((item) => item.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      // Remove
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setWishlistItems, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
