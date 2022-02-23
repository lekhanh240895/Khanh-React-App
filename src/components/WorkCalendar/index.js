import React from "react";
import { Calendar } from "antd";
import { useAppContext } from "../../contexts/AppContext";
import { sumBy } from "lodash";
import { Badge } from "react-bootstrap";
import "./index.css";
import { Alert } from "react-bootstrap";
import CountUp from "react-countup";
import { useMemo } from "react";

export const WorkCalendar = () => {
  const {
    setIsWorkSheetModalShowed,
    selectedDate,
    setSelectedDate,
    userWorkMonth,
  } = useAppContext();

  const bgStyle = (workTime) => {
    switch (workTime) {
      case 0:
        return "danger";
      case 0.5:
        return "secondary";
      case 1.5:
        return "success";
      case 2:
        return "info";
      default:
    }
  };

  const dateCellRender = (value) => {
    return userWorkMonth?.work.map((workDay) => {
      if (value.date() === workDay.date) {
        return (
          <div key={workDay.date}>
            <Badge bg={bgStyle(workDay.workTime)}>{workDay.workTime}</Badge>
          </div>
        );
      }
      return null;
    });
  };
  const monthCellRender = () => {};

  const onSelect = (value) => {
    setSelectedDate(value);
    setIsWorkSheetModalShowed(true);
  };

  const sumWork = useMemo(
    () => sumBy(userWorkMonth?.work, "workTime"),
    [userWorkMonth]
  );

  return (
    <div>
      <h1>WORK CALENDAR</h1>

      <Alert
        variant="success"
        style={{ textAlign: "center", fontSize: "30px", fontWeight: "600 " }}
      >
        Số công trong tháng {selectedDate?.month() + 1} năm&nbsp;
        {selectedDate.year()} của bạn là:
        <h1 style={{color: "inherit"}}>
          {Number.isInteger(sumWork) ? (
            <CountUp end={sumWork} duration={1} />
          ) : (
            <CountUp end={sumWork} duration={1} decimals={1} decimal="," />
          )}
        </h1>
      </Alert>

      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        onSelect={onSelect}
      />
    </div>
  );
};

export default WorkCalendar;
