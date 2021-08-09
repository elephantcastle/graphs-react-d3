import * as d3 from "d3";
import React, { Component } from "react";

class Scatterplot extends Component {
  constructor(props) {
    super(props);
    this.dataset = [
      [34, 78],
      [109, 280],
      [310, 120],
      [79, 411],
      [420, 220],
      [233, 145],
      [333, 96],
      [222, 333],
      [78, 320],
      [21, 123],
    ];
  }
  componentDidMount() {
    this.drawScatterplot(this.dataset);
  }

  componentDidUpdate() {
    this.drawScatterplot(this.dataset);
  }

  drawScatterplot(data) {
    const redraw = () => {
      d3.select("#scatterplot svg").remove();

      let headerDiv = document.getElementsByClassName("header");
      let controlsDiv = document.getElementsByClassName("controls-scatterplot");

      let widthDiv = window.innerWidth;
      let heightDiv =
        window.innerHeight -
        headerDiv[0].clientHeight -
        controlsDiv[0].clientHeight -
        30;

      const margin = { top: 40, right: 90, bottom: 40, left: 90 };
      const width = (widthDiv || 800) - margin.left - margin.right;
      const height = (heightDiv || 800) - margin.top - margin.bottom;

      // setup the canvas
      const svg = d3
        .select("#scatterplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // create scales
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[0])])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([height, 0]);

      let brush = d3
        .brush()
        .extent([
          [-margin.left - margin.right, -margin.top - margin.bottom],
          [
            width + margin.left + margin.right,
            margin.top + margin.bottom + height,
          ],
        ])
        .on("end", brushended);

      let idleTimeout;
      let idleDelay = 350;

      // create axis
      let xAxis = d3.axisBottom(xScale);
      let yAxis = d3.axisLeft(yScale);

      // apppend x axis
      svg
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("x", width)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text("x coordinate");

      // apppend y axis
      svg
        .append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("y coordinate");
      // Add a clipPath: everything out of this area won't be drawn.
      svg
        .append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("x", 0)
        .attr("y", -margin.top - margin.bottom);
      // draw points in the center
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("clip-path", "url(#clip)")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "#69b3a2")
        .attr("class", "circles")
        .attr("r", () => 5);

      svg.append("g").attr("class", "brush").call(brush);

      function brushended(event) {
        let s = event.selection;
        // If no selection, back to initial coordinate. Otherwise, update X, Y axis domain and call zoom
        if (!s) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, idleDelay));
          xScale.domain([0, d3.max(data, (d) => d[0])]);
          yScale.domain([0, d3.max(data, (d) => d[1])]);
        } else {
          xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale));
          yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale));
          svg.select(".brush").call(brush.move, null);
        }
        zoom();
      }
      function zoom() {
        let t = svg.transition().duration(750);
        svg.select(".axis--x").transition(t).call(xAxis);
        svg.select(".axis--y").transition(t).call(yAxis);
        svg
          .selectAll("circle")
          .transition(t)
          .attr("cx", function (d) {
            return xScale(d[0]);
          })
          .attr("cy", function (d) {
            return yScale(d[1]);
          });

        // draw text labels
        svg
          .selectAll(".label-text")
          .transition(t)
          .delay(function (d, i) {
            return i * 125;
          })
          .attr("clip-path", "url(#clip)")
          .text((d) => d[0] + "," + d[1])
          .attr("x", (d) => xScale(d[0]))
          .attr("y", (d) => yScale(d[1]) - 10);
      }
      function idled() {
        idleTimeout = null;
      }
      // Animation: put them down one by one:
      function triggerTransitionDelay() {
        // update points to right position
        d3.selectAll("circle")
          .data(data)
          .transition()
          .duration(500)
          .attr("cx", (d, i) => xScale(data[i][0]))
          .attr("cy", (d, i) => yScale(data[i][1]))
          .attr("r", () => 5)
          .delay(function (d, i) {
            return i * 125;
          });

        // draw text labels
        svg
          .append("g")
          .selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "label-text")
          .transition()
          .duration(500)
          .delay(function (d, i) {
            return i * 125;
          })
          .text((d) => d[0] + "," + d[1])
          .attr("x", (d) => xScale(d[0]))
          .attr("y", (d) => yScale(d[1]) - 10);
      }
      setTimeout(triggerTransitionDelay, 500);

      d3.select("#reset").on("click", function () {
        // reset brush to initial state
        xScale.domain([0, d3.max(data, (d) => d[0])]);
        yScale.domain([0, d3.max(data, (d) => d[1])]);
        svg.select(".brush").call(brush.move, null);
        zoom();
      });
    };
    redraw();
    window.addEventListener("resize", redraw);
  }
  render() {
    return (
      <div>
        <div className="controls-scatterplot">
          Drag the mouse to zoom on a selection{" "}
          <button id="reset">Reset Zoom</button>
        </div>
        <div id="scatterplot"></div>);
      </div>
    );
  }
}

export default Scatterplot;
