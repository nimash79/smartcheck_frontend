import { motion, AnimatePresence } from "framer-motion";
import CustomTable from "../shared/CustomTable";
import CloseIcon from "../icons/CloseIcon";
import { useEffect, useState } from "react";
import { getReportsOfPerson } from "../../services/reportService";
import { getTime, toShamsi } from "../../utils/helper";

const PersonHistoryModal = ({ isOpen, onClose, personId }) => {
  const [ready, setReady] = useState(false);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const res = await getReportsOfPerson({ personId });
      setReports(res.data.data.reports);
      setTotalPages(res.data.data.totalPages);
    })();
  }, [isOpen]);


  if (!personId) return null;
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
            className="custom-modal person-history-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="custom-modal-close" onClick={onClose}>
              <CloseIcon />
            </div>
            <p className="title">تاریخچه حضور غیاب {reports[0]?.Person?.name}</p>
            <CustomTable headers={["تاریخ ثبت", "ضریب اطمینان", "وضعیت"]}>
              {reports.map((report) => (
                <div key={report.reportId} className="custom-table-row">
                  <div className="custom-table-col-date-time">
                    <div>{toShamsi(report.createdAt)}</div>
                    <div>{getTime(report.createdAt)}</div>
                  </div>
                  <div className="custom-table-col-text">
                    <span>
                      ٪ {report.confidenceFactor}
                    </span>
                  </div>
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
              ))}
            </CustomTable>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PersonHistoryModal;
