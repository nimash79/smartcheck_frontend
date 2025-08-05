import { Link } from "react-router";
import PlusIcon from "../../components/icons/PlusIcon";
import CustomSearchInput from "../../components/shared/CustomSearchInput";
import VideoIcon from "../../components/icons/VideoIcon";
import { useEffect, useRef, useState } from "react";
import { getDisplayingCameras } from "../../services/cameraService";
import { getSetting } from '../../services/settingService';

const DisplayCamerasPage = () => {
  const [cameras, setCameras] = useState([]);
  const [setting, setSetting] = useState({});
  
  const imgRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let res = await getSetting();
        setSetting(res.data.data.setting);
        res = await getDisplayingCameras();
        console.log(res.data);
        setCameras(res.data.data.cameras);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (!cameras) return;
  //   const ws = new WebSocket("ws://localhost:8765");

  //   ws.onopen = () => {
  //     cameras.forEach(camera => {
  //       ws.send(camera.ip);
  //     });
  //   };

  //   ws.onmessage = (event) => {
  //     if (imgRef.current) {
  //       imgRef.current.src = `data:image/jpeg;base64,${event.data}`;
  //     }
  //   };

  //   return () => ws.close();
  // }, [cameras]);

  return (
    <div className="cameras-page">
      <div className="cameras-page-header">
        <h4>دوربین های قابل نمایش</h4>
        </div>
      <div className="cameras-page-header">
        <Link to="/cameras" className="add-button">
          <span>لیست تمام دوربین ها</span>
        </Link>
        {/* <CustomSearchInput placeholder={"جستجوی دوربین ..."} /> */}
      </div>
      <div className="cameras-list">
        {cameras.map((camera) => (
          <div key={camera.cameraId} className="camera-stream">
            <div className="camera-stream-title">{camera.name}</div>
            <VideoIcon />
            <img
              // ref={imgRef}
              src={`http://${setting.deviceIp}:5000/${camera.ip}/live`}
              alt="Live Preview"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                borderRadius: 8,
                textIndent: -99999,
              }}
            />
          </div>
        ))}
        {/* <div className="camera-stream" style={{backgroundColor: "#ADD3F2"}}>
          <div className="camera-stream-title" style={{backgroundColor: "#0A3C63", color: "#E9F3FB"}}>
            دوربین خروجی ۱
          </div>
          <VideoIcon />
        </div> */}
      </div>
    </div>
  );
};

export default DisplayCamerasPage;
