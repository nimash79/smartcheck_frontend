import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getReports = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  search = "",
}) => {
  return http.get(`${API_URL}/reports`, {
    params: {
      page,
      limit,
      sortBy,
      order,
      search,
    },
  });
};

export const getReportsOfPerson = async ({
  personId,
  page = 1,
  limit = 5,
  sortBy = "createdAt",
  order = "desc",
  search = "",
  from = "",
  to = "",
}) => {
  return http.get(`${API_URL}/reports/person/${personId}`, {
    params: {
      page,
      limit,
      sortBy,
      order,
      search,
      from,
      to,
    },
  });
};

export const getReportsOfDepartment = async ({
  departmentId,
  page = 1,
  limit = 5,
  sortBy = "createdAt",
  order = "desc",
  search = "",
}) => {
  return http.get(`${API_URL}/reports/department/${departmentId}`, {
    params: {
      page,
      limit,
      sortBy,
      order,
      search,
    },
  });
};

export const getReportsOfPersonExcel = async ({
  personId,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  search = "",
  from = "",
  to = "",
 }) => {
  return http.get(`${API_URL}/reports/person/export/${personId}`, {
    responseType: "blob",
    params: {
      page,
      limit,
      sortBy,
      order,
      search,
      from,
      to,
    },
  });
};

export const getReportsOfDepartmentExcel = async ({
  departmentId,
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  search = "",
  from = "",
  to = "",
 }) => {
  return http.get(`${API_URL}/reports/department/export/${departmentId}`, {
    responseType: "blob",
    params: {
      page,
      limit,
      sortBy,
      order,
      search,
      from,
      to,
    },
  });
};
