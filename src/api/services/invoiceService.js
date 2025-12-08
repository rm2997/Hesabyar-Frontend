import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateInvoice = async (invoiceData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.invoice.create,
    data: invoiceData,
  });
};

export const UpdateInvoice = async (id, invoiceData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.invoice.update(id),
    data: invoiceData,
  });
};

export const RemoveInvoice = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.invoice.delete(id),
  });
};

export const ShowAllInvoices = async (page = 1, limit = 12, search = "") => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.listAll(page, limit, search),
  });
};

export const ShowUserAllInvoices = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.listMy(page, limit, search),
  });
};

export const ShowReadyToAcceptInvoiceList = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.readyToAcceptList(page, limit, search),
  });
};

export const ShowUserAcceptedInvoices = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.listUserAcceptedInvoices(page, limit, search),
  });
};

export const ShowUserAcceptedInvoicesByCustomerId = async (
  customerId,
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.listUserAcceptedInvoicesByCustomerId(
      customerId,
      page,
      limit,
      search
    ),
  });
};

export const ShowInvoicesByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.listOne(id),
  });
};

export const SetInvoiceIsAccepted = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsAccepted(id),
  });
};

export const ShowInvoiceApprovedFile = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.getApprovedFile(id),
    responseType: "blob",
  });
};

export const GenerateNewToken = async (id) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.invoice.generateNewToken(id),
  });
};

export const ShowInvoiceByToken = async (token) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.invoice.listByToken(token),
  });
};

export const UpdateInvoiceCustomerFile = async (token, data) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.invoice.updateProformCustomerFile(token),
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
};

export const UpdateInvoiceDriver = async (token, data) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.invoice.updateInvoiceDriverInfo(token),

    data: data,
  });
};

export const SetInvoiceIsSent = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.invoice.setInvoiceIsSent(id),
  });
};

export const SendInvoiceDriverLink = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.invoice.sendInvoiceDriverLink(id),
  });
};
