import * as d3 from "d3";
import React, { Component } from "react";
import countries from "./../dataset/worlddata.json";
import * as d3geoprojection from "d3-geo-projection";
import * as colorbrewer from "colorbrewer";
class Mapchart extends Component {
  async componentDidMount() {
    this.drawMapchart();
    window.addEventListener("resize", this.drawMapchart);
  }

  componentDidUpdate() {
    this.drawMapchart();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawMapchart);
  }

  drawMapchart() {
    d3.select("#mapchart svg").remove();

    let headerDiv = document.getElementsByClassName("header");
    let widthDiv = window.innerWidth - 200;
    let heightDiv = window.innerHeight - headerDiv[0].clientHeight;

    const margin = { top: 20, right: 50, bottom: 20, left: 50 };
    const width = (widthDiv || 800) - margin.left - margin.right;
    const height = (heightDiv || 800) - margin.top - margin.bottom;

    // setup the canvas
    d3.select("#mapchart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(0,0)");

    //setup the projection type, scale, positioning and using geoPath to obtain a path to be plot it on canvas
    let projection = d3geoprojection
      .geoMollweide()
      .scale((250 * height * width) / (1340 * 756))
      .translate([width / 2 + margin.left, height / 2]);
    let geoPath = d3.geoPath().pointRadius(5).projection(projection);

    let featureSize = d3.extent(countries.features, (d) => geoPath.area(d));
    let countryColor = d3
      .scaleQuantize()
      .domain(featureSize)
      .range(colorbrewer.default.Reds[7]);

    d3.select("svg")
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("class", "countries")
      .style("fill", (d) => countryColor(geoPath.area(d)))
      .style("stroke", (d) => d3.rgb(countryColor(geoPath.area(d))).darker());

    // add graticule
    const graticule = d3.geoGraticule();
    d3.select("svg")
      .insert("path", "path.countries")
      .datum(graticule)
      .attr("class", "graticule line")
      .attr("d", geoPath)
      .style("fill", "transparent")
      .style("stroke", "black")
      .attr("stroke-width", 0.1);

    d3.select("svg")
      .insert("path", "path.countries")
      .datum(graticule.outline)
      .attr("class", "graticule outline")
      .attr("d", geoPath)
      .style("fill", "transparent")
      .style("stroke", "black")
      .attr("stroke-width", 0.2);

    // paint a rectangles on mouseover a country
    d3.selectAll("path.countries")
      .on("mouseover", centerBounds)
      .on("mouseout", clearCenterBounds);

    function centerBounds(e, d) {
      let thisBounds = geoPath.bounds(d);
      let thisCenter = geoPath.centroid(d);

      d3.select("svg")
        .append("rect")
        .attr("class", "bbox")
        .attr("x", thisBounds[0][0])
        .attr("y", thisBounds[0][1])
        .attr("width", thisBounds[1][0] - thisBounds[0][0])
        .attr("height", thisBounds[1][1] - thisBounds[0][1])
        .style("fill", "none")
        .style("stroke", "#333")
        .style("stroke-dasharray", "2,1");

      d3.select("svg")
        .append("circle")
        .attr("class", "centroid")
        .attr("r", 5)
        .attr("cx", thisCenter[0])
        .attr("cy", thisCenter[1]);
    }

    function clearCenterBounds() {
      d3.selectAll("circle.centroid").remove();
      d3.selectAll("rect.bbox").remove();
    }

    // setup zoom
    let mapZoom = d3.zoom().on("zoom", zoomed);
    let zoomSettings = d3.zoomIdentity
      .translate(width / 2 + margin.left, height / 2)
      .scale((250 * height * width) / (1340 * 756));
    d3.select("svg").call(mapZoom).call(mapZoom.transform, zoomSettings);
    function zoomed(event) {
      let e = event;
      projection.translate([e.transform.x, e.transform.y]).scale(e.transform.k);
      d3.selectAll("path.countries").attr("d", geoPath);
      d3.selectAll("path.graticule").attr("d", geoPath);
    }
  }
  render() {
    return (
      <div>
        <div id="mapchart"></div>
      </div>
    );
  }
}

export default Mapchart;
