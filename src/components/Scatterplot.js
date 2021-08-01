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
      let widthDiv = window.innerWidth;
      let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

      const margin = { top: 30, right: 60, bottom: 30, left: 60 };
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

      // create scales and append axis
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[0])])
        .range([0, width]);
      //append x axis
      svg
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text("x coordinate");

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([height, 0]);
      //append y axis
      svg
        .append("g")
        .attr("class", "axis axis--y")
        .attr("transform", `translate(0,0)`)
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("y coordinate");

      // draw points in the center
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "#69b3a2")
        .attr("class", "circles")
        .attr("r", () => 5);

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
    };
    redraw();
    window.addEventListener("resize", redraw);
  }
  render() {
    return <div id="scatterplot"></div>;
  }
}

export default Scatterplot;
