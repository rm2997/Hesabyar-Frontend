const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    forgetPassword: "/auth/forgetPassword",
    refresh: "/auth/refresh",
    resendValidationKey: "/auth/resendValidationKey",
    secondLogin: "/auth/secondLogin",
    newCaptcha: "/auth/captcha",
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
    listAllProfiles: (page, limit, search) =>
      `/users/profiles?page=${page}&limit=${limit}&search=${search}`,
    findByMobile: (mobile) => `/users/forgetpassword/${mobile}`,
    findByToken: (token) => `/users/token/${token}`,
    findById: (id) => `/users/profile/${id}`,
    checkPassword: (id) => `/users/checkPassword/${id}`,
  },
  proforma: {
    listMy: (page, limit, search) =>
      `/proforma/user/my?page=${page}&limit=${limit}&search=${search}`,
    listMyAccepted: (page, limit, search) =>
      `/proforma/user/accepted?page=${page}&limit=${limit}&search=${search}`,
    listUserAcceptedInvoicesByCustomerId: (customerId, page, limit, search) =>
      `/proforma/customer/accepted/${customerId}?page=${page}&limit=${limit}&search=${search}`,
    listAll: (page, limit, search) =>
      `/proforma?page=${page}&limit=${limit}&search=${search}`,
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
      `/invoice?page=${page}&limit=${limit}&search=${search}`,
    listMy: (page, limit, search) =>
      `/invoice/user/my?page=${page}&limit=${limit}&search=${search}`,
    listUserAcceptedInvoices: (page, limit, search) =>
      `/invoice/all/accepted?page=${page}&limit=${limit}&search=${search}`,
    listUserAcceptedInvoicesByCustomerId: (customerId, page, limit, search) =>
      `/invoice/customer/accepted/${customerId}?page=${page}&limit=${limit}&search=${search}`,
    update: (id) => `/invoice/${id}`,
    listOne: (id) => `/invoice/${id}`,
    detail: (id) => `/invoice/${id}`,
    create: "/invoice/",
    delete: (id) => `/invoice/${id}`,
    setInvoiceIsSent: (id) => `/invoice/sent/${id}`,
    setInvoiceIsAccepted: (id) => `/invoice/accept/${id}`,
    getApprovedFile: (id) => `/invoice/file/${id}`,
    getApprovedFileByToken: (token) => `/invoice/file/token/${token}`,
    listByToken: (token) => `/invoice/token/${token}`,
    updateProformCustomerFile: (token) => `/invoice/token/${token}`,
    updateInvoiceDriverInfo: (token) => `/invoice/driver/token/${token}`,
    generateNewToken: (id) => `/invoice/generateNewToken/${id}`,
    sendInvoiceDriverLink: (id) => `/invoice/sendDriverLink/${id}`,
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
  depot: {
    listAll: (page, limit, type, search) =>
      `/depot?page=${page}&limit=${limit}&type=${type}&search=${search}`,
    acceptList: (page, limit, type, search) =>
      `/depot/acceptList?page=${page}&limit=${limit}&type=${type}&search=${search}`,
    warehouseList: (page, limit, type, search) =>
      `/depot/warehouseList?page=${page}&limit=${limit}&type=${type}&search=${search}`,
    update: (id) => `/depot/${id}`,
    updateDepotImageFile: (id) => `/depot/image/${id}`,
    getDepotImageFile: (id) => `/depot/image/${id}`,
    listOne: (id) => `/depot/${id}`,
    detail: (id) => `/depot/${id}`,
    create: "/depot/",
    uploadDriverSignImage: (id) => `/depot/driverSignImage/${id}`,
    uploadExitGoodImage: (id) => `/depot/exitGoodImage/${id}`,
    delete: (id) => `/depot/${id}`,
    setDepotIsAccepted: (id) => `/depot/accept/${id}`,
    setDepotIsWarehouseAccepted: (id) => `/depot/warehouseAccept/${id}`,
    getDepotWarehouseImages: (id) => `/depot/warehouseImages/${id}`,
    getDepotWarehouseImagesByToken: (token) =>
      `/depot/warehouseImages/token/${token}`,
    setDepotIsSent: (id) => `/depot/sent/${id}`,
    generateNewToken: (id) => `/depot/generateNewToken/${id}`,
    listByToken: (token) => `/depot/token/${token}`,
    updateDriverInfo: (token) => `/depot/token/${token}`,
    insertDriverSignImage: (id) => `/depot/driverSignImage/${id}`,
    insertExitGoodImage: (id) => `/depot/exitGoodImage/${id}`,
  },
  sms: {
    likeToLike: "https://api.sms.ir/v1/send/likeToLike",
    bulk: "https://api.sms.ir/v1/send/bulk",
    verify: "https://api.sms.ir/v1/send/verify",
    url: (username, password, line, mobile, smsText) =>
      `https://api.sms.ir/v1/send?username=${username}&password=${password}&line=${line}&mobile=${mobile}&text=${smsText}`,
  },
  sepidar: {
    test: "/sepidar/test",
    connectionData: "/sepidar/connectionData",
    syncGoods: "/sepidar/syncGoods",
    syncUnits: "/sepidar/syncUnits",
    syncCustomers: "/sepidar/syncCustomers",
    getFiscalYear: "/sepidar/getFiscalYear",
    getAllStocks: "/sepidar/getAllStocks",
  },
};

export default endpoints;
