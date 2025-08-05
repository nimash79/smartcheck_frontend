import CustomInput from "../../components/shared/CustomInput";
import CustomDropdown from "../../components/shared/CustomDropdown";
import SectionIcon from "../../components/icons/SectionIcon";
import CustomSubmitButton from "../../components/shared/CustomSubmitButton";
import CustomButton from "../../components/shared/CustomButton";
import { useEffect, useRef, useState } from "react";
import LoadingModal from "../../components/modals/LoadingModal";
import { getGates } from "../../services/gateService";
import { addCamera } from "../../services/cameraService";
import { notif_error, notif_success } from "../../utils/toast";
import { useNavigate } from "react-router";
import GateIcon from "../../components/icons/GateIcon";
import CameraIcon from '../../components/icons/CameraIcon';
import CustomCheckbox from '../../components/shared/CustomCheckbox';
import IpIcon from '../../components/icons/IpIcon';

const AddCameraPage = () => {
  const [loading, setLoading] = useState(false);
  const [gates, setGates] = useState([]);
  const [isMain, setIsMain] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);

  const nameRef = useRef(null);
  const gateIdRef = useRef(null);
  const directionRef = useRef(null);
  const ipRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getGates();
        setGates(res.data.data.gates);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (isMain) {
  //     gateIdRef.current.value = 0;
  //   }
  // }, [isMain])

  const submit = async () => {
    try {
      setLoading(true);
      const res = await addCamera({
        name: nameRef.current.value,
        gateId: gateIdRef.current.value == 0 ? undefined : gateIdRef.current.value,
        direction: directionRef.current.value,
        ip: ipRef.current.value,
        main: isMain,
        display: isDisplay,
      });
      console.log("res:", res);
      if (res.data.code === 400) {
        notif_error("واردکردن فیلد های زیر اجباری هستند.");
        return;
      } else if (res.data.data.status === 2) {
        notif_error("جهت وارد شده صحیح نمی باشد.");
        return;
      } else if (res.data.data.status === 3) {
        notif_error("دوربینی با این نام وجود دارد.");
        return;
      } else if (res.data.data.status === 4) {
        notif_error("دوربینی با این آی‌پی ثبت شده است.");
        return;
      } else if (res.data.data.status === 5) {
        notif_error("گیت موردنظر یافت نشد.");
        return;
      }
      notif_success("دوربین جدید با موفقیت ثبت شد.");
      navigate("/cameras");
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
        <h4>افزودن دوربین</h4>
      </div>
      <div style={{ maxWidth: 500 }}>
        <div className="custom-form">
          <CustomInput
            label={"نام دوربین"}
            icon={<CameraIcon />}
            ref={nameRef}
          />
          <CustomInput
            label={"آی‌پی دوربین"}
            icon={<IpIcon />}
            ref={ipRef}
          />
          <CustomDropdown
            label={"انتخاب جهت"}
            icon={<GateIcon />}
            list={[{
              label: "ورودی",
              value: "enter"
            }, {
              label: "خروجی",
              value: "exit"
            }]}
            ref={directionRef}
          />
          <div style={{display: "flex"}}>
            <span style={{marginLeft: 16}}>دوربین اصلی؟</span>
            <CustomCheckbox checked={isMain} onChange={() => setIsMain(!isMain)} />
          </div>
          <CustomDropdown
            icon={<GateIcon />}
            ref={gateIdRef}
            label="انتخاب گیت"
            list={gates.map(gate => {
              return {
                label: gate.name,
                value: gate.gateId
              }
            })}
            // disabled={isMain}
          />
          <div style={{display: "flex"}}>
            <span style={{marginLeft: 16}}>تماشای لحظه ای؟</span>
            <CustomCheckbox checked={isDisplay} onChange={() => setIsDisplay(!isDisplay)} />
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <CustomButton text="بازگشت" style={{ backgroundColor: "#900B09" }} onClick={() => navigate(-1)} />
          <CustomSubmitButton
            style={{ marginRight: 12 }}
            text="ثبت دوربین"
            onClick={submit}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCameraPage;
