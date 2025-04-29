const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    forgetPassword: "/auth/forgetPassword",
    refresh: "/auth/refresh",
  },
  user: {
    profile: "/users/profile",
    update: "/users/update",
    listAll: "/users/",
  },
  proforma: {
    listAll: "/proforma/user/my",
    update: (id) => `/proforma/${id}`,
    listOne: (id) => `/proforma/${id}`,
    detail: (id) => `/proforma/${id}`,
    create: "/proforma/",
    delete: (id) => `/proforma/${id}`,
  },
  invoice: {
    list: "/invoice/list",
    detail: (id) => `/invoice/${id}`,
    create: "/invoice/create",
  },
  notifications: {
    unreadCount: "notifications/unread",
    markAsRead: (id) => `notifications/${id}/read`,
    listAll: "/notifications/all",
    listOne: (id) => `/notifications/${id}`,
    create: "/notifications/",
    delete: (id) => `/notifications/${id}`,
    update: (id) => `/notifications/${id}`,
  },
};

export default endpoints;
