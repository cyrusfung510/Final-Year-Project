import React from "react";
import { Doughnut } from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";

const DoughnutChart = (props) => {
    const dataConcerned = props.chartData;

    return (
        <div className="DoughnutChartContainer">
            <Doughnut data={dataConcerned}/>
        </div>
    )
}

export default DoughnutChart;