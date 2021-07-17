var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}
  
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;

    if (chosenXAxis === "poverty") {
        label = "Poverty (%)";
    }
    else if (chosenXAxis == "age") {
        label = "Age (Median)";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(d => `${d.state}<br>${chosenXAxis}: ${d[chosenXAxis] + percentstr}<br>${chosenYAxis}: ${d[chosenYAxis]}%`);

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    return circlesGroup;
}

d3.csv("assets/data/data.csv").then((data, err) => {
    if (err) throw err;
  
    //parse data
    data.forEach(d => {
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income
      d.obesity = +d.obesity
      d.smokes = +d.smokes;
      d.healthcare = +d.healthcare
    });

    
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    
    // Create y scale function
    let yLinearScale = xScale(data, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(bottomAx));
  
    let yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(d3.axisLeft(yLinearScale));
  
    // Labels for X and Y axis  =================
  
    let xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    let yLabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
  
    let xlabels = [];
    let ylabels = [];
  
    xlabelconf.forEach(d => setLabels(xLabelsGroup, d, xlabels));
    ylabelconf.forEach(d => setLabels(yLabelsGroup, d, ylabels));
  
    // Plotting data  =================
  
    let circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 16)
      .attr("fill", "rgba(41,177,177,.6)")
      .attr("opacity", "1.0");
  
    circlesGroup = updateToolTip(circlesGroup);
  
    let abbrGroup = chartGroup.selectAll("text.stateText")
      .data(data)
      .enter()
      .append("text")
      .classed("stateText", true)
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("dy", 5);
  
    // Event handling ===================
  
    xLabelsGroup.selectAll("text")
      .on("click", () => {
        handleOnClickLabel(d3.event.target, data, 'x', xlabels, xAxis, circlesGroup, abbrGroup);
      });
  
    yLabelsGroup.selectAll("text")
      .on("click", () => {
        handleOnClickLabel(d3.event.target, data, 'y', ylabels, yAxis, circlesGroup, abbrGroup);
      });
  }).catch(error => {
    console.log(error);
  });