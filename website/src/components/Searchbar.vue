<template>

<div id="searchbar">
    <div class="search-wrapper">
        <input type="text" v-model="search" placeholder="Search movie title.." v-on:keydown="hasSearchBarChanged"/>
    </div>

    <!-- > Sorting Options <-->
    <div class="options">
        <label class="checkcontainer">
            A-Z
            <input type="radio" name="sorting" v-on:click="hasSortingOrderChanged(alphabeticOrder)" checked>
            <span class="radiobtn"></span>
        </label>
        <label class="checkcontainer">
            Rating
            <input type="radio" name="sorting" v-on:click="hasSortingOrderChanged(ratingOrder)">
            <span class="radiobtn"></span>
        </label>
        <label class="checkcontainer">
            Revenue
            <input type="radio" name="sorting" v-on:click="hasSortingOrderChanged(revenueOrder)">
            <span class="radiobtn"></span>
        </label>
    </div>

    <div class="wrapper">
        <virtual-list :size="80" :remain="5" ref="list">
            <div class="card" v-for="movie in filteredList" v-on:click="selectMovie(movie)" v-bind:key="movie.id">
                <div class="topCard">
                    <img v-bind:src="getImage(movie)"/>
                    <p>
                        <b>{{movie.title}}</b>
                        <br/>
                          <svg v-if="movie.rating" class="stars" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path id="starPath" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                         {{movie.rating}}<br/>
                    </p>
                </div>
                <!-- ><transition name="roll"><-->
                <div class="bottomCard" v-show="isSelected && selectedMovieName === movie.title">
                    <p >
                    <b>Rating</b>: {{movie.rating}}<br/>
                    <b>Budget</b>: {{selectedMovieBudgetString}}<br/>
                    <b>Total Revenue</b>: {{selectedMovieTotalRevenueString}}<br/>
                    <b>Release Date</b>: {{movie.release_date}}<br/>
                    <b>Production Country</b>: <span v-for="country in movie.country" v-bind:key="country"> {{country+", "}}</span><br/>
                    <b>Genres</b>: <span v-for="genres in movie.genre" v-bind:key="genres"> {{genres+", "}}</span> <br/>
                    <a v-bind:href="getLink(movie)" target="_blank"> {{movie.title}} </a> 
                    </p>

                </div>
                <!-- ></transition><-->
            </div>
        </virtual-list>
    </div>
</div>
</template>

<script>
import virtualList from 'vue-virtual-scroll-list'
import JQuery from 'jquery'
let $=JQuery

