export const Footer = () => {
  return (
    <footer id="footerContact">
      <div className="container">
        <div className="footer-shell ">
          <svg className="footer-wave" preserveaspectratio="none">
            <path
              d="m28597-5190 6 488c810-381 520-120 1607 6l-16-505-1599 6"
              fill="rgba(255,255,255,.08)"
            ></path>
          </svg>
          <div className="footer-top">
            <div className="footer-col">
              <div className="logo-box">
                <img
                  alt="تجارت آسانبر علیا"
                  className="brand-logo-img"
                  src="/assets/images/logos/logo_small.webp"
                />
              </div>
              <h5>تجارت آسانبر علیا (آسانسورلند)</h5>
              <p className="footer-desc">
                شرکت تجارت آسانبر علیا (آسانسورلند) با سال‌ها تجربه در واردات و
                تأمین قطعات آسانسور، همواره در تلاش است تا با ارائه محصولات
                باکیفیت، قیمت مناسب و خدمات قابل اعتماد، رضایت مشتریان خود را
                جلب کند.
              </p>
              <div className="enamad-slot">اینماد</div>
            </div>
            <div className="footer-col links-col">
              <h5>لینک‌ها</h5>
              <ul className="footer-links">
                <li>
                  <a href="#home">صفحه اصلی</a>
                </li>
                <li>
                  <a href="#products">محصولات</a>
                </li>
                <li>
                  <a href="#catalogArea">کاتالوگ ها</a>
                </li>
              </ul>
            </div>
            <div className="footer-col contact-col">
              <h5>ارتباط و شبکه‌های اجتماعی</h5>
              <div className="contact-grid">
                <div className="contact-pill">
                  <div className="contact-info">
                    <span>تلفن ثابت</span>
                  </div>
                  <a
                    className="phone-icon"
                    href="tel:+982165842952"
                    aria-label="تماس با تلفن ثابت"
                  >
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.32 1.76.6 2.59a2 2 0 0 1-.45 2.11L9.25 10.75a16 16 0 0 0 4 4l1.33-1.02a2 2 0 0 1 2.11-.45c.83.28 1.7.48 2.59.6A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </a>
                </div>
                <div className="contact-pill">
                  <div className="contact-info">
                    <span>مدیر فروش</span>
                  </div>
                  <a
                    className="phone-icon"
                    href="tel:+989125274459"
                    aria-label="تماس با مدیر فروش"
                  >
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.1 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.32 1.76.6 2.59a2 2 0 0 1-.45 2.11L9.25 10.75a16 16 0 0 0 4 4l1.33-1.02a2 2 0 0 1 2.11-.45c.83.28 1.7.48 2.59.6A2 2 0 0 1 22 16.92Z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="social-row" aria-label="شبکه‌های اجتماعی">
                <a
                  className="social-btn"
                  href="https://t.me/asansorland"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تلگرام"
                >
                  <svg
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 4 11 13"></path>
                    <path d="m22 4-7 18-4-8-8-4 19-6Z"></path>
                  </svg>
                </a>
                <a
                  className="social-btn"
                  href="https://wa.me/989125274459"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساپ"
                >
                  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L0 24l6.39-1.67a11.83 11.83 0 0 0 5.65 1.44h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.15-3.39-8.43ZM12.05 21.7h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.74 9.74 0 0 1-1.5-5.18c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.11 1.02 6.97 2.89a9.78 9.78 0 0 1 2.88 6.97c0 5.43-4.42 9.84-9.83 9.84Zm5.4-7.37c-.29-.14-1.73-.85-2-.94-.27-.1-.47-.14-.67.14-.2.29-.77.94-.95 1.13-.17.2-.35.22-.64.07-.29-.15-1.23-.45-2.35-1.44-.87-.77-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.59.13-.13.29-.35.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.14-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.49 0 1.46 1.06 2.88 1.21 3.08.15.2 2.09 3.19 5.06 4.47.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.08 1.73-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.08-.12-.27-.19-.56-.34Z" />
                  </svg>
                </a>
                <a
                  className="social-btn"
                  href="https://instagram.com/asansorland"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="اینستاگرام"
                >
                  <svg
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M17.5 6.5h.01"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h5>آدرس</h5>
              <div className="contact-pill address-pill">
                <svg
                  aria-hidden="true"
                  className="icon"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z"></path>
                  <circle cx="12" cy="10" r="2"></circle>
                </svg>
                <span>
                  تهران منطقه 9 بزرگراه متوسلیان مجتمع شهر آسانسور یاران طبقه 4
                  واحد 446
                </span>
              </div>
              <div aria-label="نقشه گوگل مپ شرکت" className="map-wrap">
                <iframe
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202.5637746899268!2d51.3274071183898!3d35.676499803208415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8dfd9598638857%3A0x38e4a95836cd433a!2sBuilding%20Yaran!5e0!3m2!1sen!2s!4v1785582737984!5m2!1sen!2s"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  //referrerpolicy="strict-origin-when-cross-origin"
                  title="نقشه گوگل مپ"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              کلیه حقوق مادی و معنوی این سایت متعلق به گروه صنعتی آسانسورلند
              می‌باشد.
            </div>
            <div>طراحی و توسعه داده شده توسط رضا میرعسگری | 09125213288</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
