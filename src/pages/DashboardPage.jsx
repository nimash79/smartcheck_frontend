import { useEffect, useRef, useState } from "react";
import ArrowDownIcon from "../components/icons/ArrowDownIcon";
import CustomTable from "../components/shared/CustomTable";
import { getReports } from "../services/reportService";
import { getTime, toShamsi } from "../utils/helper";
import { notif_success } from "../utils/toast";

const DashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const audioRef = useRef();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("WebSocket connected to server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "traffic_detected") {
        console.log("traffic detected:", data);
        setReports((rs) => {
          const list = [...rs];
          if (list.length === 10) list[0] = data;
          else list.unshift(data);
          return list;
        });
        audioRef.current.play();
        notif_success("تردد جدید ثبت شد!");
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await getReports({
          page,
          limit: 10,
          sortBy: "createdAt",
          order: "desc",
          search,
        });
        console.log("res:", res);
        setReports(res.data.data.reports);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };

    loadReports();
  }, [page, search]);

  return (
    <div className="dashboard-page">
      <audio
        ref={audioRef}
        src="/sounds/notification_game.wav"
        preload="auto"
        muted={false}
      />

      <h4 className="page-title">آخرین ترددها</h4>
      <CustomTable
        headers={["نام", "بخش", "گیت", "ضریب اطمینان", "وضعیت", "تاریخ ثبت"]}
      >
        {reports.map((report) => (
          <div key={report.reportId} className="custom-table-row">
            <div className="custom-table-col-image-text">
              <div>
                <img src="/icons/profile.png" />
              </div>
              <div>
                <span>{report.Person.name}</span>
                <span>{report.Person.phoneNumber}</span>
              </div>
            </div>
            <div className="custom-table-col-text">
              <span>{report.Person.Department.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>{report.Camera.Gate?.name}</span>
            </div>
            <div className="custom-table-col-text">
              <span>٪ {report.confidenceFactor}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {report.Camera.direction === "enter" ? (
                <div className="custom-badge-success">ورودی</div>
              ) : (
                <div className="custom-badge-danger">خروجی</div>
              )}
              <div style={{ marginRight: 8 }}>{report.Camera.name}</div>
            </div>
            <div className="custom-table-col-date-time">
              <div>{toShamsi(report.createdAt)}</div>
              <div>{getTime(report.createdAt)}</div>
            </div>
          </div>
        ))}
      </CustomTable>
    </div>
  );
};

export default DashboardPage;
