<template>
  <div id="app">
    <router-link to="/"><img id="logo" src="./assets/logo_white.svg" alt="moViz" width="200" ></router-link> 
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
  
</template>

<style>
#logo{
  padding-top: .5em;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}
#nav {
  padding: 1em;
}

#nav a {
  font-weight: bold;
  color: #ffffff;
}

#nav a.router-link-exact-active {
  color: white;
  font-size: 1.2em;
  text-decoration: underline;
}

a:hover{
  color: #ffffff;
}

</style>
