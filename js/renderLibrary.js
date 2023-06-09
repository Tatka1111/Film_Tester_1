import loaderToggle from "./spinner.js";
const libraryContainer = document.querySelector(".library__container");
const watchedBtn = document.querySelector(".watched");
const queuedBtn = document.querySelector(".queue");
const modalContent = document.querySelector(".modal-view");
const galleryContainer = document.querySelector(".library__container");
const modal = document.querySelector("#myModal");
const closeBtn = document.querySelector(".close");
const section = document.querySelector(".library__gallery")

async function fetchMovie(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=4b14499a7a4d8e1fd5ccb6a9c42a98e1`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}

function renderMovieItem(movie) {
  const { id, poster_path, genres, original_title, release_date } = movie;
  let relaseYear = release_date?.slice(0, 4) ?? "";
  let gen = genres
    .map((genre) => genre.name)
    .slice(0, 3)
    .join(", ");

  let poster = "";
  if (poster_path) {
    poster = `https://image.tmdb.org/t/p/w500${poster_path}`;
  } else {
    poster = "./images/placeholder/poster-placeholder.png";
  }
  libraryContainer.innerHTML += `<div class="movies-cart">
      <ul class="movies-list">
      <li class="movies-item" data-id="${id}">
      <div class="movies-poster">
      <img class="movies-image" src=${poster} alt="${original_title}"/>
      </div>

  <div class="description">
    <h2 class="description-title">${original_title}</h2>
    <p class="description-container">
      <span class="description-info"> ${gen} |
      ${relaseYear}</span>
    </p>
  </div>
</li>
</ul>
</div>`;
}

//Event opening modal window
galleryContainer.addEventListener("click", selectMovieCart);

function selectMovieCart(event) {
  event.preventDefault();
  //function that disable modal window if you click in the gallerryContainer but not for movie cart
  if (event.target.nodeName === "DIV") {
    modal.style.display = "none";
  } else {
    modal.style.display = "block";

    async function fetchMoiveId() {
      let id = `${event.target.parentNode.parentNode.dataset.id}`;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=5d5fbc20666787ca7b4a0d9d71c08715`
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    }

    function setMovieCard() {
      loaderToggle();
      fetchMoiveId()
        .then((id) => {
          renderMovieCartinLibrary(id);
          loaderToggle();
        })
        .catch((err) => {
          console.log(err);
          loaderToggle();
        });
    }

    setMovieCard();

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      modalContent.innerHTML = "";
    });
  }
}

function renderMovieCartinLibrary(movie) {
  const {
    poster_path,
    genres,
    vote_average,
    vote_count,
    popularity,
    original_title,
    overview,
  } = movie;
  let gen = genres
    .map((genre) => genre.name)
    .slice(0, 3)
    .join(", ");

  let poster = "";
  if (poster_path) {
    poster = `https://image.tmdb.org/t/p/w500${poster_path}`;
  } else {
    poster = "./images/placeholder/poster-placeholder.png";
  }
  modalContent.innerHTML = `<div class="modal__cartContainer">
  <div class="modal__movie-content">
  <div class="modal__poster">
  <img class="modal__images" src=${poster} alt="Poster of: ${original_title}"/>
  </div>
  <div class="modal__description">
  <h2 class="modal__header">${original_title}</h2>
  <div class="modal__scoring">
  <ul class="modal__list">
  <li class="modal__list-item">Vote / Votes<span class="modal__category-value"><span class="vote-average">${vote_average}</span> / ${vote_count}</span></li>
  <li class="modal__list-item">Popularity<span class="modal__category-value">${popularity.toFixed(
    1
  )}</span></li>
  <li class="modal__list-item">Orginal Title<span class="modal__category-value">${original_title}</span></li>
  <li class="modal__list-item">Genre<span class="modal__category-value">${gen}</span></li>
  </ul>
  </div>
  <h4 class="modal__about">About</h4>
  <p class="modal__overview">${overview}</p>
  <div class="modal__buttons-container">
  
  </div>
  </div>
  </div>
  </div>`;
}

// function closing modal window when user click outside the modal
window.addEventListener("click", (ev) => {
  if (ev.target === modal) {
    modal.style.display = "none";
    modalContent.innerHTML = "";
  }
});

window.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") {
    modal.style.display = "none";
    modalContent.innerHTML = "";
  }
});

function renderMovieID(id) {
  loaderToggle();
  fetchMovie(id).then((movie) => {
    renderMovieItem(movie);
    renderMovieCartinLibrary(movie);
    loaderToggle();
  });
}

let savedWatchedMovies = localStorage.getItem("watchedMovieIDs");
function getwatchedMovies() {
  libraryContainer.innerHTML = "";
  let watchedMovies = JSON.parse(savedWatchedMovies);
  if (watchedMovies === null) {
    section.innerHTML = `<div class="library__empty"> Your Library is empty! Please, add movies to your library <svg class="footer__page-icon" width="14px" height="13px">
            <use href="./images/icons.svg#icon-heart"></use>
          </svg>
  </div>`;
  } else {
    libraryContainer.innerHTML = "";
    watchedMovies.forEach(renderMovieID);
  }
}

watchedBtn.addEventListener("click", getwatchedMovies);

const savedQueuedMovies = localStorage.getItem("queuedMovieIDs");
function getQueuedMovies() {
  let queuedMovies = JSON.parse(savedQueuedMovies);
  if (queuedMovies === null) {
    section.innerHTML = `<div class="library__empty"> Your Library is empty! Please, add movies to your library <svg class="footer__page-icon" width="14px" height="13px">
            <use href="./images/icons.svg#icon-heart"></use>
          </svg>
  </div>`;
  } else {
    libraryContainer.innerHTML = "";
    queuedMovies.forEach(renderMovieID);
  }
}

queuedBtn.addEventListener("click", getQueuedMovies);

//active buttons
watchedBtn.addEventListener("click", watchedActiv);
queuedBtn.addEventListener("click", queueActiv);

function watchedActiv() {
  watchedBtn.classList.add("activBtn");
  queuedBtn.classList.remove("activBtn");
}
function queueActiv() {
  watchedBtn.classList.remove("activBtn");
  queuedBtn.classList.add("activBtn");
}

export { renderMovieItem, fetchMovie };
