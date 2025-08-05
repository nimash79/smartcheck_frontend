import CustomInput from "../../components/shared/CustomInput";
import CustomSubmitButton from "../../components/shared/CustomSubmitButton";
import { useEffect, useRef, useState } from "react";
import LoadingModal from "../../components/modals/LoadingModal";
import { notif_error, notif_success } from "../../utils/toast";
import { editSetting, getSetting } from '../../services/settingService';
import IpIcon from '../../components/icons/IpIcon';
import DeviceIcon from '../../components/icons/DeviceIcon';

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({});

  const ipRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let res = await getSetting();
        setSetting(res.data.data.setting);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submit = async () => {
    try {
      setLoading(true);
      const res = await editSetting({
        deviceIp: ipRef.current.value,
        deviceName: nameRef.current.value,
      });
      console.log("res:", res);
      if (res.data.code === 400) {
        notif_error("لطفا آی‌پی دستگاه و نام دستگاه را وارد کنید.");
        return;
      }
      notif_success("تنظیمات با موفقیت اعمال شد.");
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
        <h4>تنظیمات</h4>
      </div>
      <div style={{ maxWidth: 500 }}>
        <div className="custom-form">
          <CustomInput
            label={"آی‌پی دستگاه"}
            icon={<IpIcon />}
            ref={ipRef}
            defaultValue={setting.deviceIp}
          />
          <CustomInput
            label={"نام دستگاه"}
            icon={<DeviceIcon />}
            ref={nameRef}
            defaultValue={setting.deviceName}
          />
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          {/* <CustomButton text="بازگشت" style={{ backgroundColor: "#900B09" }} onClick={() => navigate(-1)} /> */}
          <CustomSubmitButton
            style={{ marginRight: 12 }}
            text="ویرایش تنظیمات"
            onClick={submit}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
