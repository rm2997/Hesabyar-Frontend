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
  return await axiosClient.post(endpoints.sms.verify, reqBody);
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
