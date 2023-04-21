import { renderMovies, setFilms } from "./renderMovies.js";
import { clearPaginationMarkup } from "./pagination.js";
import loaderToggle from "./spinner.js";

const BASE_URL = "https://api.themoviedb.org/3/";
const container = document.querySelector(".movie__container");
const input = document.querySelector('input[name="searchQuery"]');
const form = document.querySelector("#search-form");
const searchResult = document.querySelector(".search__result");

searchResult.style.display = "none";

async function fetchSearchFilms(title) {
  const response = await fetch(
    `${BASE_URL}search/movie?api_key=4b14499a7a4d8e1fd5ccb6a9c42a98e1&query=${title}`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}
function searchFilms() {
  loaderToggle();
  fetchSearchFilms(input.value)
    .then((movie) => {
      loaderToggle();
      if (movie.results.length === 0) {
        searchResult.style.display = "block";
        searchResult.textContent = "Search result not successful. Enter the correct movie name and try again";
      } else {
        container.innerHTML = "";
        renderMovies(movie);
      }
    })
    .catch((err) => {
      console.log(err);
      loaderToggle();
    });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearPaginationMarkup();
  if (input.value === "") {
    container.innerHTML = "";
    setFilms();
    searchResult.style.display = "none";
  } else {
    searchFilms();
    searchResult.style.display = "none";
  }
});
