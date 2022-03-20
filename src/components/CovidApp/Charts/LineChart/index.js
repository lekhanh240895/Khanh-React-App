import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import HighChart from "highcharts";
import moment from "moment";
import { ButtonGroup, Button } from "react-bootstrap";

const generateOptions = (data) => {
  const categories = data.map((item) => moment(item.Date).format("DD/MM/YY"));

  return {
    chart: {
      height: 500,
    },
    title: {
      text: "Thống kê tình hình dịch Covid theo từng tháng",
    },
    subtitle: {
      text: "Source: api.covid19api.com",
    },
    xAxis: {
      categories: categories,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: null,
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:50px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color: {series.color); padding:0">{series.name): </td>' +
        '<td style="padding:0"><b>{point.y} ca</b></td></tr> ',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },
    series: [
      {
        name: "Số ca nhiễm",
        data: data.map((item) => item.Confirmed),
        color: "#FF0000",
      },
      {
        name: "Số ca phục hồi",
        data: data.map((item) => item.Recovered),
        color: "#048DED",
      },
      {
        name: "Số ca tử vong",
        data: data.map((item) => item.Deaths),
        color: "gray",
      },
    ],
  };
};

function LineChart({ data }) {
  const [options, setOptions] = useState({});
  const [reportType, setReportType] = useState("");

  useEffect(() => {
    let customData = [];

    switch (reportType) {
      case "all":
        customData = data;
        break;
      case "30":
        customData = data.slice(data.length - 30);
        break;
      case "7":
        customData = data.slice(data.length - 7);
        break;
      default:
        customData = data;
    }
    setOptions(generateOptions(customData));
  }, [data, reportType]);

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <ButtonGroup>
          <Button variant="outline-danger" onClick={() => setReportType("all")}>
            Tất cả
          </Button>
          <Button variant="outline-danger" onClick={() => setReportType("30")}>
            30 ngày
          </Button>
          <Button variant="outline-danger" onClick={() => setReportType("7")}>
            7 ngày
          </Button>
        </ButtonGroup>
      </div>

      <HighchartsReact highcharts={HighChart} options={options} />
    </>
  );
}

export default LineChart;
