import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getSetting = () => {
    return http.get(`${API_URL}/settings`);
}

export const addSetting = ({ deviceIp, deviceName }) => {
  return http.post(
    `${API_URL}/settings/create`,
    JSON.stringify({ deviceIp, deviceName })
  );
};

export const editSetting = ({ deviceIp, deviceName }) => {
  return http.post(
    `${API_URL}/settings/edit`,
    JSON.stringify({ deviceIp, deviceName })
  );
};
