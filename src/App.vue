<template>
  <div id="app">
    <mc1-route></mc1-route>
  </div>
</template>

<script>
import Hello from './components/Hello'
import NonVueLineChart from './components/NonVueLineChart'
import VueLineChart from './components/VueLineChart'
import CountByTimePlot from './components/CountByTimePlot'
import PunchCards from './components/Punchcards'
import RouteDrawer from './components/RouteDrawer'
import Mc1Route from './components/Mc1Route'

export default {
  name: 'app',
  components: {
    Hello,
    NonVueLineChart,
    VueLineChart,
    CountByTimePlot,
    PunchCards,
    RouteDrawer,
    Mc1Route,
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
