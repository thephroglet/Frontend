/* eslint-disable no-underscore-dangle,no-unused-vars 
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useSelector } from 'react-redux';

const ChartBar = ({chartData, chartLabel}) => {
  const { themeValues } = useSelector((state) => state.settings);
  const chartContainer = useRef(null);

  const LegendLabels = React.useMemo(() => {
    return {
      font: {
        size: 14,
        family: themeValues.font,
      },
      padding: 20,
      usePointStyle: true,
      boxWidth: 8,
    };
  }, [themeValues]);
  const ChartTooltip = React.useMemo(() => {
    return {
      enabled: true,
      position: 'nearest',
      backgroundColor: themeValues.foreground,
      titleColor: themeValues.primary,
      titleFont: themeValues.font,
      bodyColor: themeValues.body,
      bodyFont: themeValues.font,
      bodySpacing: 10,
      padding: 15,
      borderColor: themeValues.separator,
      borderWidth: 1,
      cornerRadius: parseInt(themeValues.borderRadiusMd, 10),
      displayColors: true,
      intersect: true,
      mode: 'point',
    };
  }, [themeValues]);

  const data = React.useMemo(() => { 
    console.log(typeof chartData)
    return {
      labels: chartLabel,
      datasets: [
        {
          label: "Bar Chart",
        //  icon: 'chart-2',
          borderColor: themeValues.primary,
          backgroundColor: `rgba(${themeValues.primaryrgb},0.1)`,
          data: chartData,
        },
      ],
    };
  }, [themeValues]);
  const config = React.useMemo(() => {
    return {
      type: 'bar',
      options: {
        elements: {
          bar: {
            borderWidth: 1.5,
          },
        },
        plugins: {
          crosshair: true,
          datalabels: false,
          
          legend: {
            position: '',
            labels: LegendLabels,
          },
         
          tooltip: ChartTooltip,
          streaming: true,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
          
            grid: {
              display: true,
              lineWidth: 1,
              color: themeValues.separatorLight,
              drawBorder: true,
            },
           
            ticks: {
              beginAtZero: false,
              stepSize: 80,
              padding: 20,
              fontColor: themeValues.alternate,
            },
            
          },
        },
      },
       data,
    };
  }, [data, LegendLabels, ChartTooltip, themeValues]);

  useEffect(() => {
    let myChart = null;
    if (chartContainer && chartContainer.current) {
      Chart.register(...registerables);
      myChart = new Chart(chartContainer.current, config);
    }
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [config]);

  return <canvas ref={chartContainer} />;
};

export default React.memo(ChartBar);
*/