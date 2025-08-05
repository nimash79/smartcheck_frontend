import CustomInput from "../../components/shared/CustomInput";
import CustomDropdown from "../../components/shared/CustomDropdown";
import UserIcon from "../../components/icons/UserIcon";
import SectionIcon from "../../components/icons/SectionIcon";
import CustomSubmitButton from "../../components/shared/CustomSubmitButton";
import CustomButton from "../../components/shared/CustomButton";
import { useEffect, useRef, useState } from "react";
import LoadingModal from "../../components/modals/LoadingModal";
import { getDepartments } from "../../services/departmentService";
import { editGate, getGate } from "../../services/gateService";
import { notif_error, notif_success } from "../../utils/toast";
import { useNavigate, useParams } from "react-router";
import GateIcon from "../../components/icons/GateIcon";

const EditGatePage = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [gate, setGate] = useState({});

  const nameRef = useRef(null);
  const departmentIdRef = useRef(null);

  const navigate = useNavigate();
  const {gateId} = useParams();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let res = await getGate({gateId});
        setGate(res.data.data.gate);
        res = await getDepartments();
        setDepartments(res.data.data.departments);
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
      const res = await editGate({
        gateId,
        name: nameRef.current.value,
        departmentId: departmentIdRef.current.value,
        open: gate.open,
      });
      console.log("res:", res);
      if (res.data.code === 400) {
        notif_error("لطفا نام گیت و بخش را وارد کنید.");
        return;
      } else if (res.data.data.status === 2) {
        notif_error("گیتی با این نام وجود دارد.");
        return;
      } else if (res.data.data.status === 3) {
        notif_error("بخش یافت نشد.");
        return;
      }
      notif_success("گیت موردنظر با موفقیت تغییر یافت.");
      navigate("/gates");
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
        <h4>ویرایش گیت</h4>
      </div>
      <div style={{ maxWidth: 500 }}>
        <div className="custom-form">
          <CustomInput
            label={"نام گیت"}
            icon={<GateIcon />}
            ref={nameRef}
            defaultValue={gate.name}
          />
          <CustomDropdown
            label={"انتخاب بخش"}
            icon={<SectionIcon />}
            ref={departmentIdRef}
            list={departments.map(department => {
              return {
                label: department.name,
                value: department.departmentId
              }
            })}
            initialValue={gate.departmentId}
          />
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <CustomButton text="بازگشت" style={{ backgroundColor: "#900B09" }} onClick={() => navigate(-1)} />
          <CustomSubmitButton
            style={{ marginRight: 12 }}
            text="ویرایش گیت"
            onClick={submit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditGatePage;
