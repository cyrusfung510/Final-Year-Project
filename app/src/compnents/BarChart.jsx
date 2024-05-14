import React from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";

const BarChart = (props) => {
    const dataConcerned = props.chartData;

    return (
        <div className="BarChartContainer">
            <Bar data={dataConcerned}/>
        </div>
    )
}

export default BarChart;