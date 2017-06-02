<template>
  <div id="app">
    <punch-cards></punch-cards>
  </div>
</template>

<script>
import Hello from './components/Hello'
import NonVueLineChart from './components/NonVueLineChart'
import VueLineChart from './components/VueLineChart'
import CountByTimePlot from './components/CountByTimePlot'
//import ResponsiveAreaChart from './components/ResponsiveAreaChart'
import PunchCards from './components/Punchcards'

export default {
  name: 'app',
  components: {
    Hello,
    NonVueLineChart,
    VueLineChart,
    CountByTimePlot,
    PunchCards,
  }
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
