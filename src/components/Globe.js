import * as d3 from "d3";
import React, { Component } from "react";
import countries from "../dataset/worlddata.json";
import * as colorbrewer from "colorbrewer";
class Globe extends Component {
  constructor(props) {
    super(props);
    this.coordinates = [];
  }
  async componentDidMount() {
    this.drawGlobe();
    window.addEventListener("resize", this.drawGlobe);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawGlobe);
  }

  drawGlobe() {
    d3.select("#globe svg").remove();

    let headerDiv = document.getElementsByClassName("header");
    let widthDiv = window.innerWidth - 200;
    let heightDiv = window.innerHeight - headerDiv[0].clientHeight - 10;

    const margin = { top: 20, right: 50, bottom: 20, left: 50 };
    const width = (widthDiv || 800) - margin.left - margin.right;
    const height = (heightDiv || 800) - margin.top - margin.bottom;

    // setup the canvas
    d3.select("#globe")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(0,0)");

    //setup the projection type, scale, positioning and using geoPath to obtain a path to be plot it on canvas
    let projection = d3
      .geoOrthographic()
      .scale((400 * height * width) / (1340 * 756))
      .translate([width / 2 + margin.left, height / 2]);
    let geoPath = d3.geoPath().pointRadius(5).projection(projection);

    d3.select("svg")
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("class", "countries");

    let featureData = d3.selectAll("path.countries").data();
    let realFeatureSize = d3.extent(featureData, (d) => d3.geoArea(d));
    let newFeatureColor = d3
      .scaleQuantize()
      .domain(realFeatureSize)
      .range(colorbrewer.default.Reds[7]);
    d3.selectAll("path.countries")
      .style("fill", (d) => newFeatureColor(d3.geoArea(d)))
      .style("stroke", (d) => d3.rgb(newFeatureColor(d)).darker());

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
    let zoomSettings = d3.zoomIdentity.translate(0, 0).scale(200);
    let rotateScale = d3
      .scaleLinear()
      .domain([-500, 0, 500])
      .range([-180, 0, 180]);
    d3.select("svg").call(mapZoom).call(mapZoom.transform, zoomSettings);
    function zoomed(e) {
      //   if mouse is dragged rotate the globe otherwise zoom on wheel
      if (e?.sourceEvent?.type === "mousemove") {
        let currentRotate = rotateScale(e.transform.x) % 360;

        projection.rotate([currentRotate, 0]).scale(e.transform.k);
        d3.selectAll("path.graticule").attr("d", geoPath);
        d3.selectAll("path.countries").attr("d", geoPath);
      } else if (e?.sourceEvent?.type === "wheel") {
        projection.translate(projection.translate()).scale(e.transform.k);
        d3.selectAll("path.countries").attr("d", geoPath);
        d3.selectAll("path.graticule").attr("d", geoPath);
      }
    }
  }
  render() {
    return (
      <div>
        <div id="globe"></div>
      </div>
    );
  }
}

export default Globe;
