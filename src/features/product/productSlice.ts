import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../api/api";
import { Review } from "../../types";
import { Pagination } from "../../types/pagination.types";
import {
  Product,
  ProductDetailResponse,
  ProductRequest,
} from "../../types/product.types";

interface FilterParams {
  page: number;
  search: string;
  size: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  brandId?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

interface ProductState {
  products: Product[];
  searchProducts: Product[];
  productArrivals: Product[];
  productTopSelling: Product[];
  productTopDiscounted: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  reviews: Review[];
  filters: FilterParams;
  lastFilterRequest: string; // Thêm field để track request cuối cùng
}

const initialState: ProductState = {
  products: [],
  reviews: [],
  productArrivals: [],
  productTopSelling: [],
  productTopDiscounted: [],
  searchProducts: [],
  product: null,
  loading: false,
  error: null,
  pagination: null,
  lastFilterRequest: "",
  filters: {
    page: 1,
    search: "",
    size: 9,
    minPrice: 10000,
    maxPrice: 10000000,
  },
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    {
      page = 1,
      search = "",
      size = 10,
      minPrice,
      maxPrice,
      categoryId,
      brandId,
      sortBy,
      sortDirection,
      isActive,
    }: {
      page?: number;
      search?: string;
      size?: number;
      minPrice?: number;
      maxPrice?: number;
      categoryId?: string;
      brandId?: string;
      sortBy?: string;
      sortDirection?: string;
      isActive?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/products?page=${page - 1}&search=${search}&size=${size}${
          minPrice ? `&minPrice=${minPrice}` : ""
        }${maxPrice ? `&maxPrice=${maxPrice}` : ""}${
          categoryId ? `&categoryId=${categoryId}` : ""
        }${brandId ? `&brandId=${brandId}` : ""}${
          sortBy ? `&sortBy=${sortBy}` : ""
        }${
          sortDirection ? `&sortDirection=${sortDirection}` : ""
        }&isActive=${isActive}`
      );
      console.log(response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data as { data: Product[]; pagination: Pagination };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async (search: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/search?keyword=${search}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      console.log(response.data.data);
      return response.data.data as Product[];
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (newProduct: ProductRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/products", newProduct);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Product;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (updatedProduct: ProductRequest, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/products/${updatedProduct._id}`,
        updatedProduct
      );
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Product;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return productId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data.message ||
          axiosError.message ||
          "An error occurred"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      console.log(response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Product;
    } catch (err: any) {
      return rejectWithValue(
        err.response.data.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  "product/fetchProductDetail",
  async (productId: string) => {
    const response = await api.get(`/api/products/${productId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data as ProductDetailResponse;
  }
);

export const filterProducts = createAsyncThunk(
  "product/filterProducts",
  async ({
    page = 1,
    search = "",
    size = 10,
    minPrice,
    maxPrice,
    categoryId,
    brandId,
    sortBy,
    sortDirection,
  }: {
    page?: number;
    search?: string;
    size?: number;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
    sortDirection?: string;
  }) => {
    // Tạo unique request ID để track
    const requestId = Date.now().toString();
    
    // Tạo URL params một cách có tổ chức
    const params = new URLSearchParams({
      page: (page - 1).toString(),
      search: search,
      size: size.toString(),
      isActive: 'true'
    });

    // Thêm các tham số optional
    if (minPrice !== undefined && minPrice > 0) {
      params.append('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined && maxPrice > 0) {
      params.append('maxPrice', maxPrice.toString());
    }
    if (categoryId) {
      params.append('categoryId', categoryId);
    }
    if (brandId) {
      params.append('brandId', brandId);
    }
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    if (sortDirection) {
      params.append('sortDirection', sortDirection);
    }

    const url = `/api/products?${params.toString()}`;
    
    console.log('=== FilterProducts Debug ===');
    console.log('Input params:', { page, search, size, minPrice, maxPrice, categoryId, brandId, sortBy, sortDirection });
    console.log('URLSearchParams:', Object.fromEntries(params));
    console.log('Final URL:', url);
    console.log('============================');
    
    const response = await api.get(url);
    
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    
    return { 
      ...response.data as { data: Product[]; pagination: Pagination },
      requestId 
    };
  }
);

// top selling products
export const fetchTopSellingProducts = createAsyncThunk(
  "product/fetchTopSellingProducts",
  async () => {
    const response = await api.get("/api/products/top-selling");
    console.log(response.data);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Product[];
  }
);

// top-discounted products
export const fetchTopDiscountedProducts = createAsyncThunk(
  "product/fetchTopDiscountedProducts",
  async () => {
    const response = await api.get("/api/products/top-discounted");
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Product[];
  }
);

// new-arrivals products
export const fetchNewArrivalsProducts = createAsyncThunk(
  "product/fetchNewArrivalsProducts",
  async () => {
    const response = await api.get("/api/products/new-arrivals");
    console.log(response.data);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as Product[];
  }
);

export const createReview = createAsyncThunk(
  "product/addReviewProduct",
  async (review: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/reviews/add", review);
      console.log(response.data);
      if (response.data.status === "error") {
        throw new Error(response.data.message);
      }
      return response.data.data as Review;
    } catch (err: any) {
      console.log(err.response.data.message);
      return rejectWithValue(
        err.response.data.message || "Failed to add review"
      );
    }
  }
);

export const fetchReviewsByProductId = createAsyncThunk(
  "product/fetchReviewsByProductId",
  async (productId: number) => {
    const response = await api.get(`/api/reviews/${productId}`);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data.data as any;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearProducts: (state) => {
      state.products = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Product[]; pagination: Pagination }>
        ) => {
          state.loading = false;
          state.products = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.push(action.payload);
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add product";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const index = state.products.findIndex(
            (product) => product._id === action.payload._id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.products = state.products.filter(
            (product) => product._id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.product = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductDetail.fulfilled,
        (state, action: PayloadAction<ProductDetailResponse>) => {
          state.loading = false;
          state.product = action.payload.data;
        }
      )
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product detail";
      })
      .addCase(filterProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Track request ID để tránh race condition
        state.lastFilterRequest = action.meta.requestId;
      })
      .addCase(
        filterProducts.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Product[]; pagination: Pagination; requestId: string }>
        ) => {
          state.loading = false;
          state.products = action.payload.data;
          state.pagination = action.payload.pagination;
          state.lastFilterRequest = action.payload.requestId;
        }
      )
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to filter products";
      })

      .addCase(
        searchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.searchProducts = action.payload;
        }
      )
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search products";
      })
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTopSellingProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.productTopSelling = action.payload;
        }
      )
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch top selling products";
      })
      .addCase(fetchTopDiscountedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTopDiscountedProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.productTopDiscounted = action.payload;
        }
      )
      .addCase(fetchTopDiscountedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch top discounted products";
      })
      .addCase(fetchNewArrivalsProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNewArrivalsProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.productArrivals = action.payload;
        }
      )
      .addCase(fetchNewArrivalsProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch new arrivals products";
      })

      .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      });
  },
});

export const { setFilters, clearProducts } = productSlice.actions;

export default productSlice.reducer;
