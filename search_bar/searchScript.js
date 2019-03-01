class Post {
    constructor(title, link, director, img) {
        this.title = title;
        this.link = link;
        this.author = director;
        this.img = img;
    }
}

const app = new Vue ({
    el: '#app',
    data: {
        search: '',
        postList : [
            new Post(
                'Alita: Battle Angel',
                'https://www.imdb.com/title/tt0437086',
                'Chris',
                'https://m.media-amazon.com/images/M/MV5BNzVhMjcxYjYtOTVhOS00MzQ1LWFiNTAtZmY2ZmJjNjIxMjllXkEyXkFqcGdeQXVyNTc5OTMwOTQ@._V1_.jpg'
            ),
            new Post(
                'Wall-E',
                'https://www.imdb.com/title/tt0910970',
                'Tim',
                'https://m.media-amazon.com/images/M/MV5BMjExMTg5OTU0NF5BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_SY1000_CR0,0,674,1000_AL_.jpg'
            ),
            new Post(
                'The Shawshank Redemption',
                'https://www.imdb.com/title/tt0111161',
                'Sam',
                'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
            ),
            new Post(
                'Schindler\'s List',
                'https://www.imdb.com/title/tt0108052',
                'Rachel',
                'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_CR0,0,666,1000_AL_.jpg'
            ),
            new Post(
                'Toy Story',
                'https://www.imdb.com/title/tt0114709',
                'Chris',
                'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SY1000_SX670_AL_.jpg'
            ),
            new Post(
                'Avengers: Infinity War',
                'https://www.imdb.com/title/tt4154756',
                'Tim',
                'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SY1000_CR0,0,674,1000_AL_.jpg'
            ),
            new Post(
                'Black Panther',
                'https://www.imdb.com/title/tt1825683',
                'A. A. Ron',
                'https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_SY1000_CR0,0,674,1000_AL_.jpg'
            ),
            new Post(
                'Oldboy',
                'https://www.imdb.com/title/tt0364569',
                'Alex',
                'https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_.jpg'
            ),
            new Post(
                'The Imitation Game',
                'https://www.imdb.com/title/tt2084970',
                'Chuck',
                'https://m.media-amazon.com/images/M/MV5BOTgwMzFiMWYtZDhlNS00ODNkLWJiODAtZDVhNzgyNzJhYjQ4L2ltYWdlXkEyXkFqcGdeQXVyNzEzOTYxNTQ@._V1_SY999_CR0,0,670,999_AL_.jpg'
            ),
        ]
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
        }
    },
    computed: {
        filteredList() {
            return this.postList.filter(post => {
                return post.title.toLowerCase().includes(this.search.toLowerCase());
            }).sort(this.compare) // <-- added sorting!
        }
    }
});