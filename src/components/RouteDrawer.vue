<template>
  <div class="root">
    <svg weight="500" height="500">
    </svg>
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
      GATE: []
    }
  },
  mounted() {
    this.initialize()
    var that = this;

    d3.json("static/data/point_list.json", function(d) {
      that.ROAD = d
      that.drawRoad()
    })

    d3.json("static/data/route_distance_dict.json", function(d) {
      that.ROUTES_DISTANCE = d
      that.drawRoutePath("camping1", "general-gate5")
    })

    d3.csv("static/data/sensor_position_1.csv", function(d) {
      that.GATE = d
      that.drawGate()
    })

    d3.json("static/data/routes.json", function(d) {
      console.log("Load routes finished");
      that.drawRoutes([d[0]])
    })
  },
  methods: {
    initialize() {
      var root = d3.select(".root")
      this.svg = root.select("svg")
        .style("width", 500)
        .style("height", 500);

      var weight = this.svg.attr("weight"),
          height = this.svg.attr("height")

      this.x_scale = d3.scaleLinear()
        .domain([0, 200])
        .range([0, weight])
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
        .attr("markerWidth", 50)
        .attr("markerHeight", 50)
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
        .style("fill", "grey")
        .style("opacity", "0.5")
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

      for (var i = 0; i < route_list.length; i ++) {
        route_list[i].paths = []
        for (var j = 0; j < route_list[i].records.length - 1; j ++) {
          route_list[i].paths.push([route_list[i].records[j], route_list[i].records[j+1]])
        }
      }

      var svg = this.svg

      var valueline = d3.line()
        .x(d => {console.log(d.revords);})
        .y(d => this.y_scale(d[1]))

      var routes = svg.selectAll(".routes")
        .data([route_list])
        .enter().append("g")
        .attr("class", "routes")

      var route_group = routes.selectAll(".route-group")
        .data(route_list)
        .enter().append("g")
        .attr("class", "route-group")

      route_group.append("g")
        .attr("class", "paths")
        .datum(d => d.paths)
        .enter().append("path")
        .attr("class", "line")
        .attr("x", d => {console.log(d);})
        .attr("d", valueline)
        .attr("marker-end", "url(#triangle)")
        .attr("stroke", "grey")
        .attr("stroke-width", "1.5")
        .attr("fill", "transparent")

    }
  }

}
</script>

<style> /* set the CSS */
.line {
  fill: none;
  stroke: red;
  stroke-width: 3px;
}

.gate-group text {
  font-size: 7px;
}
</style>
