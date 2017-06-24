<template>
  <div class="root">
    <svg weight="300" height="300">
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
      ROUTES_DISTANCE: {}
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
  },
  methods: {
    initialize() {
      var root = d3.select(".root")
      this.svg = root.select("svg")

      var weight = this.svg.attr("weight"),
          height = this.svg.attr("height")

      this.x_scale = d3.scaleLinear()
                      .domain([0, 200])
                      .range([0, weight])
      this.y_scale = d3.scaleLinear()
                      .domain([0, 200])
                      .range([height, 0])
    },
    drawRoad() {
      var road = this.svg.append("g")
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

    drawRoutePath(from_position, to_position) {
      var data = this.ROUTES_DISTANCE[from_position][to_position].break_points
      console.log(data);

      var valueline = d3.line()
          .x(d => this.x_scale(d[0]))
          .y(d => this.y_scale(d[1]))

      this.svg.append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", valueline)
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
</style>
