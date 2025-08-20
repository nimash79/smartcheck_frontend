import http from "./httpService";

const API_URL = import.meta.env.VITE_API_URL;

export const getCameras = () => {
  return http.get(`${API_URL}/cameras`);
};

export const getCamera = ({ cameraId }) => {
  return http.get(`${API_URL}/cameras/${cameraId}`);
};

export const addCamera = ({ name, direction, ip, microphone, main, display, gateId }) => {
  return http.post(
    `${API_URL}/cameras/create`,
    JSON.stringify({ name, direction, ip, microphone, main, display, gateId })
  );
};

export const editCamera = ({
  cameraId,
  name,
  direction,
  ip,
  microphone,
  main,
  display,
  gateId,
}) => {
  return http.post(
    `${API_URL}/cameras/edit`,
    JSON.stringify({ cameraId, name, direction, ip, microphone, main, display, gateId })
  );
};

export const deleteCameras = ({ cameraIds }) => {
  return http.post(`${API_URL}/cameras/delete`, JSON.stringify({ cameraIds }));
};

export const getMainCamera = () => {
  return http.get(`${API_URL}/cameras/main`);
};

export const getDisplayingCameras = () => {
  return http.get(`${API_URL}/cameras/displaying-cameras`);
};