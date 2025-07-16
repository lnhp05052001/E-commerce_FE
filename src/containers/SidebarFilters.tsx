import debounce from "lodash/debounce";
import Slider from "rc-slider";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../features/brand/brandSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { filterProducts, setFilters } from "../features/product/productSlice";
import Radio from "../shared/Radio/Radio";
import { AppDispatch, RootState } from "../store";
import { Brand, Category } from "../types";

const DATA_sortOrderRadios = [
  { name: "A-Z", _id: "a-z" },
  { name: "Z-A", _id: "z-a" },
  { name: "Price Low - High", _id: "Price-low-high" },
  { name: "Price High - Low", _id: "Price-high-low" },
];

const PRICE_RANGE = [10000, 10000000];

const SidebarFilters = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { brands } = useSelector((state: RootState) => state.brands);
  const { filters } = useSelector((state: RootState) => state.products);

  const [rangePrices, setRangePrices] = useState([
    filters.minPrice || PRICE_RANGE[0],
    filters.maxPrice || PRICE_RANGE[1],
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    filters.categoryId?.toString() || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    filters.brandId?.toString() || null
  );
  const [sortOrderStates, setSortOrderStates] = useState<string>(() => {
    // Khởi tạo sortOrderStates đúng từ filters
    if (filters.sortBy && filters.sortDirection) {
      if (filters.sortBy === "name") {
        return filters.sortDirection === "asc" ? "a-z" : "z-a";
      } else if (filters.sortBy === "price") {
        return filters.sortDirection === "asc" ? "Price-low-high" : "Price-high-low";
      }
    }
    return "";
  });
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  // Component mount - load categories và brands
  useEffect(() => {
    dispatch(
      fetchCategories({ page: 1, search: "", size: 100, isActive: true })
    );
    dispatch(fetchBrands({ page: 1, search: "", size: 100, isActive: true }));
  }, [dispatch]);

  // Đồng bộ state với filters từ Redux store (chỉ khi filters thay đổi từ bên ngoài)
  useEffect(() => {
    console.log('Syncing state with filters:', filters);
    
    setRangePrices([
      filters.minPrice || PRICE_RANGE[0],
      filters.maxPrice || PRICE_RANGE[1],
    ]);
    setSelectedCategory(filters.categoryId?.toString() || null);
    setSelectedBrand(filters.brandId?.toString() || null);
    
    // Xử lý sortOrderStates dựa trên sortBy và sortDirection
    if (filters.sortBy && filters.sortDirection) {
      if (filters.sortBy === "name") {
        setSortOrderStates(filters.sortDirection === "asc" ? "a-z" : "z-a");
      } else if (filters.sortBy === "price") {
        setSortOrderStates(filters.sortDirection === "asc" ? "Price-low-high" : "Price-high-low");
      }
    } else {
      setSortOrderStates("");
    }
  }, [filters.categoryId, filters.brandId, filters.sortBy, filters.sortDirection, filters.minPrice, filters.maxPrice]);

  const applyFilters = (
    categoryId: string | null = selectedCategory,
    brandId: string | null = selectedBrand,
    sortId: string = sortOrderStates,
    resetPage: boolean = true
  ) => {
    let sortBy: string | undefined = undefined;
    let sortDirection: "asc" | "desc" | undefined = undefined;

    // Chỉ set sortBy và sortDirection khi có sortId
    if (sortId && sortId.trim() !== "") {
      switch (sortId) {
        case "a-z":
          sortBy = "name";
          sortDirection = "asc";
          break;
        case "z-a":
          sortBy = "name";
          sortDirection = "desc";
          break;
        case "Price-low-high":
          sortBy = "price";
          sortDirection = "asc";
          break;
        case "Price-high-low":
          sortBy = "price";
          sortDirection = "desc";
          break;
        default:
          // Reset sort nếu sortId không hợp lệ
          sortBy = undefined;
          sortDirection = undefined;
          break;
      }
    }

    const newFilters = {
      page: resetPage ? 1 : filters.page,
      search: filters.search || "",
      size: 9,
      minPrice: rangePrices[0],
      maxPrice: rangePrices[1],
      categoryId: categoryId && categoryId.trim() !== "" ? categoryId : undefined,
      brandId: brandId && brandId.trim() !== "" ? brandId : undefined,
      sortBy: sortBy,
      sortDirection: sortDirection,
    };

    console.log('Applying filters with sort:', {
      ...newFilters,
      sortInfo: { originalSortId: sortId, computedSortBy: sortBy, computedSortDirection: sortDirection }
    });
    
    dispatch(setFilters(newFilters));
    dispatch(filterProducts(newFilters));
  };

  const debouncedApplyFilters = useCallback(
    debounce(() => {
      console.log('Debounced apply filters called');
      applyFilters(selectedCategory, selectedBrand, sortOrderStates, true);
    }, 300),
    [selectedCategory, selectedBrand, sortOrderStates, rangePrices]
  );

  const handleChangeCategory = (id: string) => {
    const newCategory = id === selectedCategory ? null : id;
    setSelectedCategory(newCategory);
    // Giữ nguyên sort khi thay đổi category, reset về trang 1
    applyFilters(newCategory, selectedBrand, sortOrderStates, true);
  };

  const handleChangeBrand = (id: string) => {
    const newBrand = id === selectedBrand ? null : id;
    setSelectedBrand(newBrand);
    // Giữ nguyên sort khi thay đổi brand, reset về trang 1
    applyFilters(selectedCategory, newBrand, sortOrderStates, true);
  };

  const handlePriceChange = (prices: number | number[]) => {
    setRangePrices(prices as number[]);
    debouncedApplyFilters(); // Sử dụng debounce cho price range
  };

  const handleSortChange = (id: string) => {
    console.log('Sort changed to:', id);
    setSortOrderStates(id);
    // Giữ nguyên trang hiện tại khi sort (chỉ sort lại data hiện có)
    applyFilters(selectedCategory, selectedBrand, id, false);
  };

  const filteredCategories = categories?.filter((item: Category) =>
    item.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredBrands = brands?.filter((item: Brand) =>
    item.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const handleClearFilters = () => {
    console.log('Clearing all filters');
    
    // Reset tất cả state về giá trị mặc định
    setSelectedCategory(null);
    setSelectedBrand(null);
    setRangePrices([PRICE_RANGE[0], PRICE_RANGE[1]]);
    setSortOrderStates("");
    setCategorySearch("");
    setBrandSearch("");

    // Tạo filters mặc định - đảm bảo không có sort
    const defaultFilters = {
      page: 1,
      search: "",
      size: 9,
      minPrice: PRICE_RANGE[0],
      maxPrice: PRICE_RANGE[1],
      categoryId: undefined,
      brandId: undefined,
      sortBy: undefined,
      sortDirection: undefined,
    };

    console.log('Applying default filters:', defaultFilters);
    // Cập nhật state và gọi API
    dispatch(setFilters(defaultFilters));
    dispatch(filterProducts(defaultFilters));
  };

  const renderTabsCategories = () => (
    <div className="relative flex flex-col pb-8 space-y-4">
      <h3 className="font-semibold mb-2.5 mt-5">Danh mục</h3>
      <input
        type="text"
        placeholder="Tìm kiếm danh mục..."
        value={categorySearch}
        onChange={(e) => setCategorySearch(e.target.value)}
        className="mb-4 p-2 border border-neutral-200 rounded"
      />
      <div className="max-h-60 overflow-y-auto space-y-2 px-1">
        {filteredCategories?.map((item: Category) => (
          <div key={item._id} className="">
            <Radio
              id={item._id.toString()}
              name="category"
              label={item.name}
              checked={selectedCategory === item._id.toString()}
              sizeClassName="w-5 h-5"
              onChange={() => handleChangeCategory(item._id.toString())}
              className="!text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabsBrand = () => (
    <div className="relative flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Thương hiệu</h3>
      <input
        type="text"
        placeholder="Tìm kiếm thương hiệu..."
        value={brandSearch}
        onChange={(e) => setBrandSearch(e.target.value)}
        className="mb-4 p-2 border border-neutral-200 rounded"
      />
      <div className="max-h-60 overflow-y-auto space-y-2 px-1">
        {filteredBrands?.map((item: Brand) => (
          <div key={item._id} className="">
            <Radio
              id={item._id.toString()}
              name="brand"
              label={item.name}
              checked={selectedBrand === item._id.toString()}
              sizeClassName="w-5 h-5"
              onChange={() => handleChangeBrand(item._id.toString())}
              className="!text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabsPriceRage = () => (
    <div className="relative flex flex-col py-8 space-y-5 pr-3">
      <div className="space-y-5">
        <span className="font-semibold">Lọc theo giá</span>
        <Slider
          range
          min={PRICE_RANGE[0]}
          max={PRICE_RANGE[1]}
          step={10000}
          value={[rangePrices[0], rangePrices[1]]}
          allowCross={false}
          onChange={handlePriceChange}
        />
      </div>
      <div className="flex justify-between space-x-5">
        <div>
          <label
            htmlFor="minPrice"
            className="block text-sm font-medium text-neutral-700"
          >
            Từ
          </label>
          <div className="mt-1 relative rounded-md">
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
              đ
            </span>
            <input
              type="text"
              name="minPrice"
              disabled
              id="minPrice"
              className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 rounded-full bg-transparent"
              value={rangePrices[0]}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="maxPrice"
            className="block text-sm font-medium text-neutral-700"
          >
            Đến
          </label>
          <div className="mt-1 relative rounded-md">
            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
              đ
            </span>
            <input
              type="text"
              disabled
              name="maxPrice"
              id="maxPrice"
              className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 rounded-full bg-transparent"
              value={rangePrices[1]}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabsSortOrder = () => (
    <div className="relative flex flex-col py-8 space-y-4">
      <h3 className="font-semibold mb-2.5">Lọc theo</h3>
      {DATA_sortOrderRadios.map((item) => (
        <Radio
          id={item._id}
          key={item._id}
          name="radioNameSort"
          label={item.name}
          checked={sortOrderStates === item._id}
          sizeClassName="w-5 h-5"
          onChange={()=>{
            handleSortChange(item._id);
          }}
          className="!text-sm"
        />
      ))}
    </div>
  );

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      <button
        onClick={handleClearFilters}
        className="mb-5 text-blue-500 hover:underline"
      >
        Xóa tất cả bộ lọc
      </button>
      {renderTabsCategories()}
      {renderTabsBrand()}
      {renderTabsPriceRage()}
      {renderTabsSortOrder()}
    </div>
  );
};

export default SidebarFilters;
