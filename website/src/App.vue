<template>
  <div id="app">
    <router-link to="/"><img id="logo" src="./assets/logo_black.svg" alt="moViz" width="200" ></router-link> 
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
  
</template>

<style>
#logo{
  padding-top: 1em;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #502c2c;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #502c2e;
}

#nav a.router-link-exact-active {
  color: #b82929;
}
</style>
