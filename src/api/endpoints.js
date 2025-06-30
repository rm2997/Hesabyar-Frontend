const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    forgetPassword: "/auth/forgetPassword",
    refresh: "/auth/refresh",
  },
  user: {
    create: "/users",
    delete: (id) => `/users/${id}`,
    profile: "/users/profile",
    update: (id) => `/users/${id}`,
    changePass: (id) => `/users/changePass/${id}`,
    changePassExternal: "/users/changePassExternal",
    sendSms: (id) => `/users/sms/${id}`,
    setLocation: "/users/location/",
    listAll: (page, limit, search) =>
      `/users?page=${page}&limit=${limit}&search=${search}`,
    findByMobile: (mobile) => `/users/forgetpassword/${mobile}`,
    findByToken: (token) => `/users/token/${token}`,
  },
  proforma: {
    listAll: (page, limit, search) =>
      `/proforma/user/my?page=${page}&limit=${limit}&search=${search}`,
    getApprovedFile: (id) => `/proforma/file/${id}`,
    convert: (id) => `/proforma/convert/${id}`,
    listByToken: (token) => `/proforma/token/${token}`,
    updateProformCustomerFile: (token) => `/proforma/token/${token}`,
    generateNewToken: (id) => `/proforma/generateNewToken/${id}`,
    update: (id) => `/proforma/${id}`,
    listOne: (id) => `/proforma/${id}`,
    detail: (id) => `/proforma/${id}`,
    create: "/proforma/",
    delete: (id) => `/proforma/${id}`,
    setProformaIsSent: (id) => `/proforma/sent/${id}`,
    setProformaIsAccepted: (id) => `/proforma/accept/${id}`,
  },
  invoice: {
    listAll: (page, limit, search) =>
      `/invoice/user/my?page=${page}&limit=${limit}&search=${search}`,
    update: (id) => `/invoice/${id}`,
    listOne: (id) => `/invoice/${id}`,
    detail: (id) => `/invoice/${id}`,
    create: "/invoice/",
    delete: (id) => `/invoice/${id}`,
    setInvoiceIsSent: (id) => `/invoice/sent/${id}`,
    setInvoiceIsAccepted: (id) => `/invoice/accept/${id}`,
    getApprovedFile: (id) => `/invoice/file/${id}`,
    listByToken: (token) => `/invoice/token/${token}`,
    updateProformCustomerFile: (token) => `/invoice/token/${token}`,
    generateNewToken: (id) => `/invoice/generateNewToken/${id}`,
  },
  customer: {
    listAll: (page, limit, search) =>
      `/customer?page=${page}&limit=${limit}&search=${search}`,
    update: (id) => `/customer/${id}`,
    listOne: (id) => `/customer/${id}`,
    detail: (id) => `/customer/${id}`,
    create: "/customer/",
    delete: (id) => `/customer/${id}`,
  },
  notifications: {
    unreadCount: "notifications/unread",
    markAsRead: (id) => `notifications/${id}/read`,
    markAsunread: (id) => `notifications/${id}/unread`,
    listSent: (page, limit, search) =>
      `/notifications/sent?page=${page}&limit=${limit}&search=${search}`,
    listReceived: (page, limit, search) =>
      `/notifications/received?page=${page}&limit=${limit}&search=${search}`,
    listOne: (id) => `/notifications/${id}`,
    create: "/notifications/",
    delete: (id) => `/notifications/${id}`,
    update: (id) => `/notifications/${id}`,
  },
  good: {
    listAll: (page, limit, search) =>
      `/goods?page=${page}&limit=${limit}&search=${search}`,
    listCount: (count) => `/goods/count/${count}`,
    update: (id) => `/goods/${id}`,
    listOne: (id) => `/goods/${id}`,
    detail: (id) => `/goods/${id}`,
    create: "/goods/",
    uploadExcel: "/goods/upload-excel",
    delete: (id) => `/goods/${id}`,
  },
  unit: {
    listAll: (page, limit, search) =>
      `/units?page=${page}&limit=${limit}&search=${search}`,
    update: (id) => `/units/${id}`,
    listOne: (id) => `/units/${id}`,
    detail: (id) => `/units/${id}`,
    create: "/units/",
    delete: (id) => `/units/${id}`,
  },
  sms: {
    likeToLike: "https://api.sms.ir/v1/send/likeToLike",
    bulk: "https://api.sms.ir/v1/send/bulk",
    verify: "https://api.sms.ir/v1/send/verify",
    url: (username, password, line, mobile, smsText) =>
      `https://api.sms.ir/v1/send?username=${username}&password=${password}&line=${line}&mobile=${mobile}&text=${smsText}`,
  },
};

export default endpoints;
