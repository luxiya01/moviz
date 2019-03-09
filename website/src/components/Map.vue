<template>
  <div class="map">
      <div class="tooltip"></div>
  </div>
</template>

<script>
import {event as currentEvent} from 'd3';
import population from '../../public/population.json';
import totalRevenueJSON from '../../public/total_revenue.json';

const d3 = {
    ...require('d3'),
    ...require('d3-geo'),
    ...require('d3-geo-projection'),
    ...require('d3-array'),
    ...require('d3-svg-legend')
};

export default {
  name: 'Map',
  props: {
    movieJSON: Object,
    movieid: String,
    mode: String,
    scale: String,
    ratingsJSON: Object,
    year: String
  },
  data() {
      return {
        population: population,
        // from colorbrewer (http://colorbrewer2.org/)
        defaultColours : ["#fff5f0", "#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],
        ratingColours: ['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704'],
        movieColours: ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'],
        colours: null,
        //Map dimensions (in pixels)
        width : 900,
        height : 500,
        //Keeps track of currently zoomed feature
        centered : null,
        //Position of the tooltip relative to the cursor
        tooltipOffset : {x: -40, y: -50},
        // list for movie revenues, these values are used to color countries
        currentData : {},
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
      },
      legend() {
          return d3.legend.color()
                      .labelFormat(this.valueFormat)
                      .scale(this.colScale);
      }
  },
  watch: {
      centered: function() {
          var selection;
          if (this.centered) {
               selection = this.centered.properties.name;
          } else {
              selection = '';
          }
          this.$emit('countryClicked', selection);
      },
      year: function(val, preVal) {
          if (this.mode == 'imdb-rating') {
              this.changeYearRating()
          } else {
              this.changeYearRevenue()
          }
      },
      movieid: function(val, preVal) {
          if (val == '') {
              this.changeYearRevenue();
          } else {
              this.loadMovieRevenue();
          }
      },
      mode: function(val, preVal) {
          if (val == 'imdb-rating') {
              this.changeYearRating();
          } else {
              this.changeYearRevenue();
          }
      },
      scale: function(val, preVal) {
          if (val == 'per-capita' && preVal == 'total') {
              this.co
              this.updateMapHelper(this.currentData);
          }
          if (val == 'total' && preVal == 'per-capita') {
              var currentComponent = this;
              var dataList = Object.entries(this.currentData);
              dataList.forEach(function(d) {
                  var num = d[1];
                  currentComponent.currentData[d[0]] = num*Number(currentComponent.population[d[0]]);
              })
              this.updateMapHelper(this.currentData);
          }
      },
  },
  methods: {
    changeYearRating: function() {
        var rating_sum = {};
        var num_movies = {};
        Object.entries(population).forEach(function(d) {
            rating_sum[d[0]] = 0;
            num_movies[d[0]] = 0;
        })

        var year = this.year;
        Object.entries(this.movieJSON).forEach(function(d) {
            if (d[1].country && d[1].rating) {
                var curr_rating = d[1].rating;
                if (year == '2000 - 2019') {
                    d[1]['country'].forEach(function(c) {
                        rating_sum[c] += curr_rating;
                        num_movies[c] += 1;
                    })
                } else if (d[1].release_year == year) {
                    d[1]['country'].forEach(function(c) {
                        rating_sum[c] += curr_rating;
                        num_movies[c] += 1;
                    })
            }
            }});

        var tmp = {};
        Object.entries(rating_sum).forEach(function(d) {
            if (num_movies[d[0]] > 0) {
                tmp[d[0]] = d[1]/num_movies[d[0]];
            }
        })
        this.updateMapHelper(tmp);
    },
    changeYearRevenue: function() {
        var tmp = {};
        var year = this.year;
        Object.entries(this.movieJSON).forEach(function(d) {
            if (year == '2000 - 2019') {
                Object.entries(d[1].country_total_gross).forEach(function(c) {
                    if (!tmp[c[0]]) {
                        tmp[c[0]] = 0;
                    }
                    tmp[c[0]] += c[1];
                })
            } else {
                if (d[1].release_year == year) {
                    Object.entries(d[1].country_total_gross).forEach(function(c) {
                        if (! tmp[c[0]]) {
                            tmp[c[0]] = 0;
                        }
                        tmp[c[0]] += c[1];
                    })
                }
            }
        }
        );
        this.updateMapHelper(tmp)
    },
    // function takes a movie id as input and repaints the map
    loadMovieRevenue: function(){

      // load the new data
      var selectedmovierevenue =
            this.movieJSON[this.movieid]["country_total_gross"];

      var countryarray = Object.entries(selectedmovierevenue);

      // placeholder revenue
      var newcurrentData = {};

      countryarray.forEach(function(d) {
        newcurrentData[d[0]] = d[1];
      });

      var currentComponent = this;
      this.updateMapHelper(newcurrentData);
      
    },
      updateMapHelper: function(data) {
          if (this.mode == 'imdb-rating') {
              this.colours = this.ratingColours;
          } else if (this.movieid != '') {
              this.colours = this.movieColours;
          } else {
              this.colours = this.defaultColours;
          }
          var currentComponent = this;
          this.currentData = data;

          if (this.mode == 'revenue' && this.scale == 'per-capita') {
              var dataList = Object.entries(data);
              dataList.forEach(function(d) {
                  var num = d[1];
                  currentComponent.currentData[d[0]] = num/Number(currentComponent.population[d[0]]);
              })
          };

          var min = d3.min(Object.values(currentComponent.currentData));
          var max = d3.max(Object.values(currentComponent.currentData));

          // set the domain for the colors
          currentComponent.colScale.domain([min,max]);

          // repaint the countries
          this.features.selectAll("path")
            .style("fill", function (d,i) {
              return (currentComponent.currentData[d.properties.name] ?
                  currentComponent.colScale(data[d.properties.name]) : "#ccc");
            });
          this.svg.select('.legend').call(this.legend);
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
        html += (this.currentData[d.properties.name] ? this.valueFormat(this.currentData[d.properties.name]) : " No data");     // adds the data if it exists
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
        if (this.mode == 'revenue') {
              if (d > 1000000000) {
                return " $" + Math.round(d / 1000000000 * 10) / 10 + " B";
              } else if (d > 1000000) {
                return " $" + Math.round(d / 1000000 * 10) / 10 + " M";
              } else if (d > 1000) {
                return " $" + Math.round(d / 1000 * 10) / 10 + " K";
              } else if (d > 10) {
                return " $" + d.toFixed(0);
              } else {
                return " $" + d.toFixed(2);
              }
        } else {
                return " " + d.toFixed(2);
        }
    },
    loadTotalRevenue: function() {

        var currentComponent = this;
        var tempList = {};

        d3.json("total_revenue.json", function(movies) {
          movies = Object.entries(movies);
          d3.json("countries.geojson", function(geodata) {

            // take out each countries value
            movies.forEach(function(d) {
              tempList[d[0]] = d[1]['revenue'];
            });
            currentComponent.currentData = tempList;

            var min = d3.min(Object.values(currentComponent.currentData))
            var max = d3.max(Object.values(currentComponent.currentData))

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
                return (currentComponent.currentData[d.properties.name] ?
                    currentComponent.colScale(currentComponent.currentData[d.properties.name]) : "#ccc"); });;

            // Add legend
            currentComponent.svg.append("rect")
              .attr('class', 'legend-wrapper')
              .style({'fill':'#212121', 'width': '187px', 'height': '166px',
                  'rx':'15', 'ry': '15',
                  'stroke-width': '2', 'stroke': 'white'
              })
              .attr('transform', 'translate(13,332)');
                
            currentComponent.svg.append("g")
              .attr("class", "legend")
              .style({'fill': 'white'})
              .attr('transform', 'translate(20,340)');
            currentComponent.svg.select('.legend').call(currentComponent.legend);
          });
        });
      },
  },
  mounted() {
      this.loadTotalRevenue();
      this.colours = this.defaultColours;
  }
}
</script>

<style scoped>
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
