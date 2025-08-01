import { Transition } from "@headlessui/react";
import { FC } from "react";
import { Link } from "react-router";
import Prices from "../components/Prices";
import { Product } from "../types/product.types";

interface Props {
  show: boolean;
  productImage: string;
  variantActive: number;
  sizeSelected?: string;
  colorSelected?: string;
  qualitySelected: number;
  product?: Product; // Thêm prop product để nhận thông tin sản phẩm thực tế
  productName?: string; // Fallback cho tên sản phẩm
  productPrice?: number; // Fallback cho giá sản phẩm
}

const NotifyAddTocart: FC<Props> = ({
  show,
  productImage,
  variantActive,
  qualitySelected,
  sizeSelected,
  colorSelected,
  product,
  productName,
  productPrice,
}) => {
  // Sử dụng thông tin từ product prop, fallback sang productName/productPrice, cuối cùng là giá trị mặc định
  const displayName = product?.name || productName || "Sản phẩm";
  const displayPrice = product?.sale && product?.salePrice 
    ? product.salePrice 
    : product?.price || productPrice || 0;

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={productImage}
            alt={displayName}
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>                <h3 className="text-base font-medium ">{displayName}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {sizeSelected && (
                    <>
                      <span className="font-medium">Size: </span>
                      <span>{sizeSelected}</span>
                    </>
                  )}
                  {sizeSelected && colorSelected && (
                    <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  )}
                  {colorSelected && (
                    <>
                      <span className="font-medium">Màu: </span>
                      <span>{colorSelected}</span>
                    </>
                  )}
                </p>
              </div>
              <Prices price={displayPrice} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`Qty ${qualitySelected}`}</p>

            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Transition
      appear
      show={show}
      className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      <p className="block text-base font-semibold leading-none">
        Added to cart!
      </p>
      <hr className=" border-slate-200 dark:border-slate-700 my-4" />
      {renderProductCartOnNotify()}
    </Transition>
  );
};

export default NotifyAddTocart;
