import * as d3 from "d3";
import React, { Component } from "react";

class Boxplot extends Component {
  componentDidMount() {
    this.drawBoxplot();
    window.addEventListener("resize", this.drawBoxplot);
  }

  componentDidUpdate() {
    this.drawBoxplot();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawBoxplot);
  }

  async drawBoxplot() {
    let data = await d3.csv(
      "https://raw.githubusercontent.com/elephantcastle/graphs-react-d3/master/src/dataset/boxplot.csv",
      // format the date and values to have the right format
      function (d) {
        return {
          day: Number(d.day),
          min: Number(d.min),
          max: Number(d.max),
          median: Number(d.median),
          q1: Number(d.q1),
          q3: Number(d.q3),
          number: Number(d.number),
        };
      }
    );

    const redraw = (dataset) => {
      d3.select("#boxplot svg").remove();

      let headerDiv = document.getElementsByClassName("header");
      let widthDiv = window.innerWidth;
      let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

      const margin = { top: 30, right: 90, bottom: 30, left: 90 };
      const width = (widthDiv || 600) - margin.left - margin.right;
      const height = (heightDiv || 300) - margin.top - margin.bottom;

      const wiskerWidth = 20;

      // setup the canvas
      const svg = d3
        .select("#boxplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // create scales and append axis
      const xScale = d3.scaleLinear().domain([0, 8]).range([0, width]);

      //append x axis
      const xAxis = d3
        .axisBottom()
        .scale(xScale)
        .tickSize(-height)
        .tickValues([1, 2, 3, 4, 5, 6, 7]);
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
        .text("Day");
      // remove last nasty vertical bar
      d3.select(".axis.axis--x").select("path").attr("d", `M0,-390V0H${width}`);

      const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

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
        .text("Percentile");

      // draw g boxes
      d3.select("svg")
        .selectAll("g.box")
        .data(dataset)
        .enter()
        .append("g")
        .attr("class", "box")
        .attr("transform", (d) => {
          return (
            "translate(" +
            (margin.left + xScale(d.day)) +
            "," +
            yScale(d.median) +
            ")"
          );
        })
        // draw wisker for each box(relative coordinates to it)
        .each(function (d, i) {
          // median line
          d3.select(this)
            .append("line")
            .attr("class", "max")
            .attr("x1", -wiskerWidth / 2)
            .attr("x2", wiskerWidth / 2)
            .attr("y1", yScale(d.max) - yScale(d.median))
            .attr("y2", yScale(d.max) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "4px");
          // box between q1 and q3
          d3.select(this)
            .append("rect")
            .attr("class", "range")
            .attr("width", wiskerWidth)
            .attr("x", -wiskerWidth / 2)
            .attr("y", yScale(d.q3) - yScale(d.median))
            .attr("height", yScale(d.q1) - yScale(d.q3))
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", "2px");
          // min and max lines
          d3.select(this)
            .append("line")
            .attr("class", "min")
            .attr("x1", -wiskerWidth / 2)
            .attr("x2", wiskerWidth / 2)
            .attr("y1", yScale(d.min) - yScale(d.median))
            .attr("y2", yScale(d.min) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "4px");
          d3.select(this)
            .append("line")
            .attr("x1", -wiskerWidth / 2)
            .attr("x2", wiskerWidth / 2)
            .attr("y1", 0)
            .attr("y2", 0)
            .style("stroke", "darkgray")
            .style("stroke-width", "4px");
          // vertical lines
          d3.select(this)
            .append("line")
            .attr("x1", 0)
            .attr("y1", yScale(d.max) - yScale(d.median))
            .attr("x2", 0)
            .attr("y2", yScale(d.q3) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "3px");
          d3.select(this)
            .append("line")
            .attr("x1", 0)
            .attr("y1", yScale(d.min) - yScale(d.median))
            .attr("x2", 0)
            .attr("y2", yScale(d.q1) - yScale(d.median))
            .style("stroke", "black")
            .style("stroke-width", "3px");
        });
    };
    redraw(data);
  }
  render() {
    return <div id="boxplot"></div>;
  }
}

export default Boxplot;
