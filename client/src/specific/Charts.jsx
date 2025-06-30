import React from 'react'
import {Line , Doughnut} from "react-chartjs-2"

import {ArcElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, plugins, PointElement, scales, Tooltip} from "chart.js"
import { orange, purple, purpleLight } from '../constants/color';
import { getLast7days } from '../lib/features';

ChartJS.register(CategoryScale , Tooltip , Legend , ArcElement , LineElement , PointElement , Filler , LinearScale);

const labels = getLast7days();

const lineChartOptions = {
  responsive: true,
  plugins:{
    legend:{
      display: false,
    },
    title:{
      display: false,
    },
  },

  scales:{
    x :{
      grid: {
        display: false,
      },
      
    },
    y:{
      grid:{
        display: false,
        beginAtZero: true,
      }
    }
  }
}

const LineChart = ({value=[]}) => {

  const data = {
    labels,
    datasets: [
      {
      data: value,
      label: "Revenue 1",
      fill: true,
      backgroundColor: purpleLight,
      borderColor: purple,
      },
      
  ],
  }

  return (

    <Line data={data} options={lineChartOptions}/>

  )
};


const doughnutChartOptions = {
  responsive: true,
  plugins:{
    legend:{
      display: false,
    },
    title:{
      display: false,
    },
  },
  cutout: 90,
  
}

const DoughnutChart = ({value = [] , labels = []}) => {

  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [purpleLight , orange],
        borderColor: [purple, orange],
        offset: 30,
      },
      
  ],
  }

  return (
    <Doughnut data={data} options={doughnutChartOptions}
        style={{
          zIndex: 10
        }}
    />
  )
}

export {LineChart , DoughnutChart}
