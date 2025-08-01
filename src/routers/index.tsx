import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import Preloader from "../components/Preloader";
import AccountBilling from "../containers/AccountPage/AccountBilling";
import AccountOrder from "../containers/AccountPage/AccountOrder";
import AccountOrderDetail from "../containers/AccountPage/AccountOrderDetail";
import AccountPage from "../containers/AccountPage/AccountPage";
import AccountPass from "../containers/AccountPage/AccountPass";
import AddBrand from "../containers/Admin/Brand/AddBrand";
import ListBrand from "../containers/Admin/Brand/ListBrand";
import AddCategories from "../containers/Admin/Categories/AddCategories";
import ListCategories from "../containers/Admin/Categories/ListCategories";
import ListContact from "../containers/Admin/Contact/ListContact";
import DashboardPage from "../containers/Admin/Dashboard/DashboardPage";
import AddDiscount from "../containers/Admin/Discount/AddDiscount";
import ListDiscount from "../containers/Admin/Discount/ListDiscount";
import DetailOrder from "../containers/Admin/Order/DetailOrder";
import ListOrder from "../containers/Admin/Order/ListOrder";
import AddProduct from "../containers/Admin/Products/AddProduct";
import ListProduct from "../containers/Admin/Products/ListProduct";
import ListUser from "../containers/Admin/Users/ListUser";
import ChatbotPage from "../containers/ChatbotPage/ChatbotPage";
import Page404 from "../containers/Page404/Page404";
import PageChangePass from "../containers/PageChangePass/PageChangePass";
import CheckoutPage from "../containers/PageCheckout/CheckoutPage";
import PageCollection2 from "../containers/PageCollection2";
import PageContact from "../containers/PageContact/PageContact";
import PageFaq from "../containers/PageFaq/PageFaq";
import PageForgotPassword from "../containers/PageForgotPassword/PageForgotPassword";
import PageHome from "../containers/PageHome/PageHome";
import PageLogin from "../containers/PageLogin/PageLogin";
import PageResetPassword from "../containers/PageResetPassword/PageResetPassword";
import PageSignUp from "../containers/PageSignUp/PageSignUp";
import PageVerifyOtp from "../containers/PageVerify/PageVerifyOtp";
import CartPage from "../containers/ProductDetailPage/CartPage";
import ProductDetailPage2 from "../containers/ProductDetailPage/ProductDetailPage2";
import SiteHeader from "../containers/SiteHeader";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import AdminLayout from "../layout/AdminLayout";
import Footer from "../shared/Footer/Footer";
import ScrollToTop from "./ScrollToTop";
import { Page } from "./types";

export const pages: Page[] = [
  { path: "/", component: PageHome },
  { path: "/cua-hang/:id", component: ProductDetailPage2 },
  { path: "/cua-hang", component: PageCollection2 },
  { path: "/cau-hoi-thuong-gap", component: PageFaq },
  { path: "/lien-he", component: PageContact },

];
export const privatePages: Page[] = [
  { path: "/account", component: AccountPage },
  { path: "/cart", component: CartPage },
  { path: "/account-change-password", component: AccountPass },
  { path: "/account-address", component: AccountBilling },
  { path: "/account-my-order", component: AccountOrder },
  { path: "/account-my-order/:id", component: AccountOrderDetail },
  { path: "/checkout", component: CheckoutPage },
]

export const adminPages: Page[] = [
  {
    path: "/admin",
    component: DashboardPage,

  },
  {
    path: '/admin/contact',
    component: ListContact
  },
  {
    path: '/admin/brand',
    component: ListBrand
  },
  {
    path: '/admin/brand/add',
    component: AddBrand
  },
  {
    path: '/admin/brand/edit/:id',
    component: AddBrand
  },
  {
    path: "/admin/products",
    component: ListProduct,
  },
  {
    path: "/admin/products/add",
    component: AddProduct,
  },
  {
    path: "/admin/products/edit/:id",
    component: AddProduct,
  },
  {
    path: "/admin/categories",
    component: ListCategories,
  },
  {
    path: "/admin/categories/add",
    component: AddCategories,
  },
  {
    path: "/admin/categories/edit/:id",
    component: AddCategories,
  },
  {
    path: "/admin/discounts",
    component: ListDiscount,
  },
  {
    path: "/admin/discounts/add",
    component: AddDiscount,
  },
  {
    path: "/admin/discounts/edit/:id",
    component: AddDiscount,
  },
  {
    path: "/admin/orders",
    component: ListOrder,
  },
  {
    path: "/admin/orders/edit/:id",
    component: DetailOrder,
  },
  {
    path: "/admin/users",
    component: ListUser,
  },
]
const employeePages = adminPages.filter(page =>
  page.path !== "/admin/users" && page.path !== "/admin"
);


const MyRoutes = () => {
  const { isAuthenticated, userRole, loading } = useContext<AuthContextType>(AuthContext as any);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loading]);

  if (showLoading) {
    return <Preloader />

  }

  // Hàm helper để render admin/employee routes
  const renderAdminRoute = (page: Page, index: number) => (
    <Route
      key={index}
      path={page.path}
      element={<page.component />}
    />
  );

  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <Routes>
        {pages.map(({ component: Component, path }, index) => {
          return <Route key={index} element={<>
            <SiteHeader />
            <Component />
            <ChatbotPage /> {/* Add Chatbot component here */}
            <Footer />
          </>} path={path} />;
        })}
        {isAuthenticated && (
          <>
            {
              userRole === "USER" && (
                privatePages.map(({ component: Component, path }, index) => {
                  return <Route key={index} element={<>
                    <SiteHeader />
                    <Component />
                    <ChatbotPage /> {/* Add Chatbot component here */}
                    <Footer />
                  </>} path={path} />;
                })
              )
            }
            {(userRole === "ADMIN" || userRole === "EMPLOYEE") && (
              <Route path="/" element={<AdminLayout />}>
                {(userRole === "ADMIN" ? adminPages : employeePages).map(renderAdminRoute)}
              </Route>
            )}

          </>
        )}

        <Route path="/signup" element={<>
          <SiteHeader />
          <PageSignUp />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
        <Route path="/login" element={<>
          <SiteHeader />
          <PageLogin />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
        <Route path="/forgot-password" element={<>
          <SiteHeader />
          <PageForgotPassword />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
        <Route path="/reset-password" element={<>
          <SiteHeader />
          <PageResetPassword />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
        <Route path="/change-password-new" element={<>
          <SiteHeader />
          <PageChangePass />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
        <Route path="/verify-otp" element={<>
          <SiteHeader />
          <PageVerifyOtp />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
        <Route path="*" element={<>
          <SiteHeader />
          <Page404 />
          <ChatbotPage /> {/* Add Chatbot component here */}
          <Footer />
        </>} />
      </Routes>


    </BrowserRouter >
  );
};

export default MyRoutes;
