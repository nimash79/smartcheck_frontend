import { Link, useNavigate } from "react-router";
import PlusIcon from "../../components/icons/PlusIcon";
import CustomSearchInput from "../../components/shared/CustomSearchInput";
import VideoIcon from "../../components/icons/VideoIcon";
import { useEffect, useState } from "react";
import { deleteCameras, getCameras } from "../../services/cameraService";
import LoadingModal from "../../components/modals/LoadingModal";
import DeleteModal from "../../components/modals/DeleteModal";
import DeleteIcon from "../../components/icons/DeleteIcon";
import EditIcon from "../../components/icons/EditIcon";
import CustomTable from "../../components/shared/CustomTable";
import { getTime, toShamsi } from "../../utils/helper";
import CustomCheckbox from "../../components/shared/CustomCheckbox";
import CustomButton from "../../components/shared/CustomButton";

const CamerasPage = () => {
  const [loading, setLoading] = useState(false);
  const [allCameras, setAllCameras] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getCameras();
        setAllCameras(res.data.data.cameras);
        setCameras(
          res.data.data.cameras.map((camera) => {
            return { ...camera, selected: false };
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
      const { data } = await deleteCameras({
        cameraIds: cameras
          .filter((camera) => camera.selected)
          .map((camera) => camera.cameraId),
      });
      setCameras(cameras.filter((camera) => !camera.selected));
      setAllCameras(cameras.filter((camera) => !camera.selected));
      notif_success("دوربین های انتخاب شده با موفقیت حذف شدند.");
      setIsDeleting(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cameras-page">
      <LoadingModal isOpen={loading} />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        count={cameras.filter((camera) => camera.selected).length}
        onSubmit={submitDelete}
      />
      <div className="sections-page-header">
        <Link to="/cameras/add" className="add-button">
          <PlusIcon />
          <span>افزودن دوربین</span>
        </Link>
        <CustomSearchInput placeholder={"جستجوی دوربین ..."} />
      </div>
      <div className="cameras-page-header">
        <h4>دوربین های ثبت شده</h4>
        <div className="operations-icons">
          {isEditing && (
            <CustomButton
              style={{ marginLeft: 8 }}
              onClick={() =>
                navigate(
                  `/cameras/edit/${
                    cameras.find((camera) => camera.selected)?.cameraId || 0
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
              حذف {cameras.filter((camera) => camera.selected).length} ردیف
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
        headers={["نام دوربین", "گیت", "جهت", "تاریخ ثبت"]}
        separated={isDeleting || isEditing}
      >
        {cameras.map((camera) => (
          <div key={camera.cameraId} className="custom-table-row">
            <div className="custom-table-col-text">
              <span>{camera.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{camera.Gate?.name}</span>
            </div>
            <div className="custom-table-col-text">
              {camera.direction === "enter" ? (
                <span className="custom-badge-success">ورودی</span>
              ) : (
                <span className="custom-badge-danger">خروجی</span>
              )}
            </div>
            <div className="custom-table-col-date-time">
              <div>{toShamsi(camera.createdAt)}</div>
              <div>{getTime(camera.createdAt)}</div>
            </div>
            <div className="custom-table-col-select">
              <CustomCheckbox
                checked={camera.selected}
                onChange={() => {
                  let list;
                  if (isDeleting) list = [...cameras];
                  else
                    list = [...cameras].map((g) => {
                      return { ...g, selected: false };
                    });
                  const index = list.findIndex(
                    (x) => x.cameraId === camera.cameraId
                  );
                  list[index].selected = !camera.selected;
                  setCameras(list);
                }}
              />
            </div>
          </div>
        ))}
      </CustomTable>
    </div>
  );
};

export default CamerasPage;
