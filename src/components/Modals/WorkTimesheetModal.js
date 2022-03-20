import { some } from "lodash";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import { notification, TimePicker } from "antd";

export default function WorkTimesheetModal() {
  const {
    isWorkSheetModalShowed,
    setIsWorkSheetModalShowed,
    selectedDate,
    addDocument,
    userDoc,
    userWorkInMonth,
    updateDocument,
  } = useAppContext();
  const [workTime, setWorkTime] = useState(1);
  const [timeStart, setTimeStart] = useState(null);
  const [timeFinish, setTimeFinish] = useState(null);

  const handleClose = () => {
    setIsWorkSheetModalShowed(false);
  };

  const handleOk = () => {
    setIsWorkSheetModalShowed(false);

    notification["success"]({
      message: "Chấm công thành công",
      description: `Ngày ${selectedDate.format(
        "DD/MM/YYYY"
      )}: ${workTime} công`,
    });

    if (!userWorkInMonth) {
      return addDocument("worktime", {
        displayName: userDoc?.displayName,
        uid: userDoc?.uid,
        month: selectedDate?.month() + 1,
        year: selectedDate?.year(),
        work: [
          {
            date: selectedDate?.date(),
            workTime: Number(workTime),
            timeStart: timeStart || "",
            timeFinish: timeFinish?.format("HH:mm") || "",
          },
        ],
      });
    }

    if (some(userWorkInMonth?.work, { date: selectedDate.date() })) {
      const newWork = userWorkInMonth?.work.map((workDay) => {
        return workDay.date === selectedDate?.date()
          ? {
              date: selectedDate?.date(),
              workTime: Number(workTime),
              timeStart: timeStart?.format("HH:mm") || "",
              timeFinish: timeFinish?.format("HH:mm") || "",
            }
          : workDay;
      });

      updateDocument("worktime", userWorkInMonth?.id, {
        work: newWork,
      });
    } else {
      updateDocument("worktime", userWorkInMonth?.id, {
        work: userWorkInMonth?.work.concat({
          date: selectedDate?.date(),
          workTime: Number(workTime),
          timeStart: timeStart?.format("HH:mm") || "",
          timeFinish: timeFinish?.format("HH:mm") || "",
        }),
      });
    }
  };

  return (
    <Modal show={isWorkSheetModalShowed} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{`GHI NHẬN SỐ CÔNG NGÀY ${selectedDate.format(
          "DD-MM-YYYY"
        )}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          style={{ width: "100%" }}
          type="range"
          name="worktime"
          min="0"
          max="2"
          step="0.5"
          list="tickmarks"
          value={workTime}
          onChange={(e) => setWorkTime(e.target.value)}
        />

        <datalist
          id="tickmarks"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "20px",
          }}
        >
          <option value="0" label="0"></option>
          <option value="0.5" label="0.5"></option>
          <option value="1" label="1"></option>
          <option value="1.5" label="1.5"></option>
          <option value="2" label="2"></option>
        </datalist>

        <div className="d-flex align-items-center justify-content-around">
          <span>Thời gian làm:</span>

          <TimePicker
            value={timeStart}
            onChange={(time) => setTimeStart(time)}
            format={"HH:mm"}
          />
          <span className="mx-2">-</span>
          <TimePicker
            value={timeFinish}
            onChange={(time) => setTimeFinish(time)}
            format={"HH:mm"}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleOk}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
