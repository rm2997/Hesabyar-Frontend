import { DrawerMenu } from "../my-components/home/DrawerMenu";
import { Header } from "../my-components/home/Header";
import { Intro } from "../my-components/home/Intro";
import { Product } from "../my-components/home/Product";
import "../theme/home.css";
import { Cataloge } from "../my-components/home/Cataloge";
import { Footer } from "../my-components/home/Footer";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
export const Home = () => {
  const [drawer, setDrawer] = useState(false);
  return (
    <Flex position={"relative"} flexDir={"column"} dir="rtl">
      <div class="drawer-backdrop" id="drawerBackdrop" />
      <DrawerMenu setDrawer={setDrawer} open={drawer ? "open" : ""} />
      <Header setDrawer={setDrawer} />
      <Intro />
      <section className="section products-section" id="products">
        <div className="container">
          <div className="section-head ">
            <div>
              <h2 style={{ fontWeight: "bold" }}>محصولات</h2>
            </div>
          </div>
          <div className="showcase-list">
            <article className="showcase ">
              <Product
                pName="موتور آسانسور الکو پلاس ایرانی گیربکس"
                pComment="نسل جدید Elco"
                pImage={"elcoplus-motor.webp"}
                pPro1={"توان بیشتر"}
                pPro2={"لرزش کمتر"}
              />
            </article>
            <article className="showcase reverse">
              <Product
                pName="ریل آسانسور"
                pComment="حرکتی دقیق و مطمئن"
                pImage={"rail.webp"}
                pPro1={"حرکت روان"}
                pPro2={"لرانس دقیق"}
              />
            </article>
            <article className="showcase ">
              <Product
                pName="سیم بکسل آسانسور"
                pComment="کیفیتی برای حرکت مطمئن"
                pImage={"wire-rope.webp"}
                pPro1={"ایمنی بیشتر"}
                pPro2={"استحکام بالا"}
              />
            </article>
            <article className="showcase reverse ">
              <Product
                pName="موتور گیربکس SR5"
                pComment="قدرتی با امضای Elco"
                pImage={"sr5-motor.webp"}
                pPro1={"عملکرد پایدار"}
                pPro2={"قدرت بالا"}
              />
            </article>
            <article className="showcase reverse ">
              <Product
                pName="تراول کابل"
                pComment="اعتماد به کیفیت Hedsun"
                pImage={"travel-cable.webp"}
                pPro1={"انعطاف بالا"}
                pPro2={"طول عمر بالا"}
              />
            </article>
            <article className="showcase reverse ">
              <Product
                pName="فتوسل پرده‌ای"
                pComment="کیفیت اصیل Procell"
                pImage={"photocell.webp"}
                pPro1={"نصب آسان"}
                pPro2={"عملکرد پایدار"}
              />
            </article>
          </div>
        </div>
      </section>
      <div style={{ height: "18px" }} />

      <div
        className="section-head"
        id="catalogArea"
        style={{ marginTop: "52px", marginRight: "200px" }}
      >
        <div>
          <h3 style={{ fontWeight: "bold" }}>کاتالوگ ها</h3>
        </div>
      </div>
      <div className="catalog-strip ">
        <Cataloge enName={"MOTOR"} faName={"موتور"} />
        <Cataloge enName={"CABLE"} faName={"کابل"} />
        <Cataloge enName={"RAIL"} faName={"ریل"} />
        <Cataloge enName={"PHOTOCELL"} faName={"فتوسل"} />
        <Cataloge enName={"SERVICE"} faName={"پشتیبانی"} />
      </div>

      <Footer />
    </Flex>
  );
};
