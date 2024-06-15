function fetchDataAndUpdateBarChart() {
  fetch('/get-data-bar')
    .then(response => response.json())
    .then(data => {
      updateBarChart(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateBarChart(dataset) {
  // Initialize amCharts
  am5.ready(function() {

    // Create root element
    var root = am5.Root.new("BarChartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: root.horizontalLayout,
    }));
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legendData = [];
    var legend = chart.children.push(
      am5.Legend.new(root, {
        nameField: "name",
        fillField: "color",
        strokeField: "color",
        //centerY: am5.p50,
        marginLeft: 20,
        y: 20,
        layout: root.verticalLayout,
        clickTarget: "none"
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "state",
      renderer: am5xy.AxisRendererY.new(root, {
        minGridDistance: 10,
        minorGridEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    yAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
      location: 0.5
    })

    yAxis.data.setAll(dataset);

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "sales",
      categoryYField: "state",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal"
      })
    }));

    series.columns.template.setAll({
      tooltipText: "{categoryY}: [bold]{valueX}[/]",
      width: am5.percent(90),
      strokeOpacity: 0
    });

    series.columns.template.adapters.add("fill", function(fill, target) {
      if (target.dataItem) {
        switch(target.dataItem.dataContext.region) {
          case "Furniture":
            return chart.get("colors").getIndex(0);
            break;
          case "Office Supplies":
            return chart.get("colors").getIndex(1);
            break;
          case "Technology":
            return chart.get("colors").getIndex(2);
            break;
        }
      }
      return fill;
    })

    series.data.setAll(dataset);

    function createRange(label, category, color) {
      var rangeDataItem = yAxis.makeDataItem({
        category: category
      });
      
      var range = yAxis.createAxisRange(rangeDataItem);
      
      rangeDataItem.get("label").setAll({
        fill: color,
        text: label,
        location: 1,
        fontWeight: "bold",
        dx: -130
      });

      rangeDataItem.get("grid").setAll({
        stroke: color,
        strokeOpacity: 1,
        location: 1
      });
      
      rangeDataItem.get("tick").setAll({
        stroke: color,
        strokeOpacity: 1,
        location: 1,
        visible: true,
        length: 130
      });
      
      legendData.push({ name: label, color: color });
      
    }

    createRange("Furniture", "Tables", chart.get("colors").getIndex(0));
    createRange("Office Supplies", "Supplies", chart.get("colors").getIndex(1));
    createRange("Technology", "Phones", chart.get("colors").getIndex(2));

    legend.data.setAll(legendData);

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      yAxis: yAxis
    }));


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear();
    chart.appear(1000, 100);


  }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function () {
  fetchDataAndUpdateBarChart();
});