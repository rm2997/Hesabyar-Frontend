import { X } from "lucide-react";
import { GetPriceList } from "../../api/services/goodsService";

export const DrawerMenu = ({ open, setDrawer }) => {
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
    <>
      <aside aria-label="منوی موبایل" className={`drawer ${open}`} id="drawer">
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
        <button
          aria-label="بستن منو"
          className="drawer-close"
          id="drawerClose"
          onClick={() => {
            setDrawer(false);
          }}
        >
          <X />
        </button>
        <nav aria-label="منوی اصلی" className="drawer-nav">
          <a href="#home">صفحه اصلی</a>
          <a href="#products">محصولات</a>
          <a href="#catalogArea">کاتالوگ ها</a>
          <a href="#" onClick={getPriceList}>
            لیست قیمت
          </a>
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
