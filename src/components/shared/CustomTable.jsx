import React from "react";
import ArrowDownIcon from "../icons/ArrowDownIcon";

const data = [
  {
    id: 1,
    name: "فاطمه صادقی",
    company: "شرکت اسمارت‌چک",
    score: "98",
    status: "ورود",
    date: "1404/03/20",
    time: "19:17",
  },
  {
    id: 2,
    name: "نیما شریفی‌نیا",
    company: "شرکت اسمارت‌چک",
    score: "98",
    status: "خروج",
    date: "1404/03/20",
    time: "19:18",
  },
  {
    id: 3,
    name: "فاطمه صادقی",
    company: "شرکت اسمارت‌چک",
    score: "98",
    status: "ورود",
    date: "1404/03/20",
    time: "19:19",
  },
  {
    id: 4,
    name: "نیما شریفی‌نیا",
    company: "شرکت اسمارت‌چک",
    score: "98",
    status: "خروج",
    date: "1404/03/20",
    time: "19:20",
  },
  // Add more rows as needed...
];

const CustomTable = ({headers, separated = false, children, ...props}) => {
  return (
    <div className={separated ? "custom-table separated" : "custom-table"} {...props}>
        <div className="custom-table-header">
          {headers.map(header => (
            <div key={header}>
              <ArrowDownIcon />
              <span>{header}</span>
            </div>
          ))}
          {separated && <div className="custom-table-col-select custom-table-separator"></div>}
        </div>
        <div className="custom-table-body">
          {children}
        </div>
      </div>
  );
}

export default CustomTable;