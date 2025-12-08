import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateUnit = async (unitData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.unit.create,
    data: unitData,
  });
};

export const UpdateUnit = async (id, unitData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.unit.update(id),
    data: unitData,
  });
};

export const RemoveUnit = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.unit.delete(id),
  });
};

export const ShowUnitByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.unit.listOne(id),
  });
};

export const ShowAllUnits = async (page = 1, limit = 12, search = "") => {
  return await apiRequest({
    method: "GET",
    url: endpoints.unit.listAll(page, limit, search),
  });
};
