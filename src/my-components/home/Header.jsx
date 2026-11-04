import { Icon } from "@chakra-ui/react";
import { LucideUserRound, Menu, MoonIcon, PhoneIcon } from "lucide-react";
import { GetPriceList } from "../../api/services/goodsService";

export const Header = ({ setDrawer }) => {
  const getPriceList = async () => {
    try {
      const res = await GetPriceList();
      const file = new Blob([res.data], {
        type: res.data.type || "application/pdf",
      });

      const fileUrl = window.URL.createObjectURL(file);

      window.open(fileUrl, "_blank");

      // آزادسازی حافظه پس از مدتی
      setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      console.error("Error getting price list:", error);
    }
  };

  return (
    <div className="site-header">
      <div className="nav-shell">
        <div className="nav-row">
          <div className="brand">
            <div className="logo-slot">
              <img
                alt="تجارت آسانبر علیا"
                className="brand-logo-img"
                src="/assets/images/logos/logo_small.webp"
              />
            </div>
            <div className="brand-text">
              <strong>تجارت آسانبر علیا</strong>
              <span>آسانسورلند</span>
            </div>
          </div>
          <nav aria-label="منوی اصلی" className="nav-links">
            <a href="#home">صفحه اصلی</a>
            <a href="#products">محصولات</a>
            <a href="#catalogArea">کاتالوگ ها</a>
            <a href="#" onClick={getPriceList}>
              لیست قیمت
            </a>
            <a href="#footerContact">تماس با ما</a>
          </nav>
          <div className="nav-actions">
            <a
              aria-label="حساب کاربری"
              className="btn btn-ghost"
              href="/myHome"
              type="button"
            >
              <LucideUserRound className="icon" size={"md"} />
              <span className="label">حساب کاربری</span>
            </a>
            <button
              aria-label="تغییر حالت روشن و تاریک"
              className="theme-toggle"
              id="themeToggle"
              type="button"
            >
              <MoonIcon />
            </button>
            <a
              aria-label="تماس با ما"
              className="btn btn-primary"
              href="#footerContact"
              type="button"
            >
              <PhoneIcon className="icon" />
              <span className="label">تماس با ما</span>
            </a>
            <button
              aria-label="باز کردن منو"
              className="menu-toggle"
              id="menuToggle"
              type="button"
              onClick={() => {
                setDrawer(true);
              }}
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
