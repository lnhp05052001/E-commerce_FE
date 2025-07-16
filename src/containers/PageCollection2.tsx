import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { filterProducts, setFilters } from "../features/product/productSlice";
import Pagination from "../shared/Pagination/Pagination";
import { AppDispatch, RootState } from "../store";
import SidebarFilters from "./SidebarFilters";

export interface PageCollection2Props {
  className?: string;
}

const PageCollection2: FC<PageCollection2Props> = ({ className = "" }) => {
  const { products, error, pagination, filters, loading } = useSelector((state: RootState) => state.products);
  const dispatch: AppDispatch = useDispatch()

  // Component mount - load sản phẩm với filters mặc định một lần
  useEffect(() => {
    console.log('PageCollection2 mounted, filters:', filters);
    if (!products.length && !loading) {
      dispatch(filterProducts(filters));
    }
  }, [dispatch]);

  // Chỉ gọi API khi filters thay đổi (không phải lần đầu mount)
  useEffect(() => {
    console.log('Filters changed, applying filters:', filters);
    dispatch(filterProducts(filters));
  }, [filters.page, filters.categoryId, filters.brandId, filters.sortBy, filters.sortDirection, filters.minPrice, filters.maxPrice, dispatch]);

  const onPageChange = (page: number) => {
    // Kiểm tra xem page có hợp lệ không
    if (page >= 1 && pagination && page <= pagination.totalPages) {
      const newFilters = { ...filters, page };
      dispatch(setFilters(newFilters));
      dispatch(filterProducts(newFilters));
    }
  };
  return (
    <div className={`nc-PageCollection2 ${className}`} data-nc-id="PageCollection2">
      <title>Category || fashionFactory Ecommerce Template</title>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          <main>
            {/* LOOP ITEMS */}
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar with sticky positioning */}
              <aside className="lg:w-1/3 xl:w-1/4 pr-4">
                <div className="sticky top-4" style={{ height: "fit-content" }}>
                  <SidebarFilters />
                </div>
              </aside>

              <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mx-4 border-t lg:border-t-0"></div>

              <div className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Đang tải sản phẩm...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center min-h-[300px]">
                    <span className="text-red-500">{error}</span>
                  </div>
                ) : products?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
                    {products.map((product, index) => (
                      <ProductCard key={`${product._id}-${index}`} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                      <p className="text-sm text-gray-400 mt-1">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center items-center mt-10">
                  {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageCollection2;
