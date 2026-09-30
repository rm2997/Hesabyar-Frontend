import { Icon } from "@chakra-ui/react";
import { LucideUserRound, MoonIcon, PhoneIcon } from "lucide-react";

export const Header = () => {
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
            <a href="#footerContact">تماس با ما</a>
          </nav>
          <div className="nav-actions">
            <a
              aria-label="حساب کاربری"
              className="btn btn-ghost"
              href="/myHome"
            >
              {/* <svg
                className="icon"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewbox="0 0 24 24"
              >
                <path d="M20 21a8 8 0 0 0-16 0"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg> */}
              <Icon>
                <LucideUserRound />
              </Icon>
              <span className="label">حساب کاربری</span>
            </a>
            <button
              aria-label="تغییر حالت روشن و تاریک"
              className="theme-toggle"
              id="themeToggle"
              type="button"
            >
              {/* <svg
                className="icon"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewbox="0 0 30 30"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path>
              </svg> */}
              <MoonIcon />
            </button>
            <a
              aria-label="تماس با ما"
              className="btn btn-primary"
              href="#footerContact"
            >
              {/* <svg
                className="icon"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewbox="0 0 38 38"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.32 1.76.6 2.59a2 2 0 0 1-.45 2.11L9.25 10.75a16 16 0 0 0 4 4l1.33-1.02a2 2 0 0 1 2.11-.45c.83.28 1.7.48 2.59.6A2 2 0 0 1 22 16.92Z"></path>
              </svg> */}
              <PhoneIcon />
              <span className="label">تماس با ما</span>
            </a>
            <button
              aria-label="باز کردن منو"
              className="menu-toggle"
              id="menuToggle"
              type="button"
            >
              <svg
                className="icon"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                viewbox="0 0 38 38"
              >
                <path d="M4 7h16M4 12h16M4 17h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
