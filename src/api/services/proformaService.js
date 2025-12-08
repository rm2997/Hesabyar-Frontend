import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateProforma = async (proformaData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.proforma.create,
    data: proformaData,
  });
};

export const ConvertProformaToInvoice = async (id) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.proforma.convert(id),
  });
};

export const UpdateProforma = async (id, proformaData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.proforma.update(id),
    data: proformaData,
  });
};

export const SetProformaIsSent = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.proforma.setProformaIsSent(id),
  });
};

export const SetProformaIsAccepted = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.proforma.setProformaIsAccepted(id),
  });
};

export const RemoveProforma = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.proforma.delete(id),
  });
};

export const ShowReadyToAcceptProformaList = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.readyToAcceptList(page, limit, search),
  });
};

export const ShowUserAllProformas = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.listAll(page, limit, search),
  });
};

export const ShowUserMyProformas = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.listMy(page, limit, search),
  });
};

export const ShowMyAcceptedProformas = async (
  page = 1,
  limit = 12,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.listMyAccepted(page, limit, search),
  });
};

export const ShowUserAcceptedProformasByCustomerId = async (
  customerId,
  page,
  limit,
  search
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.listUserAcceptedProformaByCustomerId(
      customerId,
      page,
      limit,
      search
    ),
  });
};
export const ShowProformasByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.listOne(id),
  });
};

export const ShowProformasByToken = async (token) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.listByToken(token),
  });
};

export const UpdateProformCustomerFile = async (token, data) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.proforma.updateProformCustomerFile(token),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const GenerateNewToken = async (id) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.proforma.generateNewToken(id),
  });
};

export const ShowProformaApprovedFile = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.proforma.getApprovedFile(id),
    responseType: "blob",
  });
};
