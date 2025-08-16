import { Link, useNavigate } from "react-router";
import PlusIcon from "../../components/icons/PlusIcon";
import CustomSearchInput from "../../components/shared/CustomSearchInput";
import VideoIcon from "../../components/icons/VideoIcon";
import { useEffect, useState } from "react";
import LoadingModal from "../../components/modals/LoadingModal";
import DeleteModal from "../../components/modals/DeleteModal";
import DeleteIcon from "../../components/icons/DeleteIcon";
import EditIcon from "../../components/icons/EditIcon";
import CustomTable from "../../components/shared/CustomTable";
import { getTime, toShamsi } from "../../utils/helper";
import CustomCheckbox from "../../components/shared/CustomCheckbox";
import CustomButton from "../../components/shared/CustomButton";
import { deleteAlarms, getAlarms } from "../../services/alarmService";

const AlarmsPage = () => {
  const [loading, setLoading] = useState(false);
  const [allAlarms, setAllAlarms] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAlarms();
        setAllAlarms(res.data.data.alarms);
        setAlarms(
          res.data.data.alarms.map((alarm) => {
            return { ...alarm, selected: false };
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
      const { data } = await deleteAlarms({
        alarmIds: alarms
          .filter((alarm) => alarm.selected)
          .map((alarm) => alarm.alarmId),
      });
      setAlarms(alarms.filter((alarm) => !alarm.selected));
      setAllAlarms(alarms.filter((alarm) => !alarm.selected));
      notif_success("هشدار های انتخاب شده با موفقیت حذف شدند.");
      setIsDeleting(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (file) => {
    
  }

  return (
    <div className="alarms-page">
      <LoadingModal isOpen={loading} />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        count={alarms.filter((alarm) => alarm.selected).length}
        onSubmit={submitDelete}
      />
      <div className="sections-page-header">
        {/* <h4>هشدارها</h4> */}
        <CustomSearchInput placeholder={"جستجوی هشدار ..."} />
      </div>
      <div className="alarms-page-header">
        <h4>هشدارها</h4>
        <div className="operations-icons">
          {/* {isEditing && (
            <CustomButton
              style={{ marginLeft: 8 }}
              onClick={() =>
                navigate(
                  `/alarms/edit/${
                    alarms.find((alarm) => alarm.selected)?.alarmId || 0
                  }`
                )
              }
              text={"ویرایش"}
            />
          )} */}
          {!isDeleting && <EditIcon onClick={() => setIsEditing(!isEditing)} />}
          {isDeleting && (
            <span
              style={{ color: "#69120B" }}
              onClick={() => setDeleteModal(true)}
            >
              حذف {alarms.filter((alarm) => alarm.selected).length} ردیف
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
        headers={["مربوط به", "توضیحات", "فایل مربوطه", "تاریخ ثبت"]}
        separated={isDeleting || isEditing}
      >
        {alarms.map((alarm) => (
          <div key={alarm.alarmId} className="custom-table-row">
            <div className="custom-table-col-text">
              <span>{alarm.Person?.name || "نامشخص"}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{alarm.description}</span>
            </div>
            <div className="cusotm-table-col-text">
              {alarm.file ? <CustomButton text={"دانلود"} onClick={() => downloadFile(alarm.file)} /> : <span>-</span>}
            </div>
            <div className="custom-table-col-date-time">
              <div>{toShamsi(alarm.createdAt)}</div>
              <div>{getTime(alarm.createdAt)}</div>
            </div>
            <div className="custom-table-col-select">
              <CustomCheckbox
                checked={alarm.selected}
                onChange={() => {
                  let list;
                  if (isDeleting) list = [...alarms];
                  else
                    list = [...alarms].map((g) => {
                      return { ...g, selected: false };
                    });
                  const index = list.findIndex(
                    (x) => x.alarmId === alarm.alarmId
                  );
                  list[index].selected = !alarm.selected;
                  setAlarms(list);
                }}
              />
            </div>
          </div>
        ))}
      </CustomTable>
    </div>
  );
};

export default AlarmsPage;
