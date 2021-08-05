import * as d3 from "d3";
import React, { Component } from "react";

class GroupedAndStackedChart extends Component {
  componentDidMount() {
    this.drawGroupedAndStackedChart();
    window.addEventListener("resize", this.drawGroupedAndStackedChart);
  }

  componentDidUpdate() {
    this.drawGroupedAndStackedChart();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawGroupedAndStackedChart);
  }

  async drawGroupedAndStackedChart() {
    let data = await d3.csv(
      "https://raw.githubusercontent.com/elephantcastle/graphs-react-d3/master/src/dataset/groupedstacked.csv",
      // format the date and values to have the right format
      function (d) {
        return {
          "Under 5 Years": Number(d["Under 5 Years"]),
          "5 to 13 Years": Number(d["5 to 13 Years"]),
          "14 to 17 Years": Number(d["14 to 17 Years"]),
          "18 to 24 Years": Number(d["18 to 24 Years"]),
          "25 to 44 Years": Number(d["25 to 44 Years"]),
          "45 to 64 Years": Number(d["45 to 64 Years"]),
          "65 Years and Over": Number(d["65 Years and Over"]),
          State: d.State,
        };
      }
    );

    const redraw = (dataset) => {
      d3.select("#groupedandstackedchart svg").remove();

      let headerDiv = document.getElementsByClassName("header");
      let widthDiv = window.innerWidth;
      let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

      const margin = { top: 30, right: 90, bottom: 30, left: 90 };
      const width = (widthDiv || 600) - margin.left - margin.right;
      const height = (heightDiv || 300) - margin.top - margin.bottom;

      // setup the canvas
      const svg = d3
        .select("#groupedandstackedchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // constants setup: different age categories, states, a map of colours to differentiate the ages
      const ageBands = dataset.columns.filter((k) => k !== "State");
      const states = dataset.map(function (d) {
        return d.State;
      });
      const color = d3
        .scaleOrdinal()
        .range([
          "#98abc5",
          "#8a89a6",
          "#7b6888",
          "#6b486b",
          "#a05d56",
          "#d0743c",
          "#ff8c00",
        ]);
      // create a scale for each state and append axis
      const xScaleStates = d3
        .scaleBand()
        .range([0, width])
        .domain(states)
        .padding(0.3);

      // create a scale for each category within the state
      const xScaleageBands = d3
        .scaleBand()
        .domain(ageBands)
        .rangeRound([0, xScaleStates.bandwidth()])
        .padding(0.05);

      //append x axis
      const xAxis = d3.axisBottom().scale(xScaleStates);
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
        .text("State");

      //create y scale
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d3.max(ageBands, (key) => d[key]))])
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
        .text("Population");

      // remove domains from axes
      d3.select(".axis.axis--x").select(".domain").remove();
      d3.select(".axis.axis--y").select(".domain").remove();

      // Create Bars
      svg
        .selectAll("mybar")
        .data(dataset)
        .enter()
        .append("g") //create a group for each state
        .attr("transform", function (d) {
          return "translate(" + xScaleStates(d.State) + ",0)";
        }) //translate the group based on the stateScale
        .selectAll("rect")
        .data(function (d) {
          return ageBands.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .join("rect")
        .attr("x", (d) => xScaleageBands(d.key))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScaleageBands.bandwidth())
        .attr("height", (d) => yScale(0) - yScale(d.value))
        .attr("fill", (d) => color(d.key));
    };
    redraw(data);
  }
  render() {
    return <div id="groupedandstackedchart"></div>;
  }
}

export default GroupedAndStackedChart;
