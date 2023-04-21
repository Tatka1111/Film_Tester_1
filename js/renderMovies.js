import loaderToggle from "./spinner.js";
const BASE_URL = "https://api.themoviedb.org/3/";
const container = document.querySelector(".movie__container");
let movieId = [];
let totalPages = 0;
let page = 1;

async function fetchFilms(page) {
  const response = await fetch(
    `${BASE_URL}trending/movie/week?api_key=4b14499a7a4d8e1fd5ccb6a9c42a98e1&page=${page}`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}

function setFilms() {
  loaderToggle();
  fetchFilms(page)
    .then((movie) => {
      renderMovies(movie);
      loaderToggle();
    })
    .catch((err) => {
      //console.log(err);
      loaderToggle();
    });
}

async function fetchGenres() {
  const response = await fetch(
    `${BASE_URL}genre/movie/list?api_key=5d5fbc20666787ca7b4a0d9d71c08715`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}

function setGenres() {
  fetchGenres()
    .then((id) => {
      return (movieId = id.genres);
    })
    .catch((err) => {
      console.log(err);
    });
}
setGenres();
setFilms();
function renderMovies(movie) {
  totalPages = movie.total_pages;
  movie.results.forEach(
    ({ id, original_title, poster_path, release_date, genre_ids }) => {
      let movieGenre = movieId
        .filter((genre) => genre_ids.includes(genre.id))
        .map((genre) => genre.name)
        .join(", ");
      let poster = "";
      if (poster_path) {
        poster = `https://image.tmdb.org/t/p/w500${poster_path}`;
      } else {
        poster = "./images/placeholder/poster-placeholder.png";
      }
      let relaseYear = release_date?.slice(0, 4) ?? "";
      container.innerHTML += `<div class="movies-cart">
      <ul class="movies-list">
      <li class="movies-item" data-id="${id}">
      <div class="movies-poster">
      <img class="movies-image" src=${poster} alt="${original_title}"/>
      </div>

  <div class="description">
    <h2 class="description-title">${original_title}</h2>
    <p class="description-container">
      <span class="description-info">${movieGenre} |
      ${relaseYear}</span>
    </p>
  </div>
</li>
</ul>
</div>`;
    }
  );
}

export { renderMovies, setFilms, fetchFilms, totalPages };
