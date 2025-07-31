import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateInvoice = async (invoiceData) => {
  return apiRequest({
    method: "POST",
    url: endpoints.invoice.create,
    data: invoiceData,
  });
};

export const UpdateInvoice = async (id, invoiceData) => {
  return apiRequest({
    method: "PUT",
    url: endpoints.invoice.update(id),
    data: invoiceData,
  });
};

export const RemoveInvoice = async (id) => {
  return apiRequest({
    method: "DELETE",
    url: endpoints.invoice.delete(id),
  });
};

export const ShowAllInvoices = async (page = 1, limit = 10, search = "") => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listAll(page, limit, search),
  });
};

export const ShowUserAllInvoices = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listMy(page, limit, search),
  });
};

export const ShowUserAcceptedInvoices = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listMyAccepted(page, limit, search),
  });
};

export const ShowInvoicesByID = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listOne(id),
  });
};

export const SetInvoiceIsAccepted = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsAccepted(id),
  });
};

export const ShowInvoiceApprovedFile = async (id) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.getApprovedFile(id),
    responseType: "blob",
  });
};

export const GenerateNewToken = async (id) => {
  return apiRequest({
    method: "POST",
    url: endpoints.invoice.generateNewToken(id),
  });
};

export const ShowInvoiceByToken = async (token) => {
  return apiRequest({
    method: "GET",
    url: endpoints.invoice.listByToken(token),
  });
};

export const UpdateInvoiceCustomerFile = async (token, data) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.updateProformCustomerFile(token),
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
};

export const SetInvoiceIsSent = async (id) => {
  return apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsSent(id),
  });
};
