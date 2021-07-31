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

  drawScatterplot(dataset) {
    const w = 500;
    const h = 500;
    const padding = 60;

    // setup the canvas
    const svg = d3
      .select("#scatterplot")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[0])])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .range([h - padding, padding]);

    // create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // draw points
    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", (d) => 5);

    // draw text labels
    svg
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text((d) => d[0] + "," + d[1])
      .attr("x", (d) => xScale(d[0] + 10))
      .attr("y", (d) => yScale(d[1]));

    // append the axes
    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", "translate(0" + padding + ",0)")
      .call(yAxis);
  }
  render() {
    return <div id="scatterplot"></div>;
  }
}

export default Scatterplot;
