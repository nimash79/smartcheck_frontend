import CustomInput from "../../components/shared/CustomInput";
import CustomDropdown from "../../components/shared/CustomDropdown";
import VideoIcon from "../../components/icons/VideoIcon";
import UserIcon from "../../components/icons/UserIcon";
import PhoneIcon from "../../components/icons/PhoneIcon";
import SectionIcon from "../../components/icons/SectionIcon";
import DocumentIcon from "../../components/icons/DocumentIcon";
import CustomSubmitButton from "../../components/shared/CustomSubmitButton";
import CustomButton from "../../components/shared/CustomButton";
import TickCircleIcon from "../../components/icons/TickCircleIcon";
import InfoCircleIcon from "../../components/icons/InfoCircleIcon";
import { useEffect, useRef, useState } from "react";
import { getDepartments } from "../../services/departmentService";
import { getMainCamera } from "../../services/cameraService";
import { getSetting } from "../../services/settingService";
import LoadingModal from "../../components/modals/LoadingModal";
import { addPerson } from "../../services/personService";
import { notif_error, notif_success } from "../../utils/toast";
import { useNavigate } from "react-router";
import MicrophoneIcon from "../../components/icons/MicrophoneIcon";
import MicrophoneDisabledIcon from "../../components/icons/MicrophoneDisabledIcon";

const AddPersonPage = () => {
  const [departments, setDepartments] = useState([]);
  const [mainCamera, setMainCamera] = useState({});
  const [setting, setSetting] = useState({});
  const [face, setFace] = useState();
  const [voice, setVoice] = useState();
  const [faceExists, setFaceExists] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Recording Audio */
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      await fetch(
        `http://localhost:5000/start_recording?url=${mainCamera.microphone}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      setRecording(true);
    } catch (err) {
      console.error("Error requesting:", err);
    }
  };

  const stopRecording = async () => {
    await fetch("http://localhost:5000/stop_recording", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: mainCamera.microphone }),
    });
    setRecording(false);
  };
  /* End Recording Audio */

  const nameRef = useRef();
  const phoneNumberRef = useRef();
  const identificationCodeRef = useRef();
  const departmentIdRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        let res = await getDepartments();
        setDepartments(res.data.data.departments);
        res = await getMainCamera();
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
      if (data.type === "face_detected") {
        setFaceExists(data.exists);
        if (!data.exists) setFace(data.face);
        console.log(`Face detected on camera: ${data.camera_url}`);
      } else if (data.type === "add_voice") {
        setVoice(data.voice);
        console.log(`Voice added from microphone: ${data.microphone_url}`);
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
    if (!voice) {
      notif_error("صدایی ضبط نشده است");
      return;
    }
    try {
      setLoading(true);
      const res = await addPerson({
        name: nameRef.current.value,
        phoneNumber: phoneNumberRef.current.value,
        identificationCode: identificationCodeRef.current.value,
        departmentId: departmentIdRef.current.value,
        verified: true,
        face,
        voice,
        isManager: false,
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
      notif_success("کارمند جدید با موفقیت ثبت شد.");
      navigate("/persons");
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
        <h4>افزودن کارمند</h4>
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
          <CustomDropdown
            label={"انتخاب بخش"}
            icon={<SectionIcon />}
            list={departments.map((department) => {
              return {
                label: department.name,
                value: department.departmentId,
              };
            })}
            ref={departmentIdRef}
          />
        </div>
        <div>
          <div className="camera-stream">
            <div className="camera-stream-title">{mainCamera?.name}</div>
            <VideoIcon />
            <img
              src={`http://${setting?.deviceIp}:5000/detection?camera_url=${mainCamera?.ip}`}
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
          <div className="audio-record">
            <CustomButton
              icon={
                !recording ? <MicrophoneIcon /> : <MicrophoneDisabledIcon />
              }
              style={{
                marginTop: 8,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onClick={recording ? stopRecording : startRecording}
            />
            <span style={{ marginRight: 8, fontSize: 14 }}>
              {recording
                ? "برای توقف ضبط صدا روی دکمه کلیک کنید."
                : "برای شروع ضبط صدا روی دکمه کلیک کنید."}
            </span>
          </div>
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
          text="ثبت کارمند"
          onClick={submit}
        />
      </div>
    </div>
  );
};

export default AddPersonPage;
