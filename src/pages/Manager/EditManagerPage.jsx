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
import { useNavigate, useParams } from "react-router";
import { editPerson, getPerson } from "../../services/personService";
import LoadingModal from "../../components/modals/LoadingModal";
import { getMainCamera } from "../../services/cameraService";
import { getSetting } from "../../services/settingService";
import { notif_error, notif_success } from "../../utils/toast";

const EditManagerPage = () => {
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState({});
  const [face, setFace] = useState();
  const [setting, setSetting] = useState({});
  const [mainCamera, setMainCamera] = useState({});
  
  const navigate = useNavigate();
  const {personId} = useParams();

  const nameRef = useRef();
  const phoneNumberRef = useRef();
  const identificationCodeRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        let res = await getPerson(personId);
        setPerson(res.data.data.person);
        setFace(res.data.data.person.face);
        res = await getMainCamera();
        setMainCamera(res.data.data.camera);
        res = await getSetting();
        setSetting(res.data.data.setting);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [])

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("WebSocket connected to server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "face_detected") {
        setFace(data.face);
        console.log(
          `Face detected on camera ${data.camera_ip}`
        );
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
        const res = await editPerson({
          personId,
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
         else if (res.data.data.status === 4) {
          notif_error("کارمندی یافت نشد.");
          return;
        }
        notif_success("مدیرعامل موردنظر با موفقیت ویرایش شد.");
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
        <h4>ویرایش مدیرعامل</h4>
      </div>
      <div className="add-person-form">
        <div className="custom-form">
          <CustomInput
            label={"نام و نام خانوادگی"}
            icon={<UserIcon />}
            defaultValue={person.name}
            ref={nameRef}
          />
          <CustomInput label={"شماره همراه"} icon={<PhoneIcon />} defaultValue={person.phoneNumber} ref={phoneNumberRef} />
          <CustomInput label={"کد ملی"} icon={<DocumentIcon />} defaultValue={person.identificationCode} ref={identificationCodeRef} />
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
              <span style={{ marginRight: 8 }}>چهره ای تشخیص داده نشد</span>
            </div>
          )}
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
      >
        <CustomButton text="بازگشت" style={{ backgroundColor: "#900B09" }} onClick={() => navigate(-1)} />
        <CustomSubmitButton style={{ marginRight: 12 }} text="ویرایش مدیرعامل" onClick={submit} />
      </div>
    </div>
  );
};

export default EditManagerPage;
