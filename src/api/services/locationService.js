export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const googleMapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          resolve({
            latitude,
            longitude,
            googleMapLink,
          });
        },
        (err) => {
          reject("Error getting position:" + err);
        }
      );
    else reject("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
  });
};
