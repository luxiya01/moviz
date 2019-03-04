<template>
  <div class="map">
      <div class="tooltip"></div>
  </div>
</template>

<script>
import {event as currentEvent} from 'd3';
import population from '../../public/population.json';

const d3 = {
    ...require('d3'),
    ...require('d3-geo'),
    ...require('d3-geo-projection'),
    ...require('d3-array')
};

export default {
  name: 'Map',
  props: {
    movieJSON: Object,
    movieid: String,
    mode: String,
    scale: String,
    ratingsJSON: Object
  },
  data() {
      return {
        population: population,
        // from colorbrewer (http://colorbrewer2.org/)
        colours : ["#fff5f0", "#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],
        //Map dimensions (in pixels)
        width : 900,
        height : 500,
        //Keeps track of currently zoomed feature
        centered : null,
        //Position of the tooltip relative to the cursor
        tooltipOffset : {x: 20, y: -160},
        // list for movie revenues, these values are used to color countries
        revenuelist : {},
    }

  },
  computed: {
    // setup colours for choropleth
      colScale() {
        return d3.scale.quantize().range(this.colours);
      },
    //Map projection
      projection() {
          return d3.geoRobinson()
                    .scale(137.67011618797827)
                    .center([-0.0018057527730242487,11.258678472759552]) //projection center
                    .translate([this.width/2,this.height/2]) //translate to center the map in view
      },
    //Generate paths based on projection
      path() {
          return d3.geo.path().projection(this.projection);
      },
      
    //Create an SVG
      svg (){
       return d3.select(".map").append("svg")
            .attr("class", "worldMap")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("z-index", "-10")
      },

    //Group for the map features
      features() {
          return this.svg.append("g")
                    .attr("class","features");
      }
  },
  watch: {
      movieid: function() {
          this.updateMap();
      },
      mode: function() {
          this.updateMap();
      },
      scale: function() {
          this.updateMap();
      }
  },
  methods: {
    updateMap: function() {
        if (this.mode == 'imdb-rating') {
            this.loadIMDBRating();
        } else {
            this.loadMovieData();
        }
    },
    loadIMDBRating: function() {
        this.updateMapHelper(this.ratingsJSON);
    },
    // function takes a movie id as input and repaints the map
    loadMovieData: function(){

      // load the new data
      var selectedmovierevenue = this.movieJSON[this.movieid]["Country Total Gross"];

      var countryarray = Object.entries(selectedmovierevenue);

      // placeholder revenue
      var newrevenuelist = {};

      countryarray.forEach(function(d) {
        var value = d[1].replace(/[^0-9\.]+/g, '');
        value = Number(value);
        newrevenuelist[d[0]] = +value;
      });

      var usarevenue = this.movieJSON[this.movieid]["Domestic Total Gross"];
      usarevenue = usarevenue.replace(/[^0-9\.]+/g, '');

      // separate addition for USA
      newrevenuelist["USA"] = +usarevenue;

      var currentComponent = this;
      console.log(newrevenuelist);

      if (this.scale == 'per-capita') {
          countryarray = Object.entries(newrevenuelist);
          countryarray.forEach(function(d) {
              var num = newrevenuelist[d[0]];
              newrevenuelist[d[0]] = num/Number(currentComponent.population[d[0]]);
          })
      };

      this.updateMapHelper(newrevenuelist);
      
    },
      updateMapHelper: function(data) {
          this.revenuelist = data;
          var min = d3.min(Object.values(data))
          var max = d3.max(Object.values(data))

          var currentComponent = this;
          // set the domain for the colors
          currentComponent.colScale.domain([min,max]);

          // repaint the countries
          this.features.selectAll("path")
            .style("fill", function (d,i) {
              return (data[d.properties.name] ?
                  currentComponent.colScale(data[d.properties.name]) : "#ccc");
            });
          console.log(currentComponent.colScale.domain());
      },
    // Zoom to feature on click
    clicked: function(d,i) {

      //Add any other onClick events here

      var x, y, k;

      if (d && this.centered !== d) {
        // Compute the new map center and scale to zoom to
        var centroid = this.path.centroid(d);
        var b = this.path.bounds(d);
        x = centroid[0];
        y = centroid[1];
        k = .8 / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1])
            / this.height);
        this.centered = d
      } else {
        x = this.width / 2;
        y = this.height / 2;
        k = 1;
        this.centered = null;
      }

      // Highlight the new feature
      this.features.selectAll("path")
          .classed("highlighted",function(d) {
              return d === this.centered;
          })
          //.style("stroke-width", 1 / k + "px"); // Keep the border width constant

      //Zoom and re-center the map
      //Uncomment .transition() and .duration() to make zoom gradual
      this.features.transition()
          .duration(1000)
          .attr("transform","translate(" + this.width / 2 + "," + this.height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    },
    //Create a tooltip, hidden at the start
    showTooltip: function(d) {
      this.moveTooltip();

        // add additional values to tooltip here, if wanted
        var html = "";

        html += "<div class=\"tooltip_kv\">";
        html += "<span class=\"tooltip_key\">";
        html += d.properties.name;    // adds the name of the country to tooltip
        html += "</span>";
        html += "<span class=\"tooltip_value\">";
        html += (this.revenuelist[d.properties.name] ? this.valueFormat(this.revenuelist[d.properties.name]) : "No data");     // adds the data if it exists
        html += "";
        html += "</span>";
        html += "</div>";

        d3.select(".tooltip").style("display","block").html(html);
    },

    //Move the tooltip to track the mouse
    moveTooltip: function() {
      d3.select(".tooltip").style("top",(currentEvent.pageY+this.tooltipOffset.y)+"px")
          .style("left",(currentEvent.pageX+this.tooltipOffset.x)+"px");
    },
    //Create a tooltip, hidden at the start
    hideTooltip: function() {
      d3.select(".tooltip").style("display","none");
    },

    // Rounding function for values
    valueFormat: function(d) {
      if (d > 1000000000) {
        return Math.round(d / 1000000000 * 10) / 10 + "B $";
      } else if (d > 1000000) {
        return Math.round(d / 1000000 * 10) / 10 + "M $";
      } else if (d > 1000) {
        return Math.round(d / 1000 * 10) / 10 + "K $";
      } else if (d < 1) {
        return d.toFixed(2) + " $";
      } else {
        return d;
      }
    }
  },
  mounted() {

    var currentComponent = this;

    //read in initial data TODO: swap to accumulated revenue
    d3.csv("population.csv", function(movies) {
      d3.json("countries.geojson", function(geodata) {

        // take out each countries value
        movies.forEach(function(d) {
          currentComponent.revenuelist[d["Country"]] = +d["Population"];
        });

        var min = d3.min(Object.values(currentComponent.revenuelist))
        var max = d3.max(Object.values(currentComponent.revenuelist))

        // set domain for colors
        currentComponent.colScale.domain([min,max]);

        //Create a path for each map feature in the data
        currentComponent.features.selectAll("path")
          .data(geodata.features) //generate features from TopoJSON
          .enter()
          .append("path")
          .attr("d",currentComponent.path)
          .attr("id", function(d,i) { return d.properties.name; })
          .attr("class", "country")
          .on("mouseover",currentComponent.showTooltip)
          .on("mousemove",currentComponent.moveTooltip)
          .on("mouseout",currentComponent.hideTooltip)
          .on("click",currentComponent.clicked)
          .style("fill", function (d,i) {
            return (currentComponent.revenuelist[d.properties.name] ?
                currentComponent.colScale(currentComponent.revenuelist[d.properties.name]) : "#ccc"); });;
      });
    });
  }
}
</script>

<style>
body {
  font: 18px sans-serif;
}

path {
  stroke-width: 1px;
  stroke: white;
  fill: steelblue;
  cursor: pointer;
}

path:hover, path.highlighted {
  fill: tomato;
}

.tooltip_key {
  font-weight: bold;
}
.tooltip_value {
  margin-left: 20px;
  float: right;
}

div.tooltip {
  position: absolute;
  background-color: black;
  border: 1px solid black;
  color: white !important;
  padding: 4px 8px;
  opacity: 1 !important;
  /*display: none;*/
}
</style>
