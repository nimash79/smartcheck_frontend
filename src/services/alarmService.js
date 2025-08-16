import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getAlarms = () => {
  return http.get(`${API_URL}/alarms`);
};

export const deleteAlarms = ({ alarmIds }) => {
  return http.post(`${API_URL}/alarms/delete`, JSON.stringify({ alarmIds }));
};