import { apiRequest } from "../axiosClient";
import endpoints from "../endpoints";

export const CreateCustomer = async (customerData) => {
  return await apiRequest({
    method: "POST",
    url: endpoints.customer.create,
    data: customerData,
  });
};

export const UpdateCustomer = async (id, customerData) => {
  return await apiRequest({
    method: "PUT",
    url: endpoints.customer.update(id),
    data: customerData,
  });
};

export const RemoveCustomer = async (id) => {
  return await apiRequest({
    method: "DELETE",
    url: endpoints.customer.delete(id),
  });
};

export const ShowCustomerByID = async (id) => {
  return await apiRequest({
    method: "GET",
    url: endpoints.customer.listOne(id),
  });
};

export const ShowAllCustomers = async (page = 1, limit = 10, search = "") => {
  return await apiRequest({
    method: "GET",
    url: endpoints.customer.listAll(page, limit, search),
  });
};
