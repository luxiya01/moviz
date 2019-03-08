
const app = new Vue ({
    el: '#app',
    data: {
        search: '',
        selectedMovieID: "",
        selectedMovieName: "",
        selectedSortingOrder: null, // this holds the current sorting function, e.g. sort by alphabet or by rating
        currentScrollPosition: 0,
        updateCurrentScrollPosition: false,
        posterPlaceHolder: "poster-placeholder.jpg",
        isSelected: false,
        movieList : []
    },
    methods: {
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
            var aTotal = +a['Foreign Total Gross'].replace(/[^0-9.-]+/g,"") + +a['Domestic Total Gross'].replace(/[^0-9.-]+/g,"");
            var bTotal = +b['Foreign Total Gross'].replace(/[^0-9.-]+/g,"") + +b['Domestic Total Gross'].replace(/[^0-9.-]+/g,"");
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
                this.isSelected = true;
                this.search = this.selectedMovieName;
                this.currentScrollPosition = $(".wrapper").scrollTop();
            } else {
                //TODO: perhaps change this so that this happens when you click on a reset button instead of the entire card
                this.isSelected = false;
                this.selectedMovieName = "";
                this.search = "";
                this.updateCurrentScrollPosition = true;
            }
        },
        hasSearchBarChanged() {
            if(this.search !== this.selectedMovieName){
                this.isSelected = false;
                this.selectedMovieName = "";
            }
            this.currentScrollPosition = 0;
            this.updateCurrentScrollPosition = true;
        },
        hasSortingOrderChanged(sortingOrder) {
            if(sortingOrder === this.alphabeticOrder && this.selectedSortingOrder !== this.alphabeticOrder) {
                this.selectedSortingOrder = this.alphabeticOrder;
                this.currentScrollPosition = 0;
                this.updateCurrentScrollPosition = true;
            } else if(sortingOrder === this.ratingOrder && this.selectedSortingOrder !== this.ratingOrder) {
                this.selectedSortingOrder = this.ratingOrder;
                this.currentScrollPosition = 0;
                this.updateCurrentScrollPosition = true;
            } else if(sortingOrder === this.revenueOrder && this.selectedSortingOrder !== this.revenueOrder) {
                this.selectedSortingOrder = this.revenueOrder;
                this.currentScrollPosition = 0;
                this.updateCurrentScrollPosition = true;
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
            return "https://www.imdb.com/title/" + movie.link;
        }
    },
    computed: {
        filteredList() {
            /* Filter and Sort in Alphabetic order*/
            if(this.selectedSortingOrder === this.alphabeticOrder) {
                return this.movieList.filter(post => {
                    return post.title.toLowerCase().startsWith(this.search.toLowerCase());
                }).sort(this.selectedSortingOrder).slice(0,700) // sorts and slices it for display
            }
            /* Filter and Sort in Rating order*/
            else if(this.selectedSortingOrder === this.ratingOrder) {
                return this.movieList.filter(post => {
                    return post.title.toLowerCase().startsWith(this.search.toLowerCase()) && post.rating !== undefined;
                }).sort(this.selectedSortingOrder).slice(0,700)
                    // add the remaining movies that are without ratings
                    .concat(this.movieList.filter(post => {
                        return post.title.toLowerCase().startsWith(this.search.toLowerCase()) && post.rating === undefined;
                    }).sort(this.alphabeticOrder)) // sort alphabetically
            }
            /* Filter and Sort in Revenue order*/
            else if(this.selectedSortingOrder === this.revenueOrder) {
                return this.movieList.filter(post => {
                    return post.title.toLowerCase().startsWith(this.search.toLowerCase()) &&
                        (post['Domestic Total Gross'] !== undefined && post['Foreign Total Gross'] !== undefined);
                }).sort(this.selectedSortingOrder).slice(0,700)
                    // add the remaining movies that are missing either one or both of the total grosses
                    .concat(this.movieList.filter(post => {
                        return post.title.toLowerCase().startsWith(this.search.toLowerCase()) &&
                            (post['Domestic Total Gross'] === undefined || post['Foreign Total Gross'] === undefined)
                    }).sort(this.alphabeticOrder))  // sort alphabetically
            }
        }
    },

    /*this runs after data, methods and computed have been created
      we need to add the sorting function here to prevent exceptions*/
    created: function () {
        this.selectedSortingOrder = this.alphabeticOrder;
    },
    /*this is called after a data change */
    updated: function () {
        if(this.updateCurrentScrollPosition) {
            $('.wrapper').scrollTop(this.currentScrollPosition);
            this.updateCurrentScrollPosition = false;
        }
    }
});

// this function has to be outside the app object and refer to app.LISTNAME in order for it to work
$.getJSON("movieDataBase.json", function (data) {
    app.movieList = Object.values(data);
});

var a = "Riddick\u00a0(2013)            ";
a = a.replace(/\s+/g, '')

console.log(a);