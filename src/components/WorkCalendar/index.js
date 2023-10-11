import React from "react";
import { Calendar, Tooltip } from "antd";
import { useAppContext } from "../../contexts/AppContext";
import { sumBy } from "lodash";
import { Badge, Button } from "react-bootstrap";
import "./index.css";
import { Alert } from "react-bootstrap";
import CountUp from "react-countup";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const WorkCalendar = () => {
  const {
    setIsWorkSheetModalShowed,
    selectedDate,
    setSelectedDate,
    userWorkInMonth,
  } = useAppContext();

  const onSelect = (value, { source }) => {
    setSelectedDate(value);

    if (source === "date") {
      setIsWorkSheetModalShowed(true);
    }
  };

  const [showTime, setShowTime] = React.useState(false);

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

  function getData(value) {
    let data = userWorkInMonth?.work?.find(
      (workDay) =>
        workDay.date === value.date() &&
        userWorkInMonth.month === value.month() + 1
    );

    return data || {};
  }

  const dateCellRender = (value, { type }) => {
    if (type === "date") {
      const data = getData(value);

      return (
        <div style={{ postion: "relative" }}>
          <div key={data.date} style={{ padding: "10px 0" }}>
            <Badge bg={bgStyle(data.workTime)}>{data.workTime}</Badge>
          </div>

          {(data.timeStart || data.timeFinish) && (
            <div
              className="poppup-timework"
              style={{ display: !showTime && "none" }}
            >
              <span>{data.timeStart}</span>
              <span className="mx-1">-</span>
              <span>{data.timeFinish}</span>
            </div>
          )}

          <div className="d-none d-sm-block">
            {(data.timeStart || data.timeFinish) && (
              <Tooltip
                title={
                  <div
                    style={{
                      color: "#000",
                    }}
                  >
                    <span>{data.timeStart}</span>
                    <span className="mx-1">-</span>
                    <span>{data.timeFinish}</span>
                  </div>
                }
                placement="top"
                color="white"
              >
                <div className="timework-icon">
                  <FontAwesomeIcon icon={["far", "clock"]} />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      );
    } else {
      if (value.month() + 1 === userWorkInMonth?.month) {
        return sumWork ? <h1>{sumWork}</h1> : null;
      }
    }
  };

  const sumWork = useMemo(
    () => sumBy(userWorkInMonth?.work, "workTime"),
    [userWorkInMonth]
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
        <h1 style={{ color: "inherit" }}>
          {Number.isInteger(sumWork) ? (
            <CountUp end={sumWork} duration={1} />
          ) : (
            <CountUp end={sumWork} duration={1} decimals={1} decimal="," />
          )}
        </h1>
      </Alert>

      <Button
        variant="outline-success"
        className="mb-2"
        onClick={() => setShowTime(!showTime)}
      >
        Show working time in {selectedDate.format("MMMM")}
      </Button>

      <Calendar cellRender={dateCellRender} onSelect={onSelect} />
    </div>
  );
};

export default WorkCalendar;
