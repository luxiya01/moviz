<template>

  <div class="about">
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">

    <div  class="container">
      <div id="project" class="container">
        <h3><b>PROJECT</b></h3>
        <!--<font-awesome-icon icon="coffee" />        -->
        <div class="row">
          <p>SUMMARY OF OUR PROJECT</p>
        </div>
      </div>
      <div id="tools" class="container">
        <h4><b>TOOLS</b></h4>
        <div class="row">
          <img id="d3Desc" src="../assets/d3.png" alt="d3.js">
          <i id="vueDesc" class="fab fa-4x fa-vuejs"></i>
          <i id="githubDesc" variant="outline-success" class="fab fa-4x fa-github"></i>
          <i id="messengerDesc" class="fab fa-4x fa-facebook-messenger"></i>
        </div>
      </div>
      <br/>

  <b-tooltip target="d3Desc" placement="bottom">
    We used <strong>D3.js</strong> for visualizing our data
  </b-tooltip>

  <b-tooltip target="vueDesc" placement="bottom">
    We used <strong>Vue</strong> as our front-end framework
  </b-tooltip>
  
  <b-tooltip target="githubDesc" placement="bottom">
    <strong>Github</strong> was used for publishing our website 
  </b-tooltip>

  <b-tooltip target="messengerDesc" placement="bottom">
    We used <strong>Facebook Messenger</strong> as our main communication channel
  </b-tooltip>


  <b-modal hide-footer v-model="modalShow1">Hello 1 Modal!</b-modal>

  <b-modal hide-footer v-model="modalShow2">Hello 2 Modal!</b-modal>

  <b-modal hide-footer v-model="modalShow3">Hello 3 Modal!</b-modal>

  <b-modal hide-footer v-model="modalShow4">Hello 4 Modal!</b-modal>

  <b-modal hide-footer v-model="modalShow5">Hello 5 Modal!</b-modal>

  <b-modal hide-footer v-model="modalShow6">Hello 6 Modal!</b-modal>


      <div id="team">
        <h3><b>TEAM</b></h3>
        <div class="container" >
          <div class="row">
            <div > 
              <div @click="modalShow1 = !modalShow1" class="members">
                <div class="overlay">
                  <div class="text">Click to see my contributions!</div>
                </div>
              </div>
              <p>NAME</p>
              <p>POSITION</p>
              <a href="https://www.github.com"> <i class="fab fa-2x fa-github-square"></i></a>
              <a href="https://www.linkedin.com/"> <i class="fab fa-2x fa-linkedin"></i></a>
            </div>

            <div >
              <div @click="modalShow2 = !modalShow2" class="members">
                <div class="overlay">
                  <div class="text">Click to see my contributions!</div>
                </div>
              </div>
              <p>NAME</p>
              <p>POSITION</p>              
              <a href="https://www.github.com"> <i class="fab fa-2x fa-github-square"></i></a>
              <a href="https://www.linkedin.com/"> <i class="fab fa-2x fa-linkedin"></i></a>
            </div
            >
            <div >
              <div @click="modalShow3 = !modalShow3" class="members">
                <div class="overlay">
                  <div class="text">Click to see my contributions!</div>
                </div>
              </div>
              <p>NAME</p>
              <p>POSITION</p>
              <a href="https://www.github.com"> <i class="fab fa-2x fa-github-square"></i></a>
              <a href="https://www.linkedin.com/"> <i class="fab fa-2x fa-linkedin"></i></a>
            </div>
          </div>

          <div class="row">
            <div >
              <div @click="modalShow4 = !modalShow4" class="members">
                <div class="overlay">
                  <div class="text">Click to see my contributions!</div>
                </div>
              </div>
              <p>NAME</p>
              <p>POSITION</p>
              <a href="https://www.github.com"> <i class="fab fa-2x fa-github-square"></i></a>
              <a href="https://www.linkedin.com/"> <i class="fab fa-2x fa-linkedin"></i></a>
            </div>
            
            <div >
              <div @click="modalShow5 = !modalShow5" class="members">
                <div class="overlay">
                  <div class="text">Click to see my contributions!</div>
                </div>
              </div>
              <p>NAME</p>
              <p>POSITION</p>
              <a href="https://www.github.com"> <i class="fab fa-2x fa-github-square"></i></a>
              <a href="https://www.linkedin.com/"> <i class="fab fa-2x fa-linkedin"></i></a>
            </div>
            
            <div >
              <div @click="modalShow6 = !modalShow6" class="members"> 
                <div class="overlay">
                  <div class="text">Click to see my contributions!</div>
                </div>
              </div>
              <p>NAME</p>
              <p>POSITION</p>
              <a href="https://www.github.com"> <i class="fab fa-2x fa-github-square"></i></a>
              <a href="https://www.linkedin.com/"> <i class="fab fa-2x fa-linkedin"></i></a>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>


  
</template>




<style>
a{
  color:inherit;
  text-decoration: none;
}
p {
  margin-bottom: 0em;
}

#project{
  margin-bottom: 2em;
}
#tools{
  margin-bottom: 2em;
}
#team{
  padding: 2em 0 2em
   0 ;

}
#d3Desc{
  height: 4em;
}
.fab {
  margin-left: .2em;
  /*margin-top: -1em;*/
}
.row {
  justify-content: center
}
.members {
  position: relative;
  /*width: 50%;*/
  border-radius: 15px;
  background: #502c2e;;
  padding: 20px; 
  margin: 2em 2em 0 2em;
  width: 200px;
  height: 150px; 
}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  border-radius: 15px;
  opacity: 0;
  transition: .3s ease;
  background-color: #b8292975;
}

.members:hover .overlay {
  opacity: 1;
}

.text {
  color: white;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}


</style>
<script>
  export default {
    data() {
      return {
        modalShow1: false,
        modalShow2: false,
        modalShow3: false,
        modalShow4: false,
        modalShow5: false,
        modalShow6: false
      }
    }
  }
</script>