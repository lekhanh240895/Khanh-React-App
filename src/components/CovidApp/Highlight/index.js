import React from "react";
import { Row } from "react-bootstrap";
import HighlightCard from "../HighlightCard";

export default function Highlight({ report }) {
  const data = report && report.length ? report[report.length - 1] : [];

  const summary = [
    {
      title: "Số ca nhiễm",
      count: data.Confirmed,
      type: "confirmed",
    },
    {
      title: "Số ca phục hồi",
      count: data.Recovered,
      type: "recovered",
    },
    {
      title: "Số ca tử vong",
      count: data.Deaths,
      type: "death",
    },
  ];
  return (
    <Row className="mb-4">
      {summary.map((item) => (
        <HighlightCard key={item.type} item={item} />
      ))}
    </Row>
  );
}
