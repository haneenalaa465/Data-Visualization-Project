function fetchDataAndUpdateScatterChart() {
  fetch('/get-data-scatter')
    .then(response => response.json())
    .then(data => {
      updateScatterChart(data);
    })
    .catch(error => console.error('Error:', error));
}

function updateScatterChart(dataset) {
  am5.ready(function() {
    // Create root element
    var root = am5.Root.new("ScatterChartdiv");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelY: "zoomXY",
      pinchZoomX: true,
      pinchZoomY: true
    }));

    // Create axes
    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
      tooltip: am5.Tooltip.new(root, {}),
      min: -0.0005
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));

    // Create a series for each category
dataset.forEach((categoryData) => {
  var series = chart.series.push(am5xy.LineSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "y",
    valueXField: "x",
    valueField: "value",
    tooltip: am5.Tooltip.new(root, {
      labelText: "x: {valueX}, y: {valueY}, value: {value}"
    })
  }));
  series.strokes.template.set("visible", false);
  var data = categoryData.data.map(item => {
    return {
      x: item.x,
      y: item.y,
      color: am5.Color.fromString("#" + item.color),
      value: item.value
    };
  });
  series.data.setAll(data);
  // Add bullets
  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: root.interfaceColors.get("background"),
        stroke: series.get("fill"),
        strokeWidth: 2,
        tooltipText: "x: {valueX}, y: {valueY}, value: {value}"
      })
    });
  });

  // Create a legend for each series
  var legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p100,
    x: am5.p50,
    marginTop: 15,
    marginBottom: 15,
    items: [{
      name: categoryData.category,
      fill: am5.Color.fromString("#" + categoryData.data[0].color)
    }]
  }));
});

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      snapToSeries: dataset.map(categoryData => categoryData.category)
    }));

    // Add scrollbars
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));

    chart.set("scrollbarY", am5.Scrollbar.new(root, {
      orientation: "vertical"
    }));

    chart.appear(1000, 100);
  }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function () {
  fetchDataAndUpdateScatterChart();
});
