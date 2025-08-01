import React from "react";
import { CustomLink } from "../../data/types";
export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const widgetMenus: WidgetFooterMenu[] = [
  {
    id: "1",
    title: "Bắt đầu",
    menus: [
      { href: "#", label: "Ghi chú phát hành" },
      { href: "#", label: "Hướng dẫn nâng cấp" },
      { href: "#", label: "Hỗ trợ trình duyệt" },
      { href: "#", label: "Chế độ tối" },
    ],
  },
  {
    id: "2",
    title: "Khám phá",
    menus: [
      { href: "#", label: "Tạo mẫu" },
      { href: "#", label: "Hệ thống thiết kế" },
      { href: "#", label: "Giá cả" },
      { href: "#", label: "Bảo mật" },
    ],
  },
  {
    id: "3",
    title: "Tài nguyên",
    menus: [
      { href: "#", label: "Thực hành tốt nhất" },
      { href: "#", label: "Hỗ trợ" },
      { href: "#", label: "Nhà phát triển" },
      { href: "#", label: "Học thiết kế" },
    ],
  },
  {
    id: "4",
    title: "Cộng đồng",
    menus: [
      { href: "#", label: "Diễn đàn thảo luận" },
      { href: "#", label: "Quy tắc ứng xử" },
      { href: "#", label: "Đóng góp" },
      { href: "#", label: "Tham khảo API" },
    ],
  },
];

const Footer: React.FC = () => {
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
          {menu.title}
        </h2>
        <ul className="mt-5 space-y-3">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <a
                key={index}
                className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="nc-Footer relative py-20 lg:pt-24 lg:pb-24 border-t border-neutral-200 dark:border-neutral-700">
      <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-10 ">
        {widgetMenus.map(renderWidgetMenuItem)}
      </div>
    </div>
  );
};

export default Footer;
