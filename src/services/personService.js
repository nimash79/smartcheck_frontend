import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getPersons = () => {
  return http.get(`${API_URL}/persons`);
};

export const getPerson = (id) => {
  return http.get(`${API_URL}/persons/${id}`);
};

export const addPerson = ({
  departmentId,
  name,
  phoneNumber,
  identificationCode,
  verified,
  face,
  isManager,
}) => {
  return http.post(
    `${API_URL}/persons/create`,
    JSON.stringify({
      departmentId,
      name,
      phoneNumber,
      identificationCode,
      verified,
      face,
      isManager,
    })
  );
};

export const editPerson = ({
  personId,
  departmentId,
  name,
  phoneNumber,
  identificationCode,
  verified,
  face,
  isManager,
}) => {
  return http.post(
    `${API_URL}/persons/edit`,
    JSON.stringify({
      personId,
      departmentId,
      name,
      phoneNumber,
      identificationCode,
      verified,
      face,
      isManager,
    })
  );
};

export const deletePersons = ({ personIds }) => {
  return http.post(`${API_URL}/persons/delete`, JSON.stringify({personIds}));
};

export const getManagers = () => {
  return http.get(`${API_URL}/persons/managers`);
};