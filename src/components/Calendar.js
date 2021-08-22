import * as d3 from "d3";
import React, { Component } from "react";
import axios from "axios";
import * as colorbrewer from "colorbrewer";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.data = [];
  }

  async componentDidMount() {
    let response = await axios("https://github-contribution-api.herokuapp.com/commits/elephantcastle",);
    const data = response.data.contributions.map(contribution => {
      const newContribution = {}
      newContribution["date"] = new Date(contribution.date)
      newContribution["count"] = Number(contribution.count)
      newContribution["intensity"] = Number(contribution.intensity)
      return newContribution
    })
    this.setState({ data: data }, () => { this.drawBoxplot() });
  }

  drawBoxplot() {
    d3.select("#calendar svg").remove();
    const years = d3.groups(this.state.data, d => d.date.getUTCFullYear()).reverse()

    let headerDiv = document.getElementsByClassName("header");
    let widthDiv = window.innerWidth;
    let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

    const margin = { top: 30, right: 90, bottom: 30, left: 90 };
    const width = (widthDiv || 600) - margin.left - margin.right;
    const height = (heightDiv || 300) - margin.top - margin.bottom;
    const cellSize = 20
    const countDay = i => (i + 6) % 7
    const formatDay = i => "SMTWTFS"[i]
    const formatDate = d3.timeFormat("%d %B %Y")
    const formatMonth = d3.utcFormat("%b")
    const timeWeek = d3.utcMonday
    const colourPalette = (colorbrewer.default.Oranges[9] + "," + colorbrewer.default.Reds[9]).split(",")
    const color = d3.scaleQuantize().domain(d3.extent(this.state.data, d => d.count)).range(colourPalette)
    const pathMonth = (t) => {
      const n = 7;
      const d = Math.max(0, Math.min(n, countDay(t.getUTCDay())));
      const w = timeWeek.count(d3.utcYear(t), t);
      return `${d === 0 ? `M${w * cellSize},0`
        : d === n ? `M${(w + 1) * cellSize},0`
          : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${n * cellSize}`;
    }
    // setup the canvas
    const svg = d3
      .select("#calendar")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // attach each single year group
    const year = svg.selectAll("g")
      .data(years)
      .join("g")
      .attr("transform", (d, i) => `translate(40.5,${cellSize * 10 * i + cellSize * 2})`);

    // year text
    year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key);

    // day of the week text
    year.append("g")
      .attr("text-anchor", "end")
      .selectAll("text")
      .data(d3.range(7))
      .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

    // attach each contribution based on length of week, colour based on commits
    year.append("g")
      .selectAll("rect")
      .data(([, values]) => values)
      .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date.getUTCDay()) * cellSize + 0.5)
      .attr("fill", d => color(d.count))
      .append("title")
      .text(d => `day: ${formatDate(d.date)} - commits: ${d.count}`)

    const month = year.append("g")
      .selectAll("g")
      .data(([, values]) => d3.utcMonths(d3.utcMonth(values[0].date), values[values.length - 1].date))
      .join("g");

    // add month line divider
    month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", pathMonth);

    // add month descrition on top
    month.append("text")
      .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

  }
  render() {
    return (
      <div>
        <div className="chart-header">Github Commit frequency for the past year</div>
        <div id="calendar"></div>
      </div>)
  }
}

export default Calendar;
