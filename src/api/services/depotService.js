import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateDepot = async (DepotData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.create,
    data: DepotData,
  });
};

export const UploadDriverSignImage = async (id, data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.uploadDriverSignImage(id),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UploadExitGoodImage = async (id, data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.uploadExitGoodImage(id),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UpdateDepotImageFile = async (id, data) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.depot.updateDepotImageFile(id),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UpdateDepot = async (id, depotData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.depot.update(id),
    data: depotData,
  });
};

export const ShowDepotImageFile = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.getDepotImageFile(id),
    responseType: "blob",
  });
};

export const UploadDepotsFile = async (formData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.create,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const RemoveDepot = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.depot.delete(id),
  });
};

export const ShowDepotByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.listOne(id),
  });
};

export const ShowAllDepots = async (
  page = 1,
  limit = 10,
  type,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.listAll(page, limit, type, search),
  });
};

export const ShowDepotAcceptList = async (
  page = 1,
  limit = 10,
  type,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.acceptList(page, limit, type, search),
  });
};

export const ShowDepotWareHouseList = async (
  page = 1,
  limit = 10,
  type,
  search = ""
) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.warehouseList(page, limit, type, search),
  });
};

export const SetDepotIsAccepted = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.depot.setDepotIsAccepted(id),
  });
};

export const SetDepotIsSent = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.depot.setDepotIsSent(id),
  });
};

export const GenerateNewToken = async (id) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.generateNewToken(id),
  });
};

export const ShowDepotByToken = async (token) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.listByToken(token),
  });
};

export const UpdateDepotDriverInfo = async (token, data) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.depot.updateDriverInfo(token),
    data: data,
  });
};

export const InsertDepotDriverSignImage = async (id, data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.insertDriverSignImage(id),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const InsertDepotExitGoodImage = async (id, data) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.depot.insertExitGoodImage(id),
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const SetDepotIsAcceptedByWarehouseMan = async (id) => {
  return await apiRequest({
    method: "PATCH",
    url: endpoints.depot.setDepotIsWarehouseAccepted(id),
  });
};

export const ShowDepotWarehouseImages = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.depot.getDepotWarehouseImages(id),
  });
};
