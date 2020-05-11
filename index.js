"use strict";

class MovieList {
    constructor() {
        this.movies = document.getElementById('movies');
    }
    fetch() {
        async function loadData() {
            const results = document.getElementById("movies");
            const response = await fetch('https://ghibliapi.herokuapp.com/films');
            const data = await response.json();
            let htmlString = ``;
            data.forEach(movie => {
                htmlString += `<selection id="movies" class="movies">
                    <h1 id="title" name="title">${movie.title}</h1>
                    <li id="Year"> Year:  ${movie.release_date}</li>
                    <p> ${movie.description}</p>
                    </selection>
                    `;
                console.log(htmlString);
            });
            results.innerHTML = htmlString;
        }
        loadData();
    }
}
const movieList = new MovieList();
console.log(movieList);
movieList.fetch();

class Search {
    constructor() {
        //this.listElement = document.getElementById('movies');
        this.htmlElement = document.getElementById('movies');
    }
    myFunction() {
        var input, filter, movies, h1, title, i, txtValue;
        input = document.getElementById("mySearch");
        filter = input.value.toUpperCase();
        movies = document.getElementById("movies");
        h1 = movies.getElementsByTagName("title");
        for (i = 0; i < h1.length; i++) {
            title = h1[i].getElementsByTagName("title")[0];
            txtValue = title.textContent || title.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                h1[i].style.display = "";
            } else {
                h1[i].style.display = "none";
            }
        }
        /*https://www.w3schools.com/howto/howto_js_filter_lists.asp*/
    }
}
const search = new Search();
search.myFunction();



class Firebase {
    constructor(apiKey, projectId, storageBucket) {
        firebase.initializeApp({
            apiKey,
            projectId,
            storageBucket
        });
        this.database = firebase.firestore();
    }
    convertQuerySnapshotToRegularArray(querySnapshot) {
        return querySnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
        }));
    }
    get postsCollection() {
        return this.database.collection("reviews");
    }
}
const firebaseInstance = new Firebase('AIzaSyCCFDd6qbVKq3pLltPvLtb1zB-ROTyBTVM', 'werkstuk-sophiemoerman', /*'gs://werkcollege-sophiemoerman.appspot.com'*/ );
console.log(firebase);



class Submit {
    constructor() {
        this.formElement = document.getElementById('reviews');
        this.inputElement = document.getElementById('input');
        this.bindEvents();
    }
    uploadData() {
        firebaseInstance.postsCollection.add({
            review: this.inputElement.value,
            createdAt: new Date(),
        });
    }
    clearForm() {
        this.inputElement.value = '';
    }
    submitForm(event) {
        event.preventDefault();
        this.uploadData();
        this.clearForm();
    }
    bindEvents() {
        this.formElement.addEventListener('submit', this.submitForm.bind(this));
    }
}
new Submit();




class Comments {
    constructor() {
        this.htmlElement = document.getElementById('comments');
    }
    sortByTimeStamp(a, b) {
        if (a.createdAt < b.createdAt) {
            return 1;
        }
        if (a.createdAt > b.createdAt) {
            return -1;
        }
    }
    render() {
        const convertQuerySnapshotToRegularArray = (querySnapshot) => querySnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
        }));
        const database = firebase.firestore();
        const reviewsCollection = database.collection("reviews");
        reviewsCollection.onSnapshot((querySnapshot) => {
            let htmlString = '';
            const commentsData = convertQuerySnapshotToRegularArray(querySnapshot);
            commentsData.sort(this.sortByTimeStamp);
            commentsData.forEach((commentData) => {
                const commentInstance = new Comment(commentData);
                htmlString += commentInstance.htmlString;
            });
            this.htmlElement.innerHTML = htmlString;
        });
    }
}
const comments = new Comments();
comments.render();




class Comment {
    constructor(data) {
        this.data = data;
    }
    get htmlString() {
        return `
      <section id="${this.data.id}" class="comment">
        <p>${this.data.review}</p>        
      </section>
    `;
    }
}