/* eslint-disable no-underscore-dangle,no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';

const ChartBoxPlot = ({chartData, chartLabel}) => {
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

  function randomValues(count, min, max) {
    const delta = max - min;
    return Array.from({length: count}).map(() => Math.random() * delta + min);
  }

  const data = React.useMemo(() => { 
    return {
      // define label tree
      labels: chartLabel,
      datasets: chartData.map(v => {
        v.borderColor = themeValues.primary
        v.backgroundColor = `rgba(${themeValues.primaryrgb},0.1)`
        return v
      })
    };
  }, [themeValues]);
  const config = React.useMemo(() => {
    return {
      type: 'boxplot',
      data: data,
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Box Plot Chart'
        }
      }
    };
  }, [data, LegendLabels, ChartTooltip, themeValues]);

  useEffect(() => {
    let myChart = null;
    if (chartContainer && chartContainer.current) {
      Chart.register(...registerables);
      myChart = new BoxPlotChart(chartContainer.current, config);
    }
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [config]);

  return <canvas ref={chartContainer} />;
};

export default React.memo(ChartBoxPlot);
