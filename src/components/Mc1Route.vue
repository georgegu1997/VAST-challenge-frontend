<template>
  <div class="root container-fluid">
    <div class="row">
      <div class="col-sm-4 left-panel">
        <div class="route-selection">
          <div v-for="pattern in PATTERNS" class="pattern">
            <h5>
              {{pattern.name}}
            </h5>
            <div v-for="route in pattern.routes" class="route"
               v-on:click="toggleRoute(route)"
               v-bind:class="{selected: route.selected}">
              <p :title="route.description">
                {{route.description}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-8 right-panel">
        <div class="row">
          <route-drawer v-bind:routes="selected_routes"></route-drawer>
        </div>
        <div class="row">
          <car-type-bar v-bind:routes="selected_routes"></car-type-bar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import RouteDrawer from './RouteDrawer'
import CarTypeBar from './CarTypeBar'

export default {
  name: 'mc-1-route',
  components: {
    RouteDrawer,
    CarTypeBar
  },
  data() {
    return {
      PATTERNS: [],
      selected_routes: [],
    }
  },
  mounted() {
    var that = this;

    d3.queue()
      .defer(d3.json, "static/data/patterns.json")
      .await(load_data)

    function load_data(error, patterns){
      if (error) {console.error(error);}

      that.PATTERNS = patterns
      //console.log(that.PATTERNS);
    }
  },
  methods: {
    toggleRoute(route) {
      var index = this.selected_routes.indexOf(route)
      if (index >= 0) {
        this.selected_routes.splice(index, 1)
      }else {
        this.selected_routes.push(route)
      }
      if (route.selected) {
        route.selected = false
      }else {
        route.selected = true
      }
    }
  }
}
</script>

<style>
.route-selection {
  text-align: left;
  max-height: 600px;
  overflow-y: scroll;
}

.route-selection .pattern .route p {
  margin-bottom: 0;
  font-size: 12px;
  max-height: 15px;
  overflow-y: hidden;
}

.route-selection .pattern .selected p {
  color: red;
}
</style>
