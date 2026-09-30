export const DrawerMenu = () => {
  return (
    <>
      <aside aria-label="منوی موبایل" class="drawer" id="drawer">
        <div className="drawer-head">
          <div className="brand" style={{ gap: "10px" }}>
            <div
              className="logo-slot"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "2px solid #7B2DFF",
              }}
            ></div>
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
        <button aria-label="بستن منو" className="drawer-close" id="drawerClose">
          <svg
            className="icon"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewbox="0 0 24 24"
          >
            <path d="M6 6l12 12M18 6 6 18"></path>
          </svg>
        </button>
        <nav aria-label="منوی اصلی" className="drawer-nav">
          <a href="#home">صفحه اصلی</a>
          <a href="#products">محصولات</a>
          <a href="#catalogArea">کاتالوگ ها</a>
          <a href="#footerContact">تماس با ما</a>
        </nav>
        <div className="drawer-cta">
          <a className="btn btn-primary" href="#products">
            مشاهده محصولات
          </a>
          <a className="btn btn-ghost" href="#footerContact">
            ارتباط
          </a>
        </div>
      </aside>
    </>
  );
};
