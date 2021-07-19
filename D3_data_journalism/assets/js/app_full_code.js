//Establish width, height, margins and padding for the graph.
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;

// var svgWidth = 960;
// var svgHeight = 500;

//Establish the margins of the wrapper
var margin = 20;
var labelArea = 110;
var tPadBot = 40;
var tPadLeft = 40;

// //Establish the width and height of the chart using the margins and svg dimensions
// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

//Define svg wrapper and append svg group that will hold the chart
//Shift the chart by a measure of the top and left margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

//Setting radius for each dot that will appear in teh graph
var circRadius;

/**
* Set Y Axis Min Max Ranges
*/
function setCircleRadius() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
setCircleRadius();

//Group element to net bottom axes labels
svg.append("g").attr("class", "xText");

//xText will allow us to select the group without excess code
var xText = d3.select(".xText");

/**
* Refresh X Axis text
*/
//
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}

xTextRefresh();

//X Axis text, and active/inactive class designations
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

  xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");


//Y Axis 
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

/**
* Refresh Y Axis text
*/
//
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  )
}
yTextRefresh();

//Y Axis text, and active/inactive class designations
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)")

yText
  .append("text")
  .attr("x", 0) //.attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)")

yText
  .append("text")
  .attr("y", 26) //.attr("x", 0)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)")

//Driver for the entire work - powered by data within the csv
d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});

/**
* Main function that executes the chart
*/
function visualize(theData) {

  //current X/Y axis on load
  var curX = "poverty";
  var curY = "obesity";

  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  //Tooltop initialization
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      var theX;
      var theState = "<div>" + d.state + "</div>";
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";

      if(curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        theX = "<div>" + 
          curX + 
          ": " +
          parseFloat(d[curX]).toLocaleString("en") + "</div>";
      }
      return theState + theX + theY;
    });
    svg.call(toolTip);

  /**
  * Set x Axis Min Max Ranges
  */
  function setXMinMax() {
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * .90;
    });


    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  /**
  * Set Y Axis Min Max Ranges
  */
  function setYMinMax() {
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  /**
   * Set Labels
   * @param {object} axis: label change for given axis
   * @param {object} clickedText: selected Text for label - used to set class property inactive/active
   */
  function setLabels(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    
    clickedText.classed("inactive", false).classed("active", true);
  }

  setXMinMax();
  setYMinMax();

  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  /**
   * Set Tick Counts depending on screen width
   */
  function setTicks() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  setTicks();

  // Append x Axis to the SVG element
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  
  // Append y Axis to the SVG element
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  //Set circles scale and evets
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  //Set circles text from given dataset with events
  theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]-0.2);
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });


  //Event handler for when either the x Axis or y Axis is clicked
  //Axis styles will change, x and y data sets will change which will set
  //the locations and text of the circles
  d3.selectAll(".aText").on("click", function () {

    var self = d3.select(this);
    if(self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");
      
      if(axis === "x") {
        curX = name;
        setXMinMax();
        xScale.domain([xMin, xMax]);

        svg.select(".xAxis").transition().duration(300).call(xAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });
        setLabels(axis, self);
      }
      else {
        curY = name;
        setYMinMax();
        yScale.domain([yMin, yMax]);
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });
        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });
        setLabels(axis, self);
      }
    }
  });

  //Event handler for when the browser window is resized
  d3.select(window).on("resize", resize);
  function resize() {
    //get width and height of the new window size
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    //update the width and height of the chart
    svg.attr("width", width).attr("height", height);

    //update the ranges for both axis
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    //set the new axis to the svg chart
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    
    svg.select(".yAxis").call(yAxis);

    //Update ticks and refresh the axis text
    setTicks();
    xTextRefresh();
    yTextRefresh();

    //update the new radius of the circles depending on browser size
    setCircleRadius();

    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function(d) {
        return circRadius;
      });

      d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}
