import * as d3 from "d3";
import React, { Component } from "react";

class ScatterplotZoom extends Component {
  componentDidMount() {
    this.drawScatterplotZoom(this.dataset);
  }

  async drawScatterplotZoom() {
    //Read the data
    const data = await d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
    );

    const redraw = (dataset) => {
      // set the dimensions and margins of the graph
      let headerDiv = document.getElementsByClassName("header");
      let widthDiv = window.innerWidth;
      let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

      const margin = { top: 30, right: 90, bottom: 30, left: 90 };
      const width = (widthDiv || 600) - margin.left - margin.right;
      const height = (heightDiv || 300) - margin.top - margin.bottom;

      // append the SVG object to the body of the page
      var SVG = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
      var x = d3.scaleLinear().domain([4, 8]).range([0, width]);
      var xAxis = SVG.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear().domain([0, 9]).range([height, 0]);
      var yAxis = SVG.append("g").call(d3.axisLeft(y));

      // Add a clipPath: everything out of this area won't be drawn.
      SVG.append("defs")
        .append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      // Create the scatter variable: where both the circles and the brush take place
      var scatter = SVG.append("g").attr("clip-path", "url(#clip)");

      // Add circles
      scatter
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.Sepal_Length);
        })
        .attr("cy", function (d) {
          return y(d.Petal_Length);
        })
        .attr("r", 8)
        .style("fill", "#61a3a9")
        .style("opacity", 0.5);

      // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
      var zoom = d3
        .zoom()
        .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", updateChart);

      // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
      const zoomRect = SVG.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
      // now the user can zoom and it will trigger the function called updateChart

      // A function that updates the chart when the user zoom and thus new boundaries are available
      function updateChart(event) {
        // recover the new scale
        var newX = event.transform.rescaleX(x);
        var newY = event.transform.rescaleY(y);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));

        // update circle position
        scatter
          .selectAll("circle")
          .attr("cx", function (d) {
            return newX(d.Sepal_Length);
          })
          .attr("cy", function (d) {
            return newY(d.Petal_Length);
          });
      }

      d3.selectAll("button").on("click", function (e) {
        if (e.target.value === "in") {
          zoom.scaleBy(zoomRect, 1.2);
        } else if (e.target.value === "out") {
          zoom.scaleBy(zoomRect, 0.8);
        } else if (e.target.value === "reset") {
          zoomRect.call(zoom.transform, d3.zoomIdentity);
        }
      });
    };

    redraw(data);
  }
  render() {
    return (
      <div>
        <div className="controls-mapchart">
          Select a projection type
          <button value="in"> zoom in </button>
          <button value="out"> zoom out </button>
          <button value="reset"> reset </button>
        </div>
        <div id="chart"></div>
      </div>
    );
  }
}

export default ScatterplotZoom;