class Movie {
    constructor(title, year, link, director, img) {
        this.title = title;
        this.year = year;
        this.link = link;
        this.director = director;
        this.img = img;
    }
}
export default {
    components: {
        'virtual-list': virtualList,
    },
    name: 'Searchbar',
    props: {
        movieList : Array
    },
    data() {
        return {
            search: '',
            selectedMovieID: "",
            selectedMovieName: "",
            selectedMovieBudgetString: "",
            selectedMovieTotalRevenueString: "",
            selectedSortingOrder: null, // this holds the current sorting function, e.g. sort by alphabet or by rating
            posterPlaceHolder: "poster-placeholder.jpg",
            isSelected: false,
        }
    },
    watch: {
        filteredList: function() {
            const vList = this.$refs.list;
            vList.forceRender();
        }
    },
    methods: {
        // Rounding function for values
        valueFormat: function(d) {
              if (d > 1000000000) {
                return " $" + Math.round(d / 1000000000 * 10) / 10 + " B";
              } else if (d > 1000000) {
                return " $" + Math.round(d / 1000000 * 10) / 10 + " M";
              } else if (d > 1000) {
                return " $" + Math.round(d / 1000 * 10) / 10 + " K";
              } else if (d < 100) {
                return " $" + d.toFixed(2);
              } else {
                return d;
              }
        },
        // these three functions all sort in ascending order
        alphabeticOrder : function (a, b) {
            if(a.title < b.title) {
                return -1;
            } else if(a.title > b.title) {
                return 1;
            } else {
                return 0;
            }
        },
        ratingOrder : function (a, b) {
            if(+a.rating < +b.rating) {
                return 1;
            } else if(+a.rating > +b.rating) {
                return -1;
            } else {
                return 0;
            }
        },
        revenueOrder : function (a, b) {
            var aTotal = a.foreign_total_gross;
            var bTotal = b.foreign_total_gross;
            if(aTotal < bTotal) {
                return 1;
            } else if(aTotal > bTotal) {
                return -1;
            } else {
                return 0;
            }
        },
        selectMovie : function (movie) {
            if(!this.isSelected) {
                this.selectedMovieID = movie.id;
                this.selectedMovieName = movie.title;
                this.selectedMovieBudgetString = this.valueFormat(movie.budget);
                this.selectedMovieTotalRevenueString = this.valueFormat(movie.foreign_total_gross + movie.domestic_total_gross);
                this.isSelected = true;
                this.search = this.selectedMovieName;
                this.$emit('movie-selection', movie.id);
            } else {
                //TODO: perhaps change this so that this happens when you click on a reset button instead of the entire card
                this.isSelected = false;
                this.selectedMovieName = "";
                this.search = "";

                this.$emit('reset');
            }
        },
        hasSearchBarChanged() {
            if(this.search !== this.selectedMovieName){
                this.isSelected = false;
                this.selectedMovieName = "";
            }
        },
        hasSortingOrderChanged(sortingOrder) {
            if(sortingOrder === this.alphabeticOrder && this.selectedSortingOrder !== this.alphabeticOrder) {
                this.selectedSortingOrder = this.alphabeticOrder;
            } else if(sortingOrder === this.ratingOrder && this.selectedSortingOrder !== this.ratingOrder) {
                this.selectedSortingOrder = this.ratingOrder;
            } else if(sortingOrder === this.revenueOrder && this.selectedSortingOrder !== this.revenueOrder) {
                this.selectedSortingOrder = this.revenueOrder;
            }
        },
        getImage(movie) {
            if(movie.img !== "") {
                return movie.img;
            }
            else {
                return this.posterPlaceHolder;
            }
        },
        getLink(movie) {
            return "https://www.imdb.com/" + movie.link;
        }
    },
    computed: {
        filteredList() {
            if (this.isSelected) {
                return this.movieList.filter(post => {
                    if (post.title.startsWith('World')) {
                        console.log("search: " + this.search + "; post: " + post.title)
                    }
                    return post.title.toLowerCase() == this.search.toLowerCase();
                })
            }
            /* Filter and Sort in Alphabetic order*/
            if(this.selectedSortingOrder === this.alphabeticOrder) {
                return this.movieList.filter(post => {
                    return post.title.toLowerCase().startsWith(this.search.toLowerCase());
                }).sort(this.selectedSortingOrder) // sorts and slices it for display
            }
            /* Filter and Sort in Rating order*/
            else if(this.selectedSortingOrder === this.ratingOrder) {
                return this.movieList.filter(post => {
                    return post.title.toLowerCase().startsWith(this.search.toLowerCase()) && post.rating !== undefined;
                }).sort(this.selectedSortingOrder)
                    // add the remaining movies that are without ratings
                    .concat(this.movieList.filter(post => {
                        return post.title.toLowerCase().startsWith(this.search.toLowerCase()) && post.rating === undefined;
                    }).sort(this.alphabeticOrder)) // sort alphabetically
            }
            /* Filter and Sort in Revenue order*/
            else if(this.selectedSortingOrder === this.revenueOrder) {
                return this.movieList.filter(post => {
                    return post.title.toLowerCase().startsWith(this.search.toLowerCase()) &&
                        (post['domestic_total_gross'] !== undefined && post['foreign_total_gross'] !== undefined);
                }).sort(this.selectedSortingOrder)
                    // add the remaining movies that are missing either one or both of the total grosses
                    .concat(this.movieList.filter(post => {
                        return post.title.toLowerCase().startsWith(this.search.toLowerCase()) &&
                            (post['domestic_total_gross'] === undefined || post['foreign_total_gross'] === undefined)
                    }).sort(this.alphabeticOrder))  // sort alphabetically
            }
        }
    },

    /*this runs after data, methods and computed have been created
      we need to add the sorting function here to prevent exceptions*/
    created: function () {
        this.selectedSortingOrder = this.alphabeticOrder;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.stars{
    height: 1em;
    margin-top: -.4em;
    fill:gold
}
#starPath{
    stroke: none;
    fill:gold

}
body {
    font-family: Verdana, Arial, "sans-serif";
}
div#searchbar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
div#searchbar .search-wrapper {
    position: relative;
}

