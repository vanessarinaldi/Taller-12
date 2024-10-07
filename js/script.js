const JAPFLIX_URL = "https://japceibal.github.io/japflix_api/movies-data.json";
let moviesData = [];

let getJSONData = function(url) {
    let result = {};
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function(response) {
            result.status = 'ok';
            result.data = response;
            return result;
        })
        .catch(function(error) {
            result.status = 'error';
            result.data = error;
            return result;
        });
};

window.onload = function() {
    getJSONData(JAPFLIX_URL).then(function(result) {
        if (result.status === 'ok') {
            moviesData = result.data;
        } else {
            console.error("Error al cargar los datos de películas:", result.data);
        }
    });
};

document.getElementById("btnBuscar").addEventListener("click", function() {
    let query = document.getElementById("inputBuscar").value.toLowerCase();
    let filteredMovies = moviesData.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.genres.some(genre => typeof genre === 'string' && genre.toLowerCase().includes(query)) ||
        movie.tagline.toLowerCase().includes(query) || 
        movie.overview.toLowerCase().includes(query)
    );

    let lista = document.getElementById("lista");
    lista.innerHTML = ""; 

    filteredMovies.forEach(movie => {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        
        li.innerHTML = `
            <strong>${movie.title}</strong> <br> ${movie.tagline} <br>
            ${getStars(movie.vote_average)}
        `;
        
        li.addEventListener("click", () => showMovieDetails(movie));
        
        lista.appendChild(li);
    });
});


function getStars(vote_average) {
    const stars = Math.round(vote_average / 2); 
    let starHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starHTML += '<i class="fa fa-star" style="color: red;"></i>';
        } else {
            starHTML += '<i class="fa fa-star" style="color: gray;"></i>';
        }
    }
    return starHTML;
}


function showMovieDetails(movie) {
    const movieDetails = document.getElementById("movie-details");
    
    
    movieDetails.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(' - ')}</p>
        
        <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#movieInfo" aria-expanded="false" aria-controls="movieInfo">
            More
        </button>
        
        <div class="collapse" id="movieInfo">
            <div class="card card-body mt-2">
                <p><strong>Año:</strong> ${new Date(movie.release_date).getFullYear()}</p>
                <p><strong>Duración:</strong> ${movie.runtime} minutos</p>
                <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</p>
                <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</p>
            </div>
        </div>
    `;
    
   
    const offcanvas = new bootstrap.Offcanvas(document.getElementById("offcanvasTop"));
    offcanvas.show();
}
