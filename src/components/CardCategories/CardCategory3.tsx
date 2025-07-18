import { FC } from "react";
import { Link } from "react-router";
import { CATS_DISCOVER } from "../../components/DiscoverMoreSlider";
import NcImage from "../../shared/NcImage/NcImage";

export interface CardCategory3Props {
  className?: string;
  featuredImage?: string;
  name?: string;
  desc?: string;
  color?: string;
}

const CardCategory3: FC<CardCategory3Props> = ({
  className = "",
  featuredImage = CATS_DISCOVER[2].featuredImage,
  name = CATS_DISCOVER[2].name,
  color = CATS_DISCOVER[2].color,
}) => {
  // Tạo URL với brand filter
  const getLinkUrl = () => {
    const brandName = name?.toLowerCase();
    return `/cua-hang?brand=${encodeURIComponent(brandName || '')}`;
  };

  return (
    <Link
      to={getLinkUrl()}
      className={`nc-CardCategory3 block ${className}`}
      data-nc-id="CardCategory3"
    >
      <div
        className={`relative w-full aspect-w-16 aspect-h-11 sm:aspect-h-9 h-0 rounded-2xl overflow-hidden group ${color}`}
      >
        <div>
          <NcImage
            src={featuredImage}
            containerClassName="absolute inset-5 sm:inset-8"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-[260px] h-auto object-contain drop-shadow-xl"
          />
        </div>
        <span className="opacity-0 group-hover:opacity-40 absolute inset-0 bg-black/10 transition-opacity"></span>

        <div>
          <div className="absolute inset-5 sm:inset-8 flex flex-col">
            <div className="max-w-xs">
              <span className={`block mb-2 text-2xl font-bold text-slate-1000`}>
                {name}
              </span>
            </div>
            <div className="mt-auto flex justify-end">
              <span className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
                Xem thêm
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardCategory3;
