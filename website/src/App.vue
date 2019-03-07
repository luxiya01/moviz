<template>

  <div id="app">
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">    
        
    
    <div class="v-sidebar-menu vsm-collapsed" style="width: 50px;">
      <div class="vsm-list">
        <router-link to="/"><img id="logo" src="./assets/logo_white.svg" alt="moViz" ></router-link>
        <div class="vsm-item first-item">
          <router-link to="/" class="vsm-link">
            <i id="homeDesc" class="vsm-icon fa fa-user"> </i> 
          </router-link>
          </div>
          <div class="vsm-item first-item">
            <router-link to="/about" class="vsm-link">
              <i id="aboutDesc" class="vsm-icon fas fa-info"></i> 
            </router-link> 
          </div>
      </div>
    </div>
    <div class="viewing" style="margin: 2em 0 0 5em; z-index: -10;">
      <router-view />
    </div>

  <b-tooltip target="homeDesc" placement="righttop" >
    See moViz visualization
  </b-tooltip>
  <b-tooltip target="aboutDesc" placement="righttop">
    About the project
  </b-tooltip>

    <!--<router-link to="/"><img id="logo" src="./assets/logo_white.svg" alt="moViz" width="200" ></router-link> --
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>-->
  </div>
  
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'
export default {
  components: {
    SidebarMenu
  }
}
</script>

<style>
.router-link-exact-active.vsm-link {
    -webkit-box-shadow: 3px 0 0 0 #4285f4 inset;
    box-shadow: inset 3px 0 0 0 #4285f4;
}

.v-sidebar-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    padding-bottom: 50px;
    /*-webkit-transition: width .3s;
    transition: width .3s;*/
}

.v-sidebar-menu, .v-sidebar-menu * {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.v-sidebar-menu>.vsm-list {
    background-color: #2a2a2e !important;
    width: 100%;
    height: 100vh !important;
    overflow: hidden auto;
}

#logo{
  padding: 1em 0 0 .5em;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}
/*
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
}*/

</style>
