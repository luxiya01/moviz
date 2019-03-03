<template>
  <div class="map">
  </div>
</template>

<script>
import {event as currentEvent} from 'd3';
const d3 = {
    ...require('d3'),
    ...require('d3-geo'),
    ...require('d3-geo-projection'),
    ...require('d3-array')
};

export default {
  name: 'Map',
  props: {
    moviefile: Object,
    movieid: String
  },
  mounted() {
    //Map dimensions (in pixels)
    var width = 900,
        height = 500;

    //Map projection
    var projection = d3.geoRobinson()
        .scale(137.67011618797827)
        .center([-0.0018057527730242487,11.258678472759552]) //projection center
        .translate([width/2,height/2]) //translate to center the map in view

    //Generate paths based on projection
    var path = d3.geo.path()
        .projection(projection);

    //Create an SVG
    var svg = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height);

    //Group for the map features
    var features = svg.append("g")
        .attr("class","features");

    //Create a tooltip, hidden at the start
    var tooltip = d3.select("body").append("div").attr("class","tooltip");

    //Keeps track of currently zoomed feature
    var centered;

    // from colorbrewer (http://colorbrewer2.org/)
    var colours = ["#fff5f0", "#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];

    // setup colours for choropleth
    var colScale = d3.scale.quantize()
                      .range(colours);

    // list for movie revenues, these values are used to color countries
    var revenuelist = {};

    /*
    // file for movie data
    var moviefile;

    // read in movie data
    $.getJSON("movies.json", function (data) {
        moviefile = data;
    });
    */

    //read in initial data TODO: swap to accumulated revenue
    d3.csv("population.csv", function(movies) {
      d3.json("countries.geojson", function(geodata) {

        // take out each countries value
        movies.forEach(function(d) {
          revenuelist[d["Country"]] = +d["Population"];
        });

        var min = d3.min(Object.values(revenuelist))
        var max = d3.max(Object.values(revenuelist))

        // set domain for colors
        colScale.domain([min,max]);

        //Create a path for each map feature in the data
        features.selectAll("path")
          .data(geodata.features) //generate features from TopoJSON
          .enter()
          .append("path")
          .attr("d",path)
          .attr("id", function(d,i) { return d.properties.name; })
          .attr("class", "country")
          .on("mouseover",showTooltip)
          .on("mousemove",moveTooltip)
          .on("mouseout",hideTooltip)
          .on("click",clicked)
          .style("fill", function (d,i) {
            return (revenuelist[d.properties.name] ? colScale(revenuelist[d.properties.name]) : "#ccc"); });;
      });
    });

    // function takes a movie id as input and repaints the map
    function loadMovieData(movieid){

      // load the new data
      var movie = moviefile;
      var selectedmovierevenue = movie[movieid]["Country Total Gross"];

      var countryarray = Object.entries(selectedmovierevenue);

      // placeholder revenue
      var newrevenuelist = {};

      countryarray.forEach(function(d) {
        var value = d[1].replace(/[^0-9\.]+/g, '');
        value = Number(value);
        newrevenuelist[d[0]] = +value;
      });

      var usarevenue = movie[movieid]["Domestic Total Gross"];
      usarevenue = usarevenue.replace(/[^0-9\.]+/g, '');

      // separate addition for USA
      newrevenuelist["USA"] = +usarevenue;

      // update revenue list
      revenuelist = newrevenuelist;

      var min = d3.min(Object.values(revenuelist))
      var max = d3.max(Object.values(revenuelist))

      // set the domain for the colors
      colScale.domain([min,max]);

      // repaint the countries
      features.selectAll("path")
        .style("fill", function (d,i) {
          return (revenuelist[d.properties.name] ? colScale(revenuelist[d.properties.name]) : "#ccc");
        });;
    }

    // Rounding function for values
    function valueFormat(d) {
      if (d > 1000000000) {
        return Math.round(d / 1000000000 * 10) / 10 + "B $";
      } else if (d > 1000000) {
        return Math.round(d / 1000000 * 10) / 10 + "M $";
      } else if (d > 1000) {
        return Math.round(d / 1000 * 10) / 10 + "K $";
      } else {
        return d;
      }
    }

    // Zoom to feature on click
    function clicked(d,i) {

      //Add any other onClick events here

      var x, y, k;

      if (d && centered !== d) {
        // Compute the new map center and scale to zoom to
        var centroid = path.centroid(d);
        var b = path.bounds(d);
        x = centroid[0];
        y = centroid[1];
        k = .8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        centered = d
      } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
      }

      // Highlight the new feature
      features.selectAll("path")
          .classed("highlighted",function(d) {
              return d === centered;
          })
          //.style("stroke-width", 1 / k + "px"); // Keep the border width constant

      //Zoom and re-center the map
      //Uncomment .transition() and .duration() to make zoom gradual
      features.transition()
          .duration(1000)
          .attr("transform","translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    }

    //Position of the tooltip relative to the cursor
    var tooltipOffset = {x: 5, y: -25};

    //Create a tooltip, hidden at the start
    function showTooltip(d) {
      moveTooltip();

        // add additional values to tooltip here, if wanted
        var html = "";

        html += "<div class=\"tooltip_kv\">";
        html += "<span class=\"tooltip_key\">";
        html += d.properties.name;    // adds the name of the country to tooltip
        html += "</span>";
        html += "<span class=\"tooltip_value\">";
        html += (revenuelist[d.properties.name] ? valueFormat(revenuelist[d.properties.name]) : "No data");     // adds the data if it exists
        html += "";
        html += "</span>";
        html += "</div>";

        tooltip.style("display","block").html(html);
    }

    //Move the tooltip to track the mouse
    function moveTooltip() {
      tooltip.style("top",(currentEvent.pageY+tooltipOffset.y)+"px")
          .style("left",(currentEvent.pageX+tooltipOffset.x)+"px");
    }

    //Create a tooltip, hidden at the start
    function hideTooltip() {
      tooltip.style("display","none");
    }



  }
}
</script>