div#searchbar .search-wrapper input {
    padding: 4px 12px;
    width: 20em;
    color: rgba(0, 0, 0, .70);
    /*border: 1px solid rgba(0, 0, 0, .12);*/
    transition: 0.15s all ease-in-out;
    background: white;
}
div#searchbar .search-wrapper input:focus {
    outline: none;
    transform: scale(1.05);
}
div#searchbar .search-wrapper input:focus + label {
    font-size: 10px;
    transform: translateY(-24px) translateX(-12px);
}
div#searchbar .search-wrapper input::-webkit-input-placeholder {
    font-size: 12px;
    color: rgba(0, 0, 0, .50);
    font-weight: 100;
}

div#searchbar .wrapper {
    display: block;
    
    width: 25em;
    height: 70vh;
    overflow: auto;
    margin-top:12px;
    padding-top: 0;
    /*This can be removed when finished*/
    /*border-style: solid;
    border-width: 1px;
    border-color: #d9d9d9;*/
}
div#searchbar .card {
    box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
    /*max-width: 124px;*/
    
    margin-bottom: 12px;
    transition: 0.15s all ease-in-out;
    text-align: left;
    color: black;
    border: none
}
div#searchbar .card:hover {
    /*transform: scale(1.1);
    background-color: #fff0f2;*/
      filter: brightness(85%);
}
div#searchbar .card .topCard{
    text-decoration: none;
    
    /*padding: 12px;*/
    color: white;
    font-size: 1em;
    /*display: flex;*/
    flex-direction: column;
    align-items: center;
    height: 6em;
    cursor: pointer;
    background-color: gray
    
}

.topCard p{
    position: absolute;
    float: left;
    margin: .5em 0 0 5em;
}
.topCard p::first-letter{
    text-transform: uppercase;
}


div#searchbar .card img {
    height: inherit;
    float: left;
}

div #searchbar .card .bottomCard {
    margin: 1em;
}

.roll-enter-active, .roll-leave-active {
    transition: opacity .5s;
}
.roll-enter, .roll-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

/* ------ Sorting options ------ */

#searchbar .options {
    margin: 10px 0;
}

/* Custom labels: the container */
.checkcontainer {
    display: inline;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 15px;
    -webkit-user-select: none; /* Chrome, Opera, Safari */
    -moz-user-select: none; /* Firefox 2+ */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
}
/* Hide the browser's default checkbox */
.checkcontainer input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}
/* Create a custom radio button */
.radiobtn{
    position: absolute;
    top: 2px;
    left: 14px;
    height: 15px;
    width: 15px;
    background-color: #eee;
    border-radius: 50%;
}
/* On mouse-over, add a grey background color */
.checkcontainer:hover input ~ .radiobtn{
    background-color: #ccc;
}
/* When the radio button is checked, add a blue background */
.checkcontainer input:checked ~ .radiobtn{
    background-color: #2196F3;
}
/* Create the indicator (the dot/circle - hidden when not checked) */
.radiobtn:after {
    content: "";
    position: absolute;
    display: none;
}
/* Show the indicator (dot/circle) when checked */
/*.checkcontainer input:checked ~ .radiobtn:after {
    display: block;
}*/
/* Style the indicator (dot/circle) */
.checkcontainer .radiobtn:after {
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
}
</style>
