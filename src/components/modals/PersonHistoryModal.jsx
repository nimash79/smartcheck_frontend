import { motion, AnimatePresence } from "framer-motion";
import CustomTable from "../shared/CustomTable";
import CloseIcon from "../icons/CloseIcon";
import { useEffect, useState } from "react";
import { getReportsOfPerson, getReportsOfPersonExcel } from "../../services/reportService";
import { getTime, toShamsi } from "../../utils/helper";
import CustomCalendarInput from '../shared/CustomCalendarInput';
import CustomButton from '../shared/CustomButton';
import LoadingModal from "../modals/LoadingModal";

const PersonHistoryModal = ({ isOpen, onClose, personId }) => {
  const [ready, setReady] = useState(false);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const res = await getReportsOfPerson({ personId });
      setReports(res.data.data.reports);
      setTotalPages(res.data.data.totalPages);
    })();
  }, [isOpen]);

  const submitFilter = async () => {
    setLoadingModal(true);
    try {
      const res = await getReportsOfPerson({personId, from, to});
      setReports(res.data.data.reports);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingModal(false);
    }
  }

  const clearFilterParams = () => {
    setFrom();
    setTo();
  }

  const handleExport = async () => {

    try {
      const res = await getReportsOfPersonExcel({personId});

      const blob = new Blob([res.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      const downloadUrl = window.URL.createObjectURL(blob);
      link.href = downloadUrl;
      link.download = `reports_${reports[0]?.Person?.name}_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to download Excel file");
    }
  };


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
            <LoadingModal isOpen={loadingModal} />
            <div className="custom-modal-close" onClick={onClose}>
              <CloseIcon />
            </div>
            <p className="title">تاریخچه حضور غیاب {reports[0]?.Person?.name}</p>
            <CustomButton text={"خروجی اکسل"} onClick={handleExport} />
            <div className="filter-container">
              <div className="filter-section">
                <div>
                  <label>از تاریخ:</label>
                  <CustomCalendarInput value={from} onChange={setFrom} />
                </div>
                <div>
                  <label>تا تاریخ:</label>
                  <CustomCalendarInput value={to} onChange={setTo} />
                </div>
              </div>
              <div className="filter-buttons">
                <CustomButton text={"ریست"} outline onClick={clearFilterParams} />
                <CustomButton text={"اعمال فیلتر"} onClick={submitFilter} />
              </div>
            </div>
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
