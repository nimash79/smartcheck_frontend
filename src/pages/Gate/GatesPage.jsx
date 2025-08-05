import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import PlusIcon from "../../components/icons/PlusIcon";
import CustomSearchInput from "../../components/shared/CustomSearchInput";
import EditIcon from "../../components/icons/EditIcon";
import DeleteIcon from "../../components/icons/DeleteIcon";
import CustomTable from "../../components/shared/CustomTable";
import DepartmentHistoryModal from "../../components/modals/DepartmentHistoryModal";
import { deleteGates, getGates } from "../../services/gateService";
import { getTime, toShamsi } from "../../utils/helper";
import CustomCheckbox from "../../components/shared/CustomCheckbox";
import LoadingModal from "../../components/modals/LoadingModal";
import { notif_error, notif_success } from "../../utils/toast";
import DeleteModal from "../../components/modals/DeleteModal";
import CustomButton from "../../components/shared/CustomButton";

const GatesPage = () => {
  const [loading, setLoading] = useState(false);
  const [allGates, setAllGates] = useState([]);
  const [gates, setGates] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getGates();
        setAllGates(res.data.data.gates);
        setGates(
          res.data.data.gates.map((gate) => {
            return { selected: false, ...gate };
          })
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const submitDelete = async () => {
    setDeleteModal(false);
    try {
      setLoading(true);
      const { data } = await deleteGates({
        gateIds: gates
          .filter((gate) => gate.selected)
          .map((gate) => gate.gateId),
      });
      setGates(gates.filter((gate) => !gate.selected));
      setAllGates(gates.filter((gate) => !gate.selected));
      notif_success("گیت های انتخاب شده با موفقیت حذف شدند.");
      setIsDeleting(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="sections-page">
      <LoadingModal isOpen={loading} />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        count={gates.filter((gate) => gate.selected).length}
        onSubmit={submitDelete}
      />
      <div className="sections-page-header">
        <Link to="/gates/add" className="add-button">
          <PlusIcon />
          <span>افزودن گیت</span>
        </Link>
        <CustomSearchInput placeholder={"جستجوی گیت ..."} />
      </div>
      <div className="sections-page-header">
        <h4>گیت های ثبت شده</h4>
        <div className="operations-icons">
          {isEditing && (
            <CustomButton
              style={{ marginLeft: 8 }}
              onClick={() =>
                navigate(
                  `/gates/edit/${
                    gates.find((gate) => gate.selected)?.gateId || 0
                  }`
                )
              }
              text={"ویرایش"}
            />
          )}
          {!isDeleting && <EditIcon onClick={() => setIsEditing(!isEditing)} />}
          {isDeleting && (
            <span
              style={{ color: "#69120B" }}
              onClick={() => setDeleteModal(true)}
            >
              حذف {gates.filter((gate) => gate.selected).length} ردیف
            </span>
          )}
          {!isEditing && (
            <DeleteIcon
              style={{ marginRight: 8 }}
              clicked={isDeleting}
              onClick={() => setIsDeleting(!isDeleting)}
            />
          )}
        </div>
      </div>
      <CustomTable
        headers={["شماره گیت", "نام گیت", "بخش", "وضعیت", "تاریخ ثبت"]}
        separated={isDeleting || isEditing}
      >
        {gates.map((gate) => (
          <div key={gate.gateId} className="custom-table-row">
            <div className="custom-table-col-text">
              <span>{gate.gateId}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{gate.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{gate.Department.name}</span>
            </div>
            <div className="custom-table-col-text">
              {gate.open ? (
                <span style={{ color: "#204422" }}>باز</span>
              ) : (
                <span style={{ color: "#900B09" }}>بسته</span>
              )}
            </div>
            <div className="custom-table-col-date-time">
              <div>{toShamsi(gate.createdAt)}</div>
              <div>{getTime(gate.createdAt)}</div>
            </div>
            <div className="custom-table-col-select">
              <CustomCheckbox
                checked={gate.selected}
                onChange={() => {
                  let list;
                  if (isDeleting) list = [...gates];
                  else
                    list = [...gates].map((g) => {
                      return { ...g, selected: false };
                    });
                  const index = list.findIndex((x) => x.gateId === gate.gateId);
                  list[index].selected = !gate.selected;
                  setGates(list);
                }}
              />
            </div>
          </div>
        ))}
      </CustomTable>
    </div>
  );
};

export default GatesPage;
