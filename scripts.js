let originalResults = [];
let results = [];

const domEvent = document.addEventListener("DOMContentLoaded", () => {
    async function getResponse() {
        const res = await fetch("https://swapi.dev/api/films/?format=json");
        const data = await res.json();
        // const apiKey = '97d9730c';
        // const moreData = await fetch ('http://www.omdbapi.com/?apikey=97d9730c&t=A+New+Hope&y=1977');
        // const moreData1 = await moreData.json();
        const res1 = await fetch("https://swapi.dev/api/films/?format=json")
            .then(result => result.json()).
            then(result => result.results.map(result => (getAdditionalData(result.title, result.release_date))));

        const res2 = await Promise.all(res1);
        originalResults = data.results;
        originalResults = originalResults.map(title => {
            const merged = res2.find(result => result.Title.includes(title.title));
            return { ...merged, ...title }
        });
        results = originalResults;
        renderMovies();
    }

    async function getAdditionalData(title, date) {
        const res = await fetch(`http://www.omdbapi.com/?apikey=97d9730c&t=${title}&y=${new Date(date).getFullYear()}`);
        const data = await res.json();
        return data;
    }

    // document.querySelector("#search-input").addEventListener("input", (event) => {
    //     if (event.target.value.trim() === "") {
    //         results = originalResults;
    //         renderMovies();
    //     } else {
    //         const searchTerm = event.target.value.trim().toLowerCase();
    //         results = originalResults.filter(({ title, release_date, episode_id }) => {
    //             return (
    //                 title.toLowerCase().indexOf(searchTerm) !== -1 ||
    //                 release_date.toLowerCase().indexOf(searchTerm) !== -1 ||
    //                 episode_id.toString().indexOf(searchTerm) !== -1
    //             );
    //         });
    //         renderMovies();
    //     }
    // });

    getResponse().then(() => {
        renderMovies();
    });

    document.querySelector("#search-input").addEventListener("input", (event) => {
        if (event.target.value.trim() === "") {
            results = originalResults;
            renderMovies();
        } else {
            const searchTerm = event.target.value.trim().toLowerCase();
            results = originalResults.filter(({ title, release_date, episode_id }) => {
                return (
                    title.toLowerCase().indexOf(searchTerm) !== -1 ||
                    release_date.toLowerCase().indexOf(searchTerm) !== -1 ||
                    episode_id.toString().indexOf(searchTerm) !== -1
                );
            });
            renderMovies();
        }
    });

});

function renderMovies() {
    const list = document.querySelector(".movie-list");
    list.innerHTML = "";

    results.forEach(({ episode_id, Title, release_date, opening_crawl, Ratings, Director }) => {
        const row = document.createElement("div");
        row.classList.add("col");
        row.classList.add("rowsetup");

        const episodeIdElement = document.createElement("span");
        episodeIdElement.classList.add("col-lg-2");
        episodeIdElement.textContent = `EPISODE ${episode_id}`;

        const titleElement = document.createElement("span");
        titleElement.classList.add("col-lg-4");
        titleElement.textContent = Title.replace("Star Wars:", '');

        const releaseDateElement = document.createElement("span");
        releaseDateElement.classList.add("col-lg-2");
        releaseDateElement.textContent = release_date;
       
        const ratingAverage = Ratings.map(rating => (rating.Source === 'Internet Movie Database' ? parseInt(rating.Value) / 3 : parseInt(rating.Value) / 30)).reduce((acc, cur) => acc + cur, 0);
        console.log(ratingAverage);
        const starContainer = document.createElement("span");
        starContainer.classList.add("col-lg-3");
        getStars(starContainer);
        row.append(episodeIdElement, titleElement, starContainer, releaseDateElement);
        list.appendChild(row);

        // Add click event listener to movie item
        row.addEventListener("click", () => {
            // Find the corresponding movie data from originalResults
            const movie = originalResults.find((m) => m.episode_id === episode_id);

            // Update the right panel with movie information
            const rightPanel = document.querySelector(".right");
            rightPanel.innerHTML = `
          <div><h3>${(movie.Title).replace("Star Wars:", '')}</h3></div>
          <div><img src=${movie.Poster} style="height: 20%;width: 20%"></img>
          <span style="float:right; width:78%">${movie.opening_crawl}</span></div>
          <div> Directed by: ${Director}</div>
          <div id="avg-rtg"> Average rating:</div>
          <div>
          <span class="badge badge-pill badge-light">${Ratings[0].Source}: ${Ratings[0].Value}</span>
          <span class="badge badge-pill badge-light">${Ratings[1].Source}: ${Ratings[1].Value}</span>
          <span class="badge badge-pill badge-light">${Ratings[2].Source}: ${Ratings[2].Value}</span></div>
          
          
        `;
            getStars(document.querySelector("#avg-rtg"));
        });

        function getStars(container) {
            for (let i = 0; i < ratingAverage; i++) {
                const star = document.createElement("i");
                star.classList.add("fa");
                star.classList.add("fa-star");
                star.classList.add("checked");
                container.appendChild(star);
            }
    
            for (let i = 0; i < (9-ratingAverage); i++) {
                const star = document.createElement("i");
                star.classList.add("fa");
                star.classList.add("fa-star-o");
                container.appendChild(star);
            }
    
        }
    });
}


function sortById() {
    results.sort((a, b) => (parseInt(a.episode_id) > parseInt(b.episode_id)) ? 1 : (parseInt(b.episode_id) > parseInt(a.episode_id) ? -1 : 0))
    renderMovies();
}

function sortByTitle() {
    results.sort((a, b) => ((a.title) > (b.title)) ? 1 : ((b.title) > (a.title) ? -1 : 0))
    renderMovies();
}

function sortByDate() {
    results.sort((a, b) => (new Date(a.release_date
    ) - new Date(b.release_date
    )));
    renderMovies();
}