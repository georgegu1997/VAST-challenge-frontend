
<template>
  <svg width="1500" height="200">
    <g style="transform: translate(0, 10px)">
      <path :d="line" />
    </g>
  </svg>
</template>
<script>
import * as d3 from 'd3';
export default {
  name: 'vue-line-chart',
  data() {
    return {
      data: [369, 210, 241, 280, 268, 306, 979, 1325, 1341, 1266, 1548, 1674, 1651, 1618, 1465, 1584, 1573, 1555, 1098, 756, 692, 684, 619, 419],
      line: '',
    };
  },
  mounted() {
    this.calculatePath();
  },
  methods: {
    getScales() {
      const x = d3.scaleTime().range([0, 1400]);
      const y = d3.scaleLinear().range([150, 0]);
      d3.axisLeft().scale(x);
      d3.axisBottom().scale(y);
      x.domain(d3.extent(this.data, (d, i) => i));
      y.domain([0, d3.max(this.data, d => d)]);
      return { x, y };
    },
    calculatePath() {
      const scale = this.getScales();
      const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d));
      this.line = path(this.data);
    },
  },
};
</script>

<style lang="sass" scoped>
svg
  margin: 25px;
path
  fill: none
  stroke: #76BF8A
  stroke-width: 3px
</style>
