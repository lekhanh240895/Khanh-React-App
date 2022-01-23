import React, { useEffect, useRef, useState } from "react";
import HighChart from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import { cloneDeep } from "lodash";

//load highcharts module
highchartsMap(HighChart);

const initOptions = {
  chart: {
    height: 500,
  },
  title: {
    text: "Biểu đồ dịch tể",
  },

  mapNavigation: {
    enabled: true,
  },
  colorAxis: {
    min: 0,
    stops: [
      [0, "green"],
      [0.2, "orange"],
      [0.4, "pink"],
      [1, "red"],
    ],
  },

  legend: {
    layout: "vertical",
    align: "left",
    verticalAlign: "bottom",
  },

  series: [
    {
      data: [],
      mapData: {},
      joinBy: ["hc-key", "key"],
      name: "Số ca mắc",
    },
  ],
};

function HighMaps({ mapData }) {
  const [options, setOptions] = useState({});
  const [configLoading, setConfigLoading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (mapData && Object.keys(mapData).length) {
      const fakeData = mapData.features.map((feature, index) => ({
        key: feature.properties["hc-key"],
        value: index,
      }));

      setOptions({
        ...initOptions,
        series: [
          {
            ...initOptions.series[0],
            mapData: mapData,
            data: fakeData,
          },
        ],
      });
    }

    if (!configLoading) setConfigLoading(true);
  }, [mapData, configLoading]);

  useEffect(() => {
    if (chartRef & chartRef.current) {
      chartRef.current.chart.series[0].update({
        mapData: mapData,
      });
    }
  }, [mapData, options]);

  if (!configLoading) return null;

  return (
    <HighchartsReact
      highcharts={HighChart}
      options={cloneDeep(options)}
      constructorType="mapChart"
      ref={chartRef}
    />
  );
}

export default HighMaps;
