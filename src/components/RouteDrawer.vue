<template>
  <div class="root container-fluid">
    <div class="row">
      <div class="col-sm-3 left-panel">
        <div class="route_selection">
          
        </div>
      </div>
      <div class="col-sm-9 right-panel">
        <div class="row route-plot">
          <svg>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as punchcard from 'd3-punchcard/dist/d3-punchcard.min.js'

export default {
  name: 'route-drawer',
  data() {
    return {
      ROAD: [],
      ROUTES_DISTANCE: {},
      GATE: [],
      ROUTES: []
    }
  },
  mounted() {
    this.initialize()
    var that = this;

    d3.queue()
      .defer(d3.json, "static/data/point_list.json")
      .defer(d3.json, "static/data/route_distance_dict.json")
      .defer(d3.csv, "static/data/sensor_position_1.csv")
      .defer(d3.json, "static/data/routes.json")
      .await(load_data)

    function load_data(error, road, routes_distance, gate, routes) {
      if (error) {console.error(error);}

      that.ROAD = road;
      that.drawRoad()

      that.ROUTES_DISTANCE = routes_distance

      that.GATE = gate
      that.drawGate()

      that.ROUTES = routes
      console.log(routes[0]);
      that.drawRoutes([routes[0], routes[1], routes[2], routes[3]])
    }
  },
  methods: {
    initialize() {
      var width = 500,
          height = 500;

      var root = d3.select(".route-plot")
      this.svg = root.select("svg")
        .attr("width", width)
        .attr("height", height);

      this.x_scale = d3.scaleLinear()
        .domain([0, 200])
        .range([0, width])
      this.y_scale = d3.scaleLinear()
        .domain([0, 200])
        .range([height, 0])

      this.setupMarker()
    },

    setupMarker() {
      this.svg.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 100)
        .attr("markerHeight", 100)
        .attr("markerUnits","userSpaceOnUse")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", "red");
    },

    drawRoad() {
      var road = this.svg.selectAll(".road")
        .data(["road"])
        .enter().append("g")
        .attr("class", "road")

      road.selectAll("circle")
        .data(this.ROAD)
        .enter().append("circle")
        .style("fill", "lightgrey")
        .style("opacity", "0.3")
        .attr("r", 2)
        .attr("cx", d => this.x_scale(d[0]))
        .attr("cy", d => this.y_scale(d[1]));
    },

    drawGate() {
      var gate = this.svg.selectAll(".gate")
        .data(["gate"])
        .enter().append("g")
        .attr("class", "gate")

      var group = gate.selectAll(".gate-group")
        .data(this.GATE)
        .enter()
        .append("g")
        .attr("class", "gate-group")

      group.append("circle")
        .style("fill", "blue")
        .attr("r", 3)
        .attr("cx", d => this.x_scale(d.x))
        .attr("cy", d => this.y_scale(d.y))

      group.append("text")
        .attr("x", d => this.x_scale(d.x))
        .attr("y", d => this.y_scale(d.y))
        .text(d => d["gate-name"])
        .attr("text-anchor", "middle")
    },

    drawRoutePath(from_position, to_position) {
      var data = this.ROUTES_DISTANCE[from_position][to_position].break_points
      var svg = this.svg

      var valueline = d3.line()
        .x(d => this.x_scale(d[0]))
        .y(d => this.y_scale(d[1]))
/*
      var path = this.svg.selectAll(".route-path")
        .data(["route-path"])
        .enter().append("g")
        .attr("class", "route-path")

      // path
      path.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d",valueline)
        .attr("marker-end", "url(#triangle)")
        .attr("stroke", "grey")
        .attr("stroke-width", "1.5")
        .attr("fill", "transparent")
*/
      var path = this.svg.selectAll(".route-path")
        .data([data])
        .enter().append("g")
        .attr("class", "route-path")

      // path
      path.append("path")
        .datum(d => {console.log(d);return d})
        .attr("class", "line")
        .attr("d",valueline)
        .attr("marker-end", "url(#triangle)")
        .attr("stroke", "grey")
        .attr("stroke-width", "1.5")
        .attr("fill", "transparent")
    },

    //routes should be a list of routes
    //route should be a list of gate-names that the route pass
    drawRoutes(route_list) {

      //handleing the data to generate route path
      for (var i = 0; i < route_list.length; i ++) {
        route_list[i].paths = []
        for (var j = 0; j < route_list[i].records.length - 1; j ++) {
          route_list[i].paths.push([route_list[i].records[j], route_list[i].records[j+1]])
        }
      }

      var svg = this.svg

      //callback funtion for the line
      var valueline = d3.line()
        .x(d => {return this.x_scale(d[0])})
        .y(d => this.y_scale(d[1]))

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      /*
      DOM Structure:
        routes - route-group - paths - path
      */

      var routes = svg.selectAll(".routes")
        .data([route_list])
        .enter().append("g")
        .attr("class", "routes")

      var route_group = routes.selectAll(".route-group")
        .data(d => d)
        .enter().append("g")
        .attr("class", "route-group")
        .attr("stroke", (d, i) => color(i))
        .style("opacity", 0.3)

      var paths = route_group.selectAll(".paths")
        .data(d => [d.paths])
        .enter().append("g")
        .attr("class", "paths")

      var path = paths.selectAll(".path")
        .data(d => d)
        .enter().append("path")
        .attr("class", "path")

      path.datum(d => this.ROUTES_DISTANCE[d[0]][d[1]].break_points)
        .attr("d",valueline)
        .attr("marker-end", "url(#triangle)")
        .attr("stroke-width", "1.5")
        .attr("fill", "transparent")

      //set lisiener for hovering
      route_group.on("mouseover", function(d, i) {
        d3.select(this).style("opacity", 1)
      }).on("mouseout", function(d, i) {
        d3.select(this).style("opacity", 0.3)
      })
    }
  }

}
</script>

<style> /* set the CSS */
.path {
  fill: none;
  stroke-width: 5px
}

.gate-group text {
  font-size: 7px;
}
</style>
