import React from "react";
import { SimpleBarChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

export const BarChart = ({ data }) => {
  const options = {
    axes: {
      left: { mapsTo: "value" },
      bottom: { mapsTo: "group", scaleType: "labels" },
      resizeable: false,
    },
    height: "400px",
    width: "224px",
  };
  return <SimpleBarChart data={data} options={options}></SimpleBarChart>;
};

export default BarChart;
