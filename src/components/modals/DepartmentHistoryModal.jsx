import { motion, AnimatePresence } from "framer-motion";
import CustomTable from "../shared/CustomTable";
import CloseIcon from "../icons/CloseIcon";
import { useEffect, useState } from "react";
import { getReportsOfDepartment } from '../../services/reportService';
import { getTime, toShamsi } from "../../utils/helper";

const DepartmentHistoryModal = ({ isOpen, onClose, departmentId }) => {
  const [reports, setReports] = useState([]);
  const [totalPage, setTotalPage] = useState();
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const res = await getReportsOfDepartment({departmentId});
      console.log("res:", res);
      setReports(res.data.data.reports);
      setTotalPage(res.data.data.totalPage);
    })();
  }, [isOpen])
  if (!departmentId) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="custom-modal department-history-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="custom-modal-close" onClick={onClose}>
              <CloseIcon />
            </div>
            <p className="title">تاریخچه حضور غیاب {reports[0]?.Person.Department.name}</p>
            <CustomTable
              headers={["نام", "تاریخ ثبت", "ضریب اطمینان", "وضعیت"]}
            >
              {reports.map(report => (
                <div className="custom-table-row">
                <div className="custom-table-col-image-text">
                  <div>
                    <img src="/icons/profile.png" />
                  </div>
                  <div>
                    <span>{report.Person.name}</span>
                    <span>{report.Person.phoneNumber}</span>
                  </div>
                </div>
                <div className="custom-table-col-date-time">
                  <div>{toShamsi(report.createdAt)}</div>
                  <div>{getTime(report.createdAt)}</div>
                </div>
                <div className="custom-table-col-text">
                  <span>٪ {report.confidenceFactor}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {report.Camera.direction === "enter" ? (
                      <div className="custom-badge-success">
                      ورودی
                    </div>
                    ) : (
                      <div className="custom-badge-danger">
                      خروجی
                    </div>
                    )}
                    <div style={{ marginRight: 8 }}>{report.Camera.name}</div>
                  </div>
                </div>
              </div>  
              ))}
            </CustomTable>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DepartmentHistoryModal;
