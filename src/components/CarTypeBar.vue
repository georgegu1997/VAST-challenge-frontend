<template>
  <div class="root">
    <svg width="200" height="250" id="stacked-bar">
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: "car-type-bar",
  props: {
    routes: {
      type: Array,
      default: []
    },
    types: {
      type: Array
    },
    car_type_color_set: {
      type: Object
    },
    car_type_concerned: {
      type: Array
    },
    hover_route: {
      type: Object,
      default: null,
    },
    staying_time_range: {
      type: Array
    }
  },
  watch: {
    routes: function(newVal, oldVal) {
      this.transformData()
      this.drawBarChart()
    },
    types: function(newVal, oldVal) {
      this.transformData()
      this.drawBarChart()
    },
    car_type_color_set: function(newVal, oldVal) {
      //console.log(newVal);
      this.transfromColorSet()
    },
    car_type_concerned: function(newVal, oldVal) {
      this.transformOpacitySet()
      //console.log(this.opacity_set);
      this.drawBarChart()
    },
    hover_route: function(newVal, oldVal) {
      this.transformData()
      this.drawBarChart()
    },
    staying_time_range: function(newVal, oldVal) {
      this.transformData()
      this.drawBarChart()
    }
  },
  data () {
    return {
      type_counter: {
        "1":0,
        "2":0,
        "3":0,
        "4":0,
        "5":0,
        "6":0,
        "2P":0
      },
      stacked_counter: [
        {type: "Car", two_axles: 0, two_axles_pass:0, three_axles: 0, four_axles: 0, total: 0},
        {type: "Truck", two_axles: 0, two_axles_pass:0, three_axles: 0, four_axles: 0, total: 0},
        {type: "Bus", two_axles: 0, two_axles_pass:0, three_axles: 0, four_axles: 0, total: 0}
      ],
      columns: ["two_axles", "two_axles_pass", "three_axles", "four_axles"],
      keys: ["Car", "Truck", "Bus"],
      color_set: [],
      opacity_set: [],
    }
  },
  mounted() {
    this.svg = d3.select("#stacked-bar")
    var svg = this.svg

    var margin = {top: 20, right: 20, bottom: 20, left: 30}
    this.width = +svg.attr("width") - margin.left - margin.right
    this.height = +svg.attr("height") - margin.top - margin.bottom
    this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.x = d3.scaleBand()
      .rangeRound([0, this.width])
      .padding(0.3)
      .align(0.3)
      .domain(this.keys)

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0])

    this.z = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(this.columns)

    this.stack = d3.stack()
    this.drawStatic()

    this.transfromColorSet()
    this.transformOpacitySet()
  },
  methods: {
    initCounter() {
      return {
        "1":0,
        "2":0,
        "3":0,
        "4":0,
        "5":0,
        "6":0,
        "2P":0
      }
    },
    transformData() {
      var that = this;
      this.type_counter = this.initCounter()

      //console.log(this.hover_route);
      if (this.hover_route) {
        var routes = [this.hover_route]
      }else {
        var routes = this.routes
      }

      routes.forEach(function(route) {
        route.travels.forEach(function(travel) {
          var entry_time = travel.records[0].time.getTime()
          var exit_time = travel.records[travel.records.length - 2].time.getTime()
          var minutes = (exit_time - entry_time) / 1000.0 / 60
          if (minutes >= that.staying_time_range[0] && minutes <= that.staying_time_range[1]) {
            that.type_counter[travel.car_type] += 1;
          }
        })
      })
      this.stacked_counter[0]["two_axles"] = this.type_counter["1"]
      this.stacked_counter[0].total = this.type_counter["1"]
      this.stacked_counter[1]["two_axles"] = this.type_counter["2"]
      this.stacked_counter[1]["two_axles_pass"] = this.type_counter["2P"]
      this.stacked_counter[1]["three_axles"] = this.type_counter["3"]
      this.stacked_counter[1]["four_axles"] = this.type_counter["4"]
      this.stacked_counter[1].total = this.type_counter["2"] + this.type_counter["2P"] + this.type_counter["3"] + this.type_counter["4"]
      this.stacked_counter[2]["two_axles"] = this.type_counter["5"]
      this.stacked_counter[2]["three_axles"] = this.type_counter["6"]
      this.stacked_counter[2].total = this.type_counter["5"] + this.type_counter["6"]
    },
    transformOpacitySet() {
      this.opacity_set[0] = this.car_type_concerned.indexOf('1') >= 0?1:0.2
      this.opacity_set[1] = this.car_type_concerned.indexOf('2') >= 0?1:0.2
      this.opacity_set[2] = this.car_type_concerned.indexOf('5') >= 0?1:0.2
      this.opacity_set[3] = 1
      this.opacity_set[4] = this.car_type_concerned.indexOf('2P') >= 0?1:0.2
      this.opacity_set[5] = 1
      this.opacity_set[6] = 1
      this.opacity_set[7] = this.car_type_concerned.indexOf('3') >= 0?1:0.2
      this.opacity_set[8] = this.car_type_concerned.indexOf('6') >= 0?1:0.2
      this.opacity_set[9] = 1
      this.opacity_set[10] = this.car_type_concerned.indexOf('4') >= 0?1:0.2
      this.opacity_set[11] = 1
    },
    transfromColorSet() {
      this.color_set[0] = this.car_type_color_set['1']
      this.color_set[1] = this.car_type_color_set['2']
      this.color_set[2] = this.car_type_color_set['5']
      this.color_set[3] = "#ffffff"
      this.color_set[4] = this.car_type_color_set['2P']
      this.color_set[5] = "#ffffff"
      this.color_set[6] = "#ffffff"
      this.color_set[7] = this.car_type_color_set['3']
      this.color_set[8] = this.car_type_color_set['6']
      this.color_set[9] = "#ffffff"
      this.color_set[10] = this.car_type_color_set['4']
      this.color_set[11] = "#ffffff"
    },
    drawStatic() {
      var height = this.height;
      var width = this.width;
      var g = this.g;
      var z = this.z;
      var x = this.x;
      var y = this.y;

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "s"))
        .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks(10).pop()))
          .attr("dy", "0.35em")
          .attr("text-anchor", "start")
          .attr("fill", "#000")
          .text("Count");

      /*
      var legend = g.selectAll(".legend")
        .data(["two_axles", "two_axles_pass", "three_axles", "four_axles"])
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .style("font", "10px sans-serif");

      legend.append("rect")
          .attr("x", width + 18)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", z);

      legend.append("text")
          .attr("x", width + 44)
          .attr("y", 9)
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .text(function(d) { return d; });
      */

    },
    drawBarChart() {
      //this.x.domain(this.stacked_counter.map(d => d.type))
      this.y.domain([0, d3.max(this.stacked_counter, d => d.total)]).nice()
      //this.z.domain(["two_axles", "two_axles_pass", "three_axles", "four_axles"])

      var x = this.x;
      var y = this.y;
      var z = this.z;
      var g = this.g;
      var height = this.height;
      var width = this.width;
      var data = this.stacked_counter;
      var stack = this.stack;
      var color_counter = 0;
      var opacity_counter = 0;

      g.selectAll(".serie").remove()

      var series = g.selectAll(".serie")
        .data(stack.keys(["two_axles", "two_axles_pass", "three_axles", "four_axles"])(data))
        .enter().append("g")
          .attr("class", "serie")
          .attr("fill", function(d) {
            //console.log(d);
            return z(d.key);
          })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter()

      series.append("rect")
        .attr("x", function(d) { return x(d.data.type); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("fill", d => {
          //console.log(d);
          color_counter ++;
          return this.color_set[color_counter - 1];
        })
        .attr("opacity", d => {
          opacity_counter ++;
          //console.log(this.opacity_set);
          return this.opacity_set[opacity_counter - 1];
        })

      series.append("text")
        .text(d => (d[1] - d[0]) === 0 ? "": (d[1] - d[0]))
        .attr("x", function(d) { return x(d.data.type) + x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1]) + 15; })
        .attr("fill", "#ffffff")
        .attr("text-anchor", "middle")

      g.select(".axis--y").remove()

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "s"))
        .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks(10).pop()))
          .attr("dy", "0.35em")
          .attr("text-anchor", "start")
          .attr("fill", "#000")
          .text("Count");
    }
  }
}
</script>
