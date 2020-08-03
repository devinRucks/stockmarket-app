import React, { useContext, useRef, useLayoutEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { observer } from 'mobx-react';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { GraphInfoStoreContext } from '../../stores/GraphInfoStore'
import { SettingsStoreContext } from '../../stores/SettingsStore'
import './Chart.scss'

am4core.useTheme(am4themes_animated);

const Chart = observer(() => {
     const stockChart = useRef(null);
     const GraphInfoStore = useContext(GraphInfoStoreContext)
     const SettingsStore = useContext(SettingsStoreContext)

     useLayoutEffect(() => {
          let chart = am4core.create("chart", am4charts.XYChart);

          chart.paddingRight = 20;

          // chart.data = this.props.data;
          chart.data = GraphInfoStore.graphData;

          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
          dateAxis.renderer.minWidth = 15;
          dateAxis.renderer.labels.template.rotation = 90;

          if (SettingsStore.darkMode) {
               dateAxis.renderer.labels.template.fill = am4core.color("#FFF");
               dateAxis.renderer.grid.template.stroke = am4core.color("#FFF");
          } else {
               dateAxis.renderer.labels.template.fill = am4core.color("#333");
               dateAxis.renderer.grid.template.stroke = am4core.color("#333");
          }

          dateAxis.renderer.labels.template.verticalCenter = "middle";
          dateAxis.renderer.labels.template.horizontalCenter = "left";

          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.tooltip.disabled = true;

          if (SettingsStore.darkMode) {
               valueAxis.renderer.labels.template.fill = am4core.color("#FFF");
               valueAxis.renderer.grid.template.stroke = am4core.color("#FFF");
          } else {
               valueAxis.renderer.labels.template.fill = am4core.color("#333");
               valueAxis.renderer.grid.template.stroke = am4core.color("#333");
          }

          let series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.dateX = "date";
          series.dataFields.valueY = "value";

          series.tooltipText = "{valueY.value}";
          chart.cursor = new am4charts.XYCursor();
          chart.cursor.snapToSeries = series;
          chart.cursor.xAxis = dateAxis;

          series.strokeWidth = 3;
          series.fillOpacity = 1;
          series.stroke = am4core.color("#30c759");

          // changes color of gradient
          series.fill = am4core.color("#30c759").lighten(0.5);

          let fillModifier = new am4core.LinearGradientModifier();
          fillModifier.opacities = [.7, .2];
          fillModifier.offsets = [0, .15];
          fillModifier.gradient.rotation = 90;
          series.segments.template.fillModifier = fillModifier;

          stockChart.current = chart;

          return () => {
               chart.dispose();
          };
     }, [GraphInfoStore.graphData, SettingsStore.darkMode]);

     useLayoutEffect(() => {
          stockChart.current.data = GraphInfoStore.graphData;
     }, [GraphInfoStore.graphData]);


     return (
          <div id="chart" style={{ width: "100%", height: "450px" }}></div>
     );
});

export default Chart;

