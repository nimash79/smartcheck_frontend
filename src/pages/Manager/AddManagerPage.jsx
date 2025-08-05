import CustomInput from "../../components/shared/CustomInput";
import VideoIcon from "../../components/icons/VideoIcon";
import UserIcon from "../../components/icons/UserIcon";
import PhoneIcon from "../../components/icons/PhoneIcon";
import DocumentIcon from "../../components/icons/DocumentIcon";
import CustomSubmitButton from "../../components/shared/CustomSubmitButton";
import CustomButton from "../../components/shared/CustomButton";
import TickCircleIcon from "../../components/icons/TickCircleIcon";
import InfoCircleIcon from "../../components/icons/InfoCircleIcon";
import { useEffect, useRef, useState } from "react";
import { getMainCamera } from "../../services/cameraService";
import { getSetting } from "../../services/settingService";
import LoadingModal from "../../components/modals/LoadingModal";
import { addPerson } from "../../services/personService";
import { notif_error, notif_success } from "../../utils/toast";
import { useNavigate } from "react-router";

const AddManagerPage = () => {
  const [mainCamera, setMainCamera] = useState({});
  const [setting, setSetting] = useState({});
  const [face, setFace] = useState();
  const [faceExists, setFaceExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();
  const phoneNumberRef = useRef();
  const identificationCodeRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let res = await getMainCamera();
        setMainCamera(res.data.data.camera);
        res = await getSetting();
        setSetting(res.data.data.setting);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("WebSocket connected to server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("socket data:", data);
      if (data.type === "face_detected") {
        setFaceExists(data.exists);
        if (!data.exists) setFace(data.face);
        console.log(`Face detected on camera ${data.camera_ip}`);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  const submit = async () => {
    if (!face) {
      notif_error("چهره ای ثبت نشده است.");
      return;
    }
    try {
      setLoading(true);
      const res = await addPerson({
        name: nameRef.current.value,
        phoneNumber: phoneNumberRef.current.value,
        identificationCode: identificationCodeRef.current.value,
        verified: true,
        face,
        isManager: true,
      });
      console.log("res:", res);
      if (res.data.code === 400) {
        notif_error("فیلدهای زیر اجباری هستند.");
        return;
      } else if (res.data.data.status === 2) {
        notif_error("کارمندی با این شماره موبایل وجود دارد.");
        return;
      } else if (res.data.data.status === 3) {
        notif_error("کارمندی با این کد ملی وجود دارد.");
        return;
      }
      notif_success("مدیرعامل جدید با موفقیت ثبت شد.");
      navigate("/managers");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <LoadingModal isOpen={loading} />
      <div className="users-page-header">
        <h4>افزودن مدیرعامل</h4>
      </div>
      <div className="add-person-form">
        <div className="custom-form">
          <CustomInput
            label={"نام و نام خانوادگی"}
            icon={<UserIcon />}
            ref={nameRef}
          />
          <CustomInput
            label={"شماره همراه"}
            icon={<PhoneIcon />}
            ref={phoneNumberRef}
          />
          <CustomInput
            label={"کد ملی"}
            icon={<DocumentIcon />}
            ref={identificationCodeRef}
          />
        </div>
        <div>
          <div className="camera-stream">
            <div className="camera-stream-title">{mainCamera.name}</div>
            <VideoIcon />
            <img
              src={`http://${setting.deviceIp}:5000/detection?camera_url=${mainCamera.ip}`}
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
          {face ? (
            <div style={{ marginTop: 8, display: "flex" }}>
              <TickCircleIcon color={"#204422"} />
              <span style={{ marginRight: 8 }}>چهره شخص موردنظر ثبت شد</span>
            </div>
          ) : (
            <div style={{ marginTop: 8, display: "flex" }}>
              <InfoCircleIcon color={"#900B09"} />
              {faceExists ? (
                <span style={{ marginRight: 8 }}>چهره تکراری می باشد</span>
              ) : (
                <span style={{ marginRight: 8 }}>چهره ای تشخیص داده نشد</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
      >
        <CustomButton
          text="بازگشت"
          style={{ backgroundColor: "#900B09" }}
          onClick={() => navigate(-1)}
        />
        <CustomSubmitButton
          style={{ marginRight: 12 }}
          text="ثبت مدیرعامل"
          onClick={submit}
        />
      </div>
    </div>
  );
};

export default AddManagerPage;
