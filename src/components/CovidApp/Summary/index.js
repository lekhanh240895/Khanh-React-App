import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import HighMaps from "../Charts/HighMaps";
import LineChart from "../Charts/LineChart";

export default function Summary({ report, selectedCountryId, setError }) {
  const [mapData, setMapData] = useState({});

  useEffect(() => {
    setError("");
    if (selectedCountryId) {
      import(
        `@highcharts/map-collection/countries/${selectedCountryId}/${selectedCountryId}-all.geo.json`
      )
        .then((res) => setMapData(res))
        .catch(() => setError("No data available for selected country"));
    }
  }, [selectedCountryId, setError]);

  return (
    <Row className="mb-4">
      <Col xs={12} sm={8}>
        <LineChart data={report} />
      </Col>

      <Col xs={12} sm={4} className="mt-sm-5">
        <HighMaps mapData={mapData} />
      </Col>
    </Row>
  );
}
