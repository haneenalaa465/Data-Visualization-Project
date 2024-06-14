function fetchDataAndUpdateMapChart() {
    fetch('/get-data-map')
      .then(response => response.json())
      .then(data => {
        updateMapChart(data);
      })
      .catch(error => console.error('Error:', error))
  }

function updateMapChart(dataset) {
  am5.ready(function() {

    // Create root
    var root = am5.Root.new("MapChartdiv"); 
    
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    var chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "none",
      projection: am5map.geoAlbersUsa(),
      layout: root.horizontalLayout
    }));
    
    // Create polygon series
    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_usaLow,
      valueField: "value",
      calculateAggregates: true
    }));
    
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}"
    });
    
    polygonSeries.set("heatRules", [{
      target: polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0x6794dc),
      max: am5.color(0x001536),
      key: "fill"
    }]);
    
    polygonSeries.mapPolygons.template.events.on("pointerover", function(ev) {
      heatLegend.showValue(ev.target.dataItem.get("value"));
    });

    const stateAbbreviations = {
      "Alabama": "AL",
      "Alaska": "AK",
      "Arizona": "AZ",
      "Arkansas": "AR",
      "California": "CA",
      "Colorado": "CO",
      "Connecticut": "CT",
      "Delaware": "DE",
      "District of Columbia": "DC",
      "Florida": "FL",
      "Georgia": "GA",
      "Hawaii": "HI",
      "Idaho": "ID",
      "Illinois": "IL",
      "Indiana": "IN",
      "Iowa": "IA",
      "Kansas": "KS",
      "Kentucky": "KY",
      "Louisiana": "LA",
      "Maine": "ME",
      "Maryland": "MD",
      "Massachusetts": "MA",
      "Michigan": "MI",
      "Minnesota": "MN",
      "Mississippi": "MS",
      "Missouri": "MO",
      "Montana": "MT",
      "Nebraska": "NE",
      "Nevada": "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      "Ohio": "OH",
      "Oklahoma": "OK",
      "Oregon": "OR",
      "Pennsylvania": "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      "Tennessee": "TN",
      "Texas": "TX",
      "Utah": "UT",
      "Vermont": "VT",
      "Virginia": "VA",
      "Washington": "WA",
      "West Virginia": "WV",
      "Wisconsin": "WI",
      "Wyoming": "WY"
    };

    function convertData(data) {
      return data.map(item => {
          const state = item.date.split('-')[1];
          const value = item.value;
          return {
              id: "US-" + stateAbbreviations[state],
              value: value
          };
      });
  }

    const data = convertData(dataset);
    
    polygonSeries.data.setAll(data);
    
    var heatLegend = chart.children.push(am5.HeatLegend.new(root, {
      orientation: "vertical",
      startColor: am5.color(0x6794dc),
      endColor: am5.color(0x001536),
      startText: "Lowest",
      endText: "Highest",
      stepCount: 5
    }));
    
    heatLegend.startLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("startColor")
    });
    
    heatLegend.endLabel.setAll({
      fontSize: 12,
      fill: heatLegend.get("endColor")
    });
    
    // change this to template when possible
    polygonSeries.events.on("datavalidated", function () {
      heatLegend.set("startValue", polygonSeries.getPrivate("valueLow"));
      heatLegend.set("endValue", polygonSeries.getPrivate("valueHigh"));
    });
    
    }); // end am5.ready()
}

document.addEventListener('DOMContentLoaded', function () {
    fetchDataAndUpdateMapChart();
  });