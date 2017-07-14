<template>
    <div class="root">
      <div class="route-plot-small">
        <svg>
        </svg>
      </div>
      <!--
      <div class="row car-ids">
        <div v-for="route in routes">
          <p v-for="travel in route.travels">
            {{travel.car_id}}  {{travel.records[0].time.toUTCString()}}
          </p>
        </div>
      </div>
      -->
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'route-drawer-small',
  props: {
    records: {
      type: Array,
      default: []
    },
    color: {
      type: String
    }
  },
  watch: {
    records: function(newVal, oldVal) {
      this.drawRoutes([{
        records: newVal
      }])
    }
  },
  data() {
    return {
      ROAD: [],
      ROUTES_DISTANCE: {},
      GATE: [],
    }
  },
  mounted() {
    this.initialize()
    var that = this;

    d3.queue()
      .defer(d3.json, "static/data/point_list.json")
      .defer(d3.json, "static/data/route_distance_dict.json")
      .defer(d3.csv, "static/data/sensor_position_1.csv")
      .await(load_data)

    function load_data(error, road, routes_distance, gate) {
      if (error) {console.error(error);}

      that.ROAD = road;
      that.drawRoad()

      that.ROUTES_DISTANCE = routes_distance

      that.GATE = gate
      that.drawGate()

      that.drawRoutes([{
        records: that.records
      }])

      //that.ROUTES = routes
      //console.log(patterns);
      //that.drawRoutes([routes[0], routes[1], routes[2], routes[3]])
    }
  },
  methods: {
    initialize() {
      var width = 300,
          height = 300;

      var root = d3.select(".route-plot-small")
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
        .style("opacity", "0.7")
        .attr("r", 1)
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
        .attr("r", 2)
        .attr("cx", d => this.x_scale(d.x))
        .attr("cy", d => this.y_scale(d.y))
        /*
      group.append("text")
        .attr("x", d => this.x_scale(d.x))
        .attr("y", d => this.y_scale(d.y))
        .text(d => d["gate-name"])
        .attr("text-anchor", "middle")
        */
    },

    drawRoutePath(from_position, to_position) {
      var data = this.ROUTES_DISTANCE[from_position][to_position].break_points
      var svg = this.svg

      var valueline = d3.line()
        .x(d => this.x_scale(d[0]))
        .y(d => this.y_scale(d[1]))

      var path = this.svg.selectAll(".route-path")
        .data([data])
        .enter().append("g")
        .attr("class", "route-path")

      // path
      path.append("path")
        .datum(d => d)
        .attr("class", "line")
        .attr("d",valueline)
        .attr("marker-end", "url(#triangle)")
        .attr("stroke", "grey")
        .attr("stroke-width", "1")
        .attr("fill", "transparent")
    },

    //routes should be a list of routes
    //route should be a list of gate-names that the route pass
    drawRoutes(route_list) {
      //var route_list = this.routes
      //console.log("drawing:", route_list);
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

      routes.exit().remove()
      var routes_m = routes.enter().append("g")
        .merge(routes).attr("class", "routes")

      var route_group = routes_m.selectAll(".route-group")
        .data(d => d)

      route_group.exit().remove()
      var route_group_m = route_group.enter().append("g")
        .merge(route_group).attr("stroke", this.color)
        .attr("class", "route-group")
        .style("opacity", 1)

      var paths = route_group_m.selectAll(".paths")
        .data(d => {
          //console.log([d.paths]);
          return [d.paths]
        })

      paths.exit().remove()
      var paths_m = paths.enter().append("g")
        .merge(paths).attr("class", "paths")

      var path = paths_m.selectAll(".path")
        .data(d => d)

      path.exit().remove()
      var path_m = path.enter().append("path")
        .merge(path).attr("class", "path")

      //console.log(this.ROUTES_DISTANCE);
      path_m.datum(d => {
        var route = this.ROUTES_DISTANCE[d[0]][d[1]]
        if (route) {
          return route.break_points
        }else {
          var index_1 = this.GATE.findIndex(g => g["gate-name"] == d[0])
          var index_2 = this.GATE.findIndex(g => g["gate-name"] == d[1])
          var point_1 = [this.GATE[index_1].x, this.GATE[index_1].y]
          var point_2 = [this.GATE[index_2].x, this.GATE[index_2].y]
          return [point_1, point_2];
        }
        })
        .attr("d",valueline)
        .attr("marker-end", "url(#triangle)")
        .attr("stroke-width", "1")
        .attr("fill", "transparent")
    }
  }
}
</script>

<style> /* set the CSS */
.path {
  fill: none;
  stroke-width: 7px
}

.gate-group text {
  font-size: 7px;
}
</style>
