import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getGates = () => {
    return http.get(`${API_URL}/gates`);
}

export const getGate = ({gateId}) => {
    return http.get(`${API_URL}/gates/${gateId}`);
}

export const addGate = ({ departmentId, name }) => {
  return http.post(
    `${API_URL}/gates/create`,
    JSON.stringify({ departmentId, name})
  );
};

export const editGate = ({ gateId, departmentId, name, open }) => {
  return http.post(
    `${API_URL}/gates/edit`,
    JSON.stringify({ gateId, departmentId, name, open })
  );
};

export const deleteGates = ({ gateIds }) => {
  return http.post(`${API_URL}/gates/delete`, JSON.stringify({ gateIds }));
};
