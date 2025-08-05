import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getDepartments = () => {
    return http.get(`${API_URL}/departments`);
}

export const getDepartment = ({departmentId}) => {
    return http.get(`${API_URL}/departments/${departmentId}`);
}

export const addDepartment = ({ name, managerId }) => {
  return http.post(
    `${API_URL}/departments/create`,
    JSON.stringify({ name, managerId })
  );
};

export const editDepartment = ({ departmentId, name, managerId }) => {
  return http.post(
    `${API_URL}/departments/edit`,
    JSON.stringify({ departmentId, name, managerId })
  );
};

export const deleteDepartments = ({ departmentIds }) => {
  return http.post(`${API_URL}/departments/delete`, JSON.stringify({ departmentIds }));
};
