<template>
<div id="searchbar">
    <div class="search-wrapper">
        <input type="text" v-model="search" placeholder="Search movie title.." v-on:keydown="hasSearchBarChanged"/>
        <label>Search movie:</label>
    </div>
    <div class="wrapper">
        <div class="card" v-for="movie in filteredList" v-on:click="selectMovie(movie)">
            <div class="topCard">
                <img v-bind:src="postList[0].img"/>
                <p>{{movie.title}}</p>
            </div>
            <transition name="roll">
                <div class="bottomCard" v-show="isSelected && selectedMovieName === movie.title">
                    <p>Director: ??</p>
                    <p>Rating: {{movie.rating}}</p>
                    <p>Budget: {{movie.Budget}}</p>
                    <p>Production Country: {{movie.Country}}</p>
                    <p>Genres: {{movie.genres}}</p>
                    <p><a v-bind:href="'https://www.imdb.com/title/' + movie.link" target="_blank"> {{movie.title}} </a> </p>

                </div>
            </transition>
        </div>
    </div>
</div>
</template>

<script>
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
    name: 'Searchbar',
    props: {
        movieList : []
    },
    data() {
        return {
            search: "",
            selectedMovieID: "",
            selectedMovieName: "",
            isSelected: false,
            postList : [
                new Movie(
                    'Alita: Battle Angel',
                    '2018',
                    'https://www.imdb.com/title/tt0437086',
                    'Chris',
                    'https://m.media-amazon.com/images/M/MV5BNzVhMjcxYjYtOTVhOS00MzQ1LWFiNTAtZmY2ZmJjNjIxMjllXkEyXkFqcGdeQXVyNTc5OTMwOTQ@._V1_.jpg'
                ),
                new Movie(
                    'Wall-E',
                    '2008',
                    'https://www.imdb.com/title/tt0910970',
                    'Tim',
                    'https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SY1000_CR0,0,674,1000_AL_.jpg'
                ),
                new Movie(
                    'The Shawshank Redemption',
                    '2018',
                    'https://www.imdb.com/title/tt0111161',
                    'Sam',
                    'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
                ),
                new Movie(
                    'Schindler\'s List',
                    '2018',
                    'https://www.imdb.com/title/tt0108052',
                    'Rachel',
                    'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_CR0,0,666,1000_AL_.jpg'
                ),
                new Movie(
                    'Toy Story',
                    '2018',
                    'https://www.imdb.com/title/tt0114709',
                    'Chris',
                    'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SY1000_SX670_AL_.jpg'
                ),
                new Movie(
                    'Avengers: Infinity War',
                    '2018',
                    'https://www.imdb.com/title/tt4154756',
                    'Tim',
                    'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SY1000_CR0,0,674,1000_AL_.jpg'
                ),
                new Movie(
                    'Black Panther',
                    '2018',
                    'https://www.imdb.com/title/tt1825683',
                    'A. A. Ron',
                    'https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_SY1000_CR0,0,674,1000_AL_.jpg'
                ),
                new Movie(
                    'Oldboy',
                    '2018',
                    'https://www.imdb.com/title/tt0364569',
                    'Alex',
                    'https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_.jpg'
                ),
                new Movie(
                    'The Imitation Game',
                    '2018',
                    'https://www.imdb.com/title/tt2084970',
                    'Chuck',
                    'https://m.media-amazon.com/images/M/MV5BOTgwMzFiMWYtZDhlNS00ODNkLWJiODAtZDVhNzgyNzJhYjQ4L2ltYWdlXkEyXkFqcGdeQXVyNzEzOTYxNTQ@._V1_SY999_CR0,0,670,999_AL_.jpg'
                ),
            ],

        }
    },
    methods: {
        compare : function (a,b) {
            if(a.title < b.title) {
                return -1;
            } else if(a.title > b.title) {
                return 1;
            } else {
                return 0;
            }
        },
        selectMovie : function (movie) {
            if(!this.isSelected) {
                this.selectedMovieID = movie.id;
                this.selectedMovieName = movie.title;
                this.isSelected = true;
                this.search = this.selectedMovieName;
            } else {
                //TODO: perhaps change this so that this happens when you click on a reset button instead of the entire card
                this.isSelected = false;
                this.selectedMovieName = "";
                this.search = "";
            }
        },
        hasSearchBarChanged() {

            if(this.search !== this.selectedMovieName){
                this.isSelected = false;
                this.selectedMovieName = "";
            }
        }
    },
    computed: {
        filteredList() {
            return this.movieList.filter(post => {
                console.log(post);
                return post.title.toLowerCase().includes(this.search.toLowerCase());
            }).sort(this.compare) // <-- added sorting!
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html, body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 16px;
    margin-bottom: 16px;
}
div#app {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
div#app .search-wrapper {
    position: relative;
}
div#app .search-wrapper label {
    position: absolute;
    font-size: 12px;
    color: rgba(0, 0, 0, .50);
    top: 8px;
    left: 12px;
    z-index: -1;
    transition: 0.15s all ease-in-out;
}
div#app .search-wrapper input {
    padding: 4px 12px;
    color: rgba(0, 0, 0, .70);
    border: 1px solid rgba(0, 0, 0, .12);
    transition: 0.15s all ease-in-out;
    background: white;
}
div#app .search-wrapper input:focus {
    outline: none;
    transform: scale(1.05);
}
div#app .search-wrapper input:focus + label {
    font-size: 10px;
    transform: translateY(-24px) translateX(-12px);
}
div#app .search-wrapper input::-webkit-input-placeholder {
    font-size: 12px;
    color: rgba(0, 0, 0, .50);
    font-weight: 100;
}




div#app .wrapper {
    display: block;
    width: 390px;
    height: 600px;
    overflow: auto;
    /*flex-wrap: wrap;*/
    padding-top: 12px;
    /*This can be removed when finished*/
    border-style: solid;
    border-width: 1px;
    border-color: #d9d9d9;

}
div#app .card {
    box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
    /*max-width: 124px;*/
    margin: 12px 0;
    transition: 0.15s all ease-in-out;
    text-align: left;
}
div#app .card:hover {
    /*transform: scale(1.1);*/
    background-color: #d8ffe8;
}
div#app .card .topCard{
    text-decoration: none;
    /*padding: 12px;*/
    color: #03a9f4;
    font-size: 24px;
    /*display: flex;*/
    flex-direction: column;
    align-items: center;
    height: 150px;
    cursor: pointer;
}
div#app .card img {
    height: inherit;
    float: left;
}

div #app .card .bottomCard {

}


.roll-enter-active, .roll-leave-active {
    transition: opacity .5s;
}
.roll-enter, .roll-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
