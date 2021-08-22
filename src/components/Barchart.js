import * as d3 from "d3";
import React, { Component } from "react";

class Barchart extends Component {
  componentDidMount() {
    this.drawBarchart();
    window.addEventListener("resize", this.drawBarchart);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawBarchart);
  }

  async drawBarchart() {
    let data = await d3.csv(
      "https://raw.githubusercontent.com/elephantcastle/graphs-react-d3/master/src/dataset/barchart.csv",
      // format the date and values to have the right format
      function (d) {
        return {
          Country: d.Country,
          Value: Number(d.Value),
        };
      }
    );

    const redraw = (dataset) => {
      d3.select("#barchart svg").remove();

      let headerDiv = document.getElementsByClassName("header");
      let widthDiv = window.innerWidth;
      let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

      const margin = { top: 30, right: 90, bottom: 30, left: 90 };
      const width = (widthDiv || 600) - margin.left - margin.right;
      const height = (heightDiv || 300) - margin.top - margin.bottom;

      // setup the canvas
      const svg = d3
        .select("#barchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // create scales and append axis
      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(
          dataset.map(function (d) {
            return d.Country;
          })
        )
        .padding(0.3);

      //append x axis
      svg
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width + 20)
        .attr("dy", "-0.71em")
        .attr("text-anchor", "end")
        .text("Country");

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d.Value)])
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

      // Bars
      svg
        .selectAll("mybar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return xScale(d.Country);
        })
        .attr("y", yScale(0))
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
          return height - yScale(0);
        })
        .attr("fill", "#69b3a2")
        .transition()
        .duration(2000)
        .attr("height", function (d) {
          return height - yScale(d.Value);
        })
        .attr("y", function (d) {
          return yScale(d.Value);
        });
    };
    redraw(data);
  }
  render() {
    return <div id="barchart"></div>;
  }
}

export default Barchart;
