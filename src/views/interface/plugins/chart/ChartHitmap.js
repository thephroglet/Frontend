import React, { Component } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

class ChartHitmap extends Component {
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

    let root = am5.Root.new("chartdiv");

root.setThemes([
  am5themes_Animated.new(root)
]);

let chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "none",
    wheelY: "none",
    layout: root.verticalLayout
  })
);

let yRenderer = am5xy.AxisRendererY.new(root, {
  visible: false,
  minGridDistance: 20,
  inversed: true
});

yRenderer.grid.template.set("visible", false);

let yAxis = chart.yAxes.push(
  am5xy.CategoryAxis.new(root, {
    renderer: yRenderer,
    categoryField: "category"
  })
);

let xRenderer = am5xy.AxisRendererX.new(root, {
  visible: false,
  minGridDistance: 30,
  inversed: true
});

xRenderer.grid.template.set("visible", false);

let xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    renderer: xRenderer,
    categoryField: "category"
  })
);

let series = chart.series.push(
  am5xy.ColumnSeries.new(root, {
    calculateAggregates: true,
    stroke: am5.color(0xffffff),
    clustered: false,
    xAxis: xAxis,
    yAxis: yAxis,
    categoryXField: "x",
    categoryYField: "y",
    valueField: "value"
  })
);

series.columns.template.setAll({
  tooltipText: "{value}",
  strokeOpacity: 1,
  strokeWidth: 2,
  cornerRadiusTL: 5,
  cornerRadiusTR: 5,
  cornerRadiusBL: 5,
  cornerRadiusBR: 5,
  width: am5.percent(100),
  height: am5.percent(100),
  templateField: "columnSettings"
});

let circleTemplate = am5.Template.new({});

series.set("heatRules", [{
  target: circleTemplate,
  min: 10,
  max: 35,
  dataField: "value",
  key: "radius"
}]);

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Circle.new(
      root,
      {
        fill: am5.color(0x000000),
        fillOpacity: 0.2,
        strokeOpacity: 0,
        graphs: {
        color: "#008000",
        },
      },
      circleTemplate
    )
  });
});

series.bullets.push(function () {
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      fill: am5.color(0xffffff),
      populateText: true,
      centerX: am5.p50,
      centerY: am5.p50,
      fontSize: 10,
      text: "{value}"
    })
  });
});

let data = this.props.chartData.map(data => ({
    y: data.ColumnName1,
    x: data.ColumnName2,
    value: data.GlobalScore,
    columnSettings: {
        fill: this.getColor(data.GlobalScore)
    },
}));

series.data.setAll(data);

yAxis.data.setAll(this.props.axisData);

xAxis.data.setAll(this.props.axisData);

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
      <div id="chartdiv" className="text-muted " style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default ChartHitmap;