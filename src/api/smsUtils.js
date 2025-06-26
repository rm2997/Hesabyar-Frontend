import axios from "axios";
import endpoints from "./endpoints";

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "7uyRcCHDKpobMJz0B0G3kOX4fO4gyTuwrrsSuWrgIrr50qvy",
  },
});

// export const sendLocationSms = async (user) => {
//   const body =
//     "همکار محترم " +
//     user.userfname +
//     " " +
//     user.userlname +
//     " " +
//     "لطفا در اولین فرصت موقعیت خود را از طریق برنامه به مجموعه ارسال فرمایید.";

//   const reqBody = {
//     lineNumber: 30002108002437,
//     messageText: body,
//     mobiles: [user.usermobilenumber],
//     sendDateTime: null,
//   };
//   return await axiosClient.post(endpoints.sms.bulk, reqBody);
// };

export const sendLocationSms = async (mobileNumber, userName) => {
  const reqBody = {
    mobile: mobileNumber,
    templateId: 724507,
    parameters: [
      {
        name: "USERNAME",
        value: userName,
      },
    ],
  };
  try {
    const response = await axiosClient.post(endpoints.sms.verify, reqBody);
    return response;
    if (!response) throw new Error();
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error?.response?.data?.message || "خطای سرور");
    } else if (error?.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const sendForgetPassSms = async (mobileNumber, token) => {
  const reqBody = {
    mobile: mobileNumber,
    templateId: 123456,
    parameters: [
      {
        token: token,
      },
    ],
  };
  try {
    const response = await axiosClient.post(endpoints.sms.verify, reqBody);
    return response;
    if (!response) throw new Error();
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error?.response?.data?.message || "خطای سرور");
    } else if (error?.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد-${error.message}`);
    }
  }
};

export const sendValidationKeySms = async (mobileNumber, key) => {
  const reqBody = {
    mobile: mobileNumber,
    templateId: 580229,
    parameters: [
      {
        name: "CODE",
        value: key,
      },
    ],
  };
  return await axiosClient.post(endpoints.sms.verify, reqBody);
};

export const sendUpdateProformaSms = async (customer, mobileNumber, link) => {
  const reqBody = {
    mobile: mobileNumber,
    templateId: 763246,
    parameters: [
      {
        name: "CUSTOMER",
        value: customer,
        name: "TOKEN1",
        value: link.length > 25 ? link.substring(0, 25) : link,
        name: "TOKEN2",
        value:
          link.length > 25 && link.length <= 50
            ? link.substring(26, 25)
            : link.substring(26),
      },
    ],
  };
  try {
    const response = await axiosClient.post(endpoints.sms.verify, reqBody);
    if (!response) throw new Error();
    return response;
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error?.response?.data?.message || "خطای سرور");
    } else if (error?.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد${error.message}`);
    }
  }
};

export const sendUpdateInvoiceSms = async (customer, mobileNumber, link) => {
  const reqBody = {
    mobile: mobileNumber,
    templateId: 763246,
    parameters: [
      {
        name: "CUSTOMER",
        value: customer,
        name: "TOKEN1",
        value: link.length > 25 ? link.substring(0, 25) : link,
        name: "TOKEN2",
        value:
          link.length > 25 && link.length <= 50
            ? link.substring(26, 25)
            : link.substring(26),
      },
    ],
  };
  try {
    const response = await axiosClient.post(endpoints.sms.verify, reqBody);
    if (!response) throw new Error();
    return response;
  } catch (error) {
    if (error.response) {
      // پاسخ از سمت سرور (۴xx یا ۵xx)
      throw new Error(error?.response?.data?.message || "خطای سرور");
    } else if (error?.request) {
      // درخواست فرستاده شده ولی پاسخی نیومده
      throw new Error("پاسخی از سرور دریافت نشد");
    } else {
      // خطای دیگر (مثلاً در خود کد)
      throw new Error(`مشکلی در ارسال درخواست رخ داد${error.message}`);
    }
  }
};
