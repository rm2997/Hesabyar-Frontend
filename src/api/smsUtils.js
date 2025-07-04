import axios from "axios";
import endpoints from "./endpoints";
import { replace } from "react-router-dom";

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

export const sendForgetPassSms = async (userInfo, mobileNumber, token) => {
  let tokenBase = token;
  const token1 =
    tokenBase.length >= 25
      ? tokenBase.substring(0, 25)
      : tokenBase.substring(0);
  tokenBase = tokenBase.replace(token1, "");
  console.log("token1", token1);
  const token2 =
    tokenBase.length >= 25
      ? tokenBase.substring(0, 25)
      : tokenBase.substring(0);
  tokenBase = tokenBase.replace(token2, "");
  const token3 =
    tokenBase.length >= 25
      ? tokenBase.substring(0, 25)
      : tokenBase.substring(0);
  tokenBase = tokenBase.replace(token3, "");
  const token4 =
    tokenBase.length >= 25
      ? tokenBase.substring(0, 25)
      : tokenBase.substring(0);
  tokenBase = tokenBase.replace(token4, "");
  const token5 =
    tokenBase.length >= 25
      ? tokenBase.substring(0, 25)
      : tokenBase.substring(0);
  tokenBase = tokenBase.replace(token5, "");
  const token6 =
    tokenBase.length >= 25
      ? tokenBase.substring(0, 25)
      : tokenBase.substring(0);
  tokenBase = tokenBase.replace(token6, "");
  console.log("tokenBase", tokenBase);
  const reqBody = {
    mobile: mobileNumber,
    templateId: 764363,
    parameters: [
      {
        name: "USER",
        value: userInfo,
      },
      {
        name: "TOKEN1",
        value: token1,
      },
      {
        name: "TOKEN2",
        value: token2,
      },
      {
        name: "TOKEN3",
        value: token3,
      },
      {
        name: "TOKEN4",
        value: token4,
      },
      {
        name: "TOKEN5",
        value: token5,
      },
      {
        name: "TOKEN6",
        value: token6,
      },
    ],
  };

  try {
    // const response = await axiosClient.post(
    //   endpoints.sms.url(
    //     "9124491423",
    //     "7uyRcCHDKpobMJz0B0G3kOX4fO4gyTuwrrsSuWrgIrr50qvy",
    //     "300021150479",
    //     mobileNumber,
    //     smsText
    //   )
    // );
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
