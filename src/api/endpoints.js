const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    forgetPassword: "/auth/forgetPassword",
    refresh: "/auth/refresh",
  },
  user: {
    profile: "/user/profile",
    update: "/user/update",
    list: "/user/list",
  },
  proforma: {
    listAll: "/proforma/user/my",
    listOne: (id) => `/proforma/${id}`,
    detail: (id) => `/proforma/${id}`,
    create: "/proforma/",
  },
  invoice: {
    list: "/invoice/list",
    detail: (id) => `/invoice/${id}`,
    create: "/invoice/create",
  },
};

export default endpoints;
