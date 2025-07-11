import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiscoverMoreSlider from "../../components/DiscoverMoreSlider";
import SectionHero from "../../components/SectionHero/SectionHero";
import SectionHowItWork from "../../components/SectionHowItWork/SectionHowItWork";
import SectionSliderCategories from "../../components/SectionSliderCategories/SectionSliderCategories";
import SectionSliderProductCard from "../../components/SectionSliderProductCard";
import SectionSliderProductCard2 from "../../components/SectionSliderProductCard2";
import { fetchNewArrivalsProducts, fetchTopSellingProducts } from "../../features/product/productSlice";
import { AppDispatch, RootState } from "../../store";

function PageHome() {
  const dispatch: AppDispatch = useDispatch();
  const { productTopSelling, productArrivals } = useSelector((state: RootState) => state.products);
  useEffect(() => {
    dispatch(fetchTopSellingProducts());
    dispatch(fetchNewArrivalsProducts());
  }, [dispatch]);
  return (
    <div className="nc-PageHome relative overflow-hidden">
      {/* SECTION HERO */}
      <SectionHero />

      <div className="mt-24 lg:mt-32">
        <DiscoverMoreSlider />
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        {/* SECTION */}
        <SectionSliderProductCard
          data={productTopSelling}
        />

        <SectionSliderProductCard2
          data={productArrivals}
        />

        <SectionSliderCategories />
        
        <SectionHowItWork />

      </div>
    </div>
  );
}

export default PageHome;
