import React, { FC } from "react";
import { NavLink } from "react-router";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  return (
    <div className="nc-CommonLayoutProps container">
      <div className="mt-14 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex justify-center space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {[
              {
                name: "Account info",
                link: "/account",
              },
              {
                name: " My order",
                link: "/account-my-order",
              },
              {
                name: "Change password",
                link: "/account-change-password",
              },
              {
                name: "Change Address",
                link: "/account-address",
              },
            ].map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) =>
                  `block py-5 md:py-8 border-b-2 border-transparent flex-shrink-0  text-sm sm:text-base ${isActive
                    ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;
