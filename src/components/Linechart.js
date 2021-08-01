import * as d3 from "d3";
import React, { Component } from "react";

class Linechart extends Component {
  async componentDidMount() {
    this.drawLinechart();
  }

  componentDidUpdate() {
    this.drawLinechart();
  }

  async drawLinechart() {
    try {
      let dataset = await d3.csv(
        "https://raw.githubusercontent.com/elephantcastle/graphs-react-d3/master/src/dataset/linechart.csv",
        // format the date and values to have the right format
        function (d) {
          return {
            date: d3.timeParse("%Y-%m-%d")(d.date),
            value: Number(d.value),
          };
        }
      );
      const redraw = () => {
        d3.select("#linechart svg").remove();

        let headerDiv = document.getElementsByClassName("header");
        let widthDiv = window.innerWidth;
        let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = (widthDiv || 800) - margin.left - margin.right;
        const height = (heightDiv || 800) - margin.top - margin.bottom;

        // setup the canvas
        const svg = d3
          .select("#linechart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // create scales and append axis
        const xScale = d3
          .scaleTime()
          .domain(
            d3.extent(dataset, function (d) {
              return d.date;
            })
          )
          .range([0, width]);
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
          .text("time");

        const yScale = d3
          .scaleLinear()
          .domain(
            d3.extent(dataset, function (d) {
              return d.value;
            })
          )
          .range([height, 0]);
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
          .text("value");

        // create the line
        const lineGenerator = d3
          .line()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.value))
          .curve(d3.curveBasis);

        svg
          .append("path")
          .attr("d", lineGenerator(dataset))
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "Red")
          .attr("stroke-width", 2);

        // add a dot for each points that contributes to the line
        svg
          .selectAll(".dot")
          .data(dataset)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", function (d, i) {
            return xScale(d.date);
          })
          .attr("cy", function (d) {
            return yScale(d.value);
          })
          .attr("r", 1);
      };

      redraw();
      window.addEventListener("resize", redraw);
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    return <div id="linechart"></div>;
  }
}

export default Linechart;
