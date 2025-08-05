import { Link, useNavigate } from "react-router";
import PlusIcon from "../../components/icons/PlusIcon";
import CustomSearchInput from "../../components/shared/CustomSearchInput";
import EditIcon from "../../components/icons/EditIcon";
import DeleteIcon from "../../components/icons/DeleteIcon";
import CustomTable from "../../components/shared/CustomTable";
import { useEffect, useState } from "react";
import DepartmentHistoryModal from "../../components/modals/DepartmentHistoryModal";
import { deleteDepartments, getDepartments } from "../../services/departmentService";
import { getTime, toShamsi } from "../../utils/helper";
import DeleteModal from "../../components/modals/DeleteModal";
import CustomCheckbox from "../../components/shared/CustomCheckbox";
import LoadingModal from "../../components/modals/LoadingModal";
import CustomButton from "../../components/shared/CustomButton";

const DepartmentsPage = () => {
  const [departmentHistoryModal, setDepartmentHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allDepartments, setAllDepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getDepartments();
        setAllDepartments(res.data.data.departments);
        setDepartments(
          res.data.data.departments.map((department) => {
            return { ...department, selected: false };
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
      const { data } = await deleteDepartments({
        departmentIds: departments
          .filter((department) => department.selected)
          .map((department) => department.departmentId),
      });
      setDepartments(departments.filter((department) => !department.selected));
      setAllDepartments(departments.filter((department) => !department.selected));
      notif_success("بخش های انتخاب شده با موفقیت حذف شدند.");
      setIsDeleting(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sections-page">
      <DepartmentHistoryModal
        isOpen={departmentHistoryModal}
        onClose={() => setDepartmentHistoryModal(false)}
        departmentId={departmentId}
      />
      <LoadingModal isOpen={loading} />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        count={departments.filter((department) => department.selected).length}
        onSubmit={submitDelete}
      />
      <div className="sections-page-header">
        <Link to="/departments/add" className="add-button">
          <PlusIcon />
          <span>افزودن بخش</span>
        </Link>
        <CustomSearchInput placeholder={"جستجوی بخش ..."} />
      </div>
      <div className="sections-page-header">
        <h4>بخش های ثبت شده</h4>
        <div className="operations-icons">
          {isEditing && (
            <CustomButton
              style={{ marginLeft: 8 }}
              onClick={() =>
                navigate(
                  `/departments/edit/${
                    departments.find((department) => department.selected)?.departmentId || 0
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
              حذف {departments.filter((department) => department.selected).length} ردیف
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
        headers={[
          "نام بخش",
          "مدیرعامل",
          "شماره موبایل",
          "تاریخ ثبت",
          "تاریخچه حضور و غیاب",
        ]}
        separated={isDeleting || isEditing}
      >
        {departments.map((department) => (
          <div key={department.departmentId} className="custom-table-row">
            <div className="custom-table-col-text">
              <span>{department.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{department.manager.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{department.manager.phoneNumber}</span>
            </div>
            <div className="custom-table-col-date-time">
              <div>{toShamsi(department.createdAt)}</div>
              <div>{getTime(department.createdAt)}</div>
            </div>
            <div className="custom-table-col-btn">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setDepartmentId(department.departmentId);
                  setDepartmentHistoryModal(true)
                }}
              >
                مشاهده
              </button>
            </div>
            <div className="custom-table-col-select">
              <CustomCheckbox
                checked={department.selected}
                onChange={() => {
                  let list;
                  if (isDeleting) list = [...departments];
                  else
                    list = [...departments].map((g) => {
                      return { ...g, selected: false };
                    });
                  const index = list.findIndex(
                    (x) => x.departmentId === department.departmentId
                  );
                  list[index].selected = !department.selected;
                  setDepartments(list);
                }}
              />
            </div>
          </div>
        ))}
      </CustomTable>
    </div>
  );
};

export default DepartmentsPage;
