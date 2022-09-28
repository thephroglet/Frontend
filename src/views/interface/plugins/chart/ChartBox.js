import React, { Component } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class ChartBox extends Component {
    getColor(score) {
        //Si score entre 0 et 0.3 alors vert
        // Si score entre 0.3 et 0.6 alors Orange et le reste rouge
        // Si pas de correlation white
        let colors = {
            critical: am5.color(0xca0101),
            bad: am5.color(0xe17a2d),
            medium: am5.color(0xe1d92d),
            good: am5.color(0x5dbe24),
            verygood: am5.color(0x0b7d03)
        };
        if (score <= 0) {
            return am5.color(0xffffff)
        } else if (score <= 0.3) {
            return colors.verygood
        } else if (score <= 0.6) {
            return colors.bad
        }
        return colors.critical
    }

  componentDidMount() {

    let root = am5.Root.new("ChartBox");

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    focusable: true,
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX"
  })
);

let xAxis = chart.xAxes.push(
  am5xy.DateAxis.new(root, {
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
  })
);

let yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

let color = root.interfaceColors.get("background");

let series = chart.series.push(
  am5xy.CandlestickSeries.new(root, {
    fill: color,
    stroke: color,
    name: "MDXI",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "close",
    openValueYField: "open",
    lowValueYField: "low",
    highValueYField: "high",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY},\nmediana: {mediana}"
    })
  })
);

let medianaSeries = chart.series.push(
  am5xy.StepLineSeries.new(root, {
    stroke: root.interfaceColors.get("background"),
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "mediana",
    valueXField: "date",
    noRisers: true
  })
);

let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
  xAxis: xAxis
}));
cursor.lineY.set("visible", false);
/*
let data = [
  {
    date: "2019-08-01",
    open: 132.3,
    high: 136.96,
    low: 131.15,
    close: 136.49
  },
  {
    date: "2019-08-02",
    open: 135.26,
    high: 135.95,
    low: 131.5,
    close: 131.85
  },
  {
    date: "2019-08-03",
    open: 129.9,
    high: 133.27,
    low: 128.3,
    close: 132.25
  },
  {
    date: "2019-08-04",
    open: 132.94,
    high: 136.24,
    low: 132.63,
    close: 135.03
  },
  {
    date: "2019-08-05",
    open: 136.76,
    high: 137.86,
    low: 132.0,
    close: 134.01
  },
  {
    date: "2019-08-06",
    open: 131.11,
    high: 133.0,
    low: 125.09,
    close: 126.39
  },
  {
    date: "2019-08-07",
    open: 130.11,
    high: 133.0,
    low: 125.09,
    close: 127.39
  },
  {
    date: "2019-08-08",
    open: 125.11,
    high: 126.0,
    low: 121.09,
    close: 122.39
  },
  {
    date: "2019-08-09",
    open: 131.11,
    high: 133.0,
    low: 122.09,
    close: 124.39
  }
];
*/

let data = this.props.chartData.map(data => ({
  y: data.Outliers,
  x: data.ColumnName,
 // value: data.GlobalScore,
 /* columnSettings: {
      fill: this.getColor(data.GlobalScore)
  },*/
}));
addMediana();

function addMediana() {
  for (var i = 0; i < data.length; i++) {
    let dataItem = data[i];
    dataItem.mediana =
      Number(dataItem.low) + (Number(dataItem.high) - Number(dataItem.low)) / 2;
  }
}



series.data.setAll(data);
medianaSeries.data.setAll(data);

series.appear(1000, 100);
medianaSeries.appear(1000, 100);
chart.appear(1000, 100);

    this.root = root;
  }

  componentWillUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  }

  render() {
    return (
      <div id="ChartBox" className="text-muted " style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default ChartBox;