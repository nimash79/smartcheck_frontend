import { Link, useNavigate } from "react-router";
import PlusIcon from "../../components/icons/PlusIcon";
import CustomSearchInput from "../../components/shared/CustomSearchInput";
import EditIcon from "../../components/icons/EditIcon";
import DeleteIcon from "../../components/icons/DeleteIcon";
import CustomTable from "../../components/shared/CustomTable";
import { useEffect, useState } from "react";
import PersonHistoryModal from "../../components/modals/PersonHistoryModal";
import { deletePersons, getManagers } from "../../services/personService";
import LoadingModal from "../../components/modals/LoadingModal";
import DeleteModal from "../../components/modals/DeleteModal";
import CustomCheckbox from "../../components/shared/CustomCheckbox";
import { notif_success } from "../../utils/toast";
import CustomButton from "../../components/shared/CustomButton";

const ManagersPage = () => {
  const [personHistoryModal, setPersonHistoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPersons, setAllPersons] = useState([]);
  const [persons, setPersons] = useState([]);
  const [personId, setPersonId] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getManagers();
        console.log("res:", res);
        setAllPersons(res.data.data.persons);
        setPersons(
          res.data.data.persons.map((person) => {
            return { ...person, selected: false };
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
        const { data } = await deletePersons({
          personIds: persons
            .filter((person) => person.selected)
            .map((person) => person.personId),
        });
        setPersons(persons.filter((person) => !person.selected));
        setAllPersons(persons.filter((person) => !person.selected));
        notif_success("مدیرعامل های انتخاب شده با موفقیت حذف شدند.");
        setIsDeleting(false);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="users-page">
      <PersonHistoryModal
        isOpen={personHistoryModal}
        onClose={() => setPersonHistoryModal(false)}
        personId={personId}
      />
      <LoadingModal isOpen={loading} />
      <DeleteModal isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        count={persons.filter((person) => person.selected).length}
        onSubmit={submitDelete}/>
      <div className="users-page-header">
        <Link to="/managers/add" className="add-button">
          <PlusIcon />
          <span>افزودن مدیرعامل</span>
        </Link>
        <CustomSearchInput placeholder={"جستجوی مدیرعامل ..."} />
      </div>
      <div className="users-page-header">
        <h4>مدیرعامل های ثبت شده</h4>
        <div className="operations-icons">
          {isEditing && (
            <CustomButton
              style={{ marginLeft: 8 }}
              onClick={() =>
                navigate(
                  `/managers/edit/${
                    persons.find((person) => person.selected)?.personId || 0
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
              حذف {persons.filter((person) => person.selected).length} ردیف
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
        headers={["نام", "بخش", "شماره موبایل", "تاریخچه حضور و غیاب"]}
        separated={isDeleting || isEditing}
      >
        {persons.map((person) => (
          <div className="custom-table-row">
            <div className="custom-table-col-image-text">
              <div>
                <img src="/icons/profile.png" />
              </div>
              <div>
                <span>{person.name}</span>
              </div>
            </div>
            <div className="custom-table-col-text">
              <span>{person.Department?.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{person.phoneNumber}</span>
            </div>
            <div className="custom-table-col-btn">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setPersonId(person.personId);
                  setPersonHistoryModal(true);
                }}
              >
                مشاهده
              </button>
            </div>
            <div className="custom-table-col-select">
              <CustomCheckbox
                checked={person.selected}
                onChange={() => {
                  let list;
                  if (isDeleting) list = [...persons];
                  else
                    list = [...persons].map((g) => {
                      return { ...g, selected: false };
                    });
                  const index = list.findIndex(
                    (x) => x.personId === person.personId
                  );
                  list[index].selected = !person.selected;
                  setPersons(list);
                }}
              />
            </div>
          </div>
        ))}
      </CustomTable>
    </div>
  );
};

export default ManagersPage;
