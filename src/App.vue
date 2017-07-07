<template>
<div class="root">
  <b-navbar toggleable type="inverse" variant="primary">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

    <b-link class="navbar-brand" to="#">
      <span>VAST Challenge</span>
    </b-link>

    <b-collapse is-nav id="nav_collapse">

      <b-nav is-nav-bar>
        <b-nav-item-dropdown text="Mini Challenge 1">
          <b-dropdown-item to="/mc1-route">View Routes</b-dropdown-item>
          <b-dropdown-item to="/mc1-decision-tree">Pattern Decision Tree</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Mini Challenge 2">
          <b-dropdown-item to="/">View Routes</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Mini Challenge 3">
          <b-dropdown-item to="/mc3-parallel">Parallel Coordinates</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>

    </b-collapse>
  </b-navbar>
  <div id="router-outlet">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style scoped>
.navbar {
  height: 60px;
  z-index: 10;
}

#router-outlet {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0;
  z-index: 5;
  padding: 20px;
  padding-bottom: 40px;
}
.root {
  height: 100%
}
</style>
