import CustomInput from "../../components/shared/CustomInput";
import CustomDropdown from "../../components/shared/CustomDropdown";
import UserIcon from "../../components/icons/UserIcon";
import SectionIcon from "../../components/icons/SectionIcon";
import CustomSubmitButton from "../../components/shared/CustomSubmitButton";
import CustomButton from "../../components/shared/CustomButton";
import { useEffect, useRef, useState } from "react";
import { getManagers } from '../../services/personService';
import LoadingModal from '../../components/modals/LoadingModal';
import {addDepartment} from "../../services/departmentService";
import { notif_error, notif_success } from "../../utils/toast";
import { useNavigate } from "react-router";

const AddDepartmentPage = () => {
    const [loading, setLoading] = useState(false);
    const [persons, setPersons] = useState([]);
    
    const nameRef = useRef(null);
    const managerIdRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await getManagers();
                setPersons(res.data.data.persons);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])

    const submit = async () => {
        try {
            setLoading(true);
            const res = await addDepartment({
                name: nameRef.current.value,
                managerId: managerIdRef.current.value,
            });
            console.log("res:", res);
            if (res.data.code === 400) {
                notif_error("لطفا نام بخش و مدیرعامل را وارد کنید.");
                return;
            }
            else if (res.data.data.status === 2) {
                notif_error("بخشی با این نام وجود دارد.");
                return;
            }
            else if (res.data.data.status === 3) {
                notif_error("مدیرعامل یافت نشد.");
                return;
            }
            notif_success("بخش جدید با موفقیت ثبت شد.");
            navigate("/departments");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className="users-page">
        <LoadingModal isOpen={loading} />
      <div className="users-page-header">
        <h4>افزودن بخش</h4>
      </div>
      <div style={{ maxWidth: 500 }}>
        <div className="custom-form">
          <CustomInput label={"نام بخش"} icon={<SectionIcon />} ref={nameRef}  />
          <CustomDropdown label={"انتخاب مدیرعامل"} icon={<UserIcon />} ref={managerIdRef} list={persons.map(person => {
            return {
              label: person.name,
              value: person.personId,
            }
          })} />
        </div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <CustomButton text="بازگشت" style={{ backgroundColor: "#900B09" }} onClick={() => navigate(-1)} />
          <CustomSubmitButton style={{ marginRight: 12 }} text="ثبت بخش" onClick={submit}  />
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentPage;
