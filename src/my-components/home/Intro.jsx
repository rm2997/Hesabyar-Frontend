export const Intro = () => {
  return (
    <section id="home" className="hero section">
      <div className="container">
        <div className="hero-shell">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-title">
                <span style={{ fontWeight: "bold" }} className="title-main">
                  تجارت آسانبر علیا
                </span>
                <span className="title-sub">آسانسورلند</span>
              </h1>
              <div className="hero-divider">
                <span></span>
                <i></i>
                <span></span>
              </div>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#products">
                  مشاهده محصولات
                </a>
                <a className="btn btn-ghost" href="#footerContact">
                  تماس با ما
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="visual-frame" data-parallax="">
                <img
                  alt="لوگوی آسانسورلند"
                  className="hero-product"
                  loading="eager"
                  src="/assets/images/logos/hero-logo.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
