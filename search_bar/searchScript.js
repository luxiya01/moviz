class Movie {
    constructor(title, year, link, director, img) {
        this.title = title;
        this.year = year;
        this.link = link;
        this.director = director;
        this.img = img;
    }
}

const app = new Vue ({
    el: '#app',
    data: {
        search: '',
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
        movieList : []
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
                return post.title.toLowerCase().includes(this.search.toLowerCase());
            }).sort(this.compare) // <-- added sorting!
        }
    }
});

// this function has to be outside the app object and refer to app.LISTNAME in order for it to work
$.getJSON("first_600_movies.json", function (data) {
    app.movieList = Object.values(data).slice(0,20);
    console.log(app.movieList);
});