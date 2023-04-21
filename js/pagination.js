import { fetchFilms, renderMovies, totalPages } from "./renderMovies.js";
import loaderToggle from "./spinner.js";
const paginationEl = document.querySelector(".movie__pagination");
const container = document.querySelector(".movie__container");

const mediaQuery = window.matchMedia("(max-width: 767px)");

let pagMarkup = "";
let currentPage = 0;
const BTNS_ON_PAGE = 5;

fetchFilms(currentPage + 1)
  .then(() => {
    renderPaginationMarkup(totalPages);
  })
  .then(setActiveBtn);

paginationEl.addEventListener("click", (event) => {
  if (event.target.nodeName === "BUTTON") {
    onBtnsClick(event);
  }
});

function clearPaginationMarkup() {
  paginationEl.innerHTML = "";
}

function setActiveBtn(event) {
  const numberBtnsEl = document.querySelectorAll("button.button-number");
  const btnsArray = [...numberBtnsEl];

  if (currentPage === 0) {
    numberBtnsEl[0].classList.add("active-pagination");
  } else {
    let targetBtnValue = 0;

    if (event.target.textContent === "→" || event.target.textContent === "←") {
      targetBtnValue = currentPage + 1;
    } else {
      targetBtnValue = Number(event.target.textContent);
    }

    btnsArray.find((btn, index) => {
      if (btn.classList.contains("active-pagination")) {
        numberBtnsEl[index].classList.remove("active-pagination");
      }
    });

    btnsArray.find((btn, index) => {
      if (Number(btn.textContent) === targetBtnValue) {
        numberBtnsEl[index].classList.add("active-pagination");
      }
    });
  }
}

function onNumberBtnClick(event) {
  currentPage = Number(event.target.textContent) - 1;
}

function onRightBtnClick() {
  currentPage += 1;
}

function onLeftBtnClick() {
  currentPage -= 1;
}

function onBtnsClick(event) {
  const paginationBtnsList = document.querySelectorAll("button.button-number");
  const lastPage = Number(
    paginationBtnsList[paginationBtnsList.length - 1].textContent
  );

  loaderToggle();

  if (Number(event.target.textContent)) {
    onNumberBtnClick(event);
  } else if (event.target.textContent === "→" && currentPage < lastPage - 1) {
    onRightBtnClick();
  } else if (event.target.textContent === "←" && currentPage > 0) {
    onLeftBtnClick();
  } else {
    return;
  }
  clearPaginationMarkup();
  clearMovieContainer();

  fetchFilms(currentPage + 1)
    .then((data) => {
      renderPaginationMarkup(totalPages);
      renderMovies(data);
    })
    .then(
      setTimeout(() => {
        setActiveBtn(event);
      }, 1500)
    )
    .then(loaderToggle)
    .then(goToTop);
}

function clearMovieContainer() {
  container.innerHTML = "";
}

function goToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function renderPaginationMarkup(length) {
  if (mediaQuery.matches) {
    renderPaginationMarkupForMobile(length);
  } else {
    renderPaginationMarkupForTabletAndDesktop(length);
  }
  paginationEl.insertAdjacentHTML("beforeend", pagMarkup);
}

function renderPaginationMarkupForMobile(length) {
  pagMarkup = "";

  if (length <= BTNS_ON_PAGE) {
    for (let i = 0; i < length; i += 1) {
      pagMarkup += `<li class='pagination-item'><button class="button-number">${
        i + 1
      }</button></li>`;
    }
  } else {
    if (currentPage + 1 < BTNS_ON_PAGE) {
      pagMarkup =
        '<li class="pagination-item"><button class="left">&#8592</button></li>';

      for (let i = 1; i <= BTNS_ON_PAGE; i += 1) {
        const pagItem = `<li class='pagination-item'><button class="button-number">${i}</button></li>`;
        pagMarkup += pagItem;
      }

      pagMarkup += `<li class="pagination-item"><button class="right">&#8594</button></li>`;
    } else if (
      currentPage + 1 >= BTNS_ON_PAGE &&
      currentPage + 1 < length - 3
    ) {
      pagMarkup = `<li class="pagination-item"><button class="left">&#8592</button></li>
      <li class='pagination-item'><button class="button-number">${
        currentPage - 1
      }</button></li>
      <li class='pagination-item'><button class="button-number">${currentPage}</button></li>
      <li class='pagination-item'><button class="button-number">${
        currentPage + 1
      }</button></li>
      <li class='pagination-item'><button class="button-number">${
        currentPage + 2
      }</button></li>
      <li class='pagination-item'><button class="button-number">${
        currentPage + 3
      }</button></li>
      <li class="pagination-item"><button class="right">&#8594</button></li>`;
    } else {
      pagMarkup = `<li class="pagination-item"><button class="left">&#8592</button></li>
        <li class='pagination-item'><button class="button-number">${
          length - 4
        }</button></li>
      <li class='pagination-item'><button class="button-number">${
        length - 3
      }</button></li>
      <li class='pagination-item'><button class="button-number">${
        length - 2
      }</button></li>
      <li class='pagination-item'><button class="button-number">${
        length - 1
      }</button></li>
      <li class='pagination-item'><button class="button-number">${length}</button></li>
      <li class="pagination-item"><button class="right">&#8594</button></li>`;
    }
  }
}

function renderPaginationMarkupForTabletAndDesktop(length) {
  pagMarkup = "";

  if (length <= BTNS_ON_PAGE) {
    for (let i = 0; i < length; i += 1) {
      pagMarkup += `<li class='pagination-item'><button class="button-number">${
        i + 1
      }</button></li>`;
    }
  } else {
    if (currentPage + 1 < BTNS_ON_PAGE) {
      pagMarkup =
        '<li class="pagination-item"><button class="left">&#8592</button></li>';

      for (let i = 1; i <= BTNS_ON_PAGE; i += 1) {
        const pagItem = `<li class='pagination-item'><button class="button-number">${i}</button></li>`;
        pagMarkup += pagItem;
      }

      pagMarkup += `<li class='pagination-item'><button class="more-pages">...</button></li>
        <li class='pagination-item'><button class="button-number">${length}</button></li>
        <li class="pagination-item"><button class="right">&#8594</button></li>`;
    } else if (
      currentPage + 1 >= BTNS_ON_PAGE &&
      currentPage + 1 < length - 3
    ) {
      pagMarkup = `<li class="pagination-item"><button class="left">&#8592</button></li>
        <li class='pagination-item'><button class="button-number">1</button></li>
        <li class='pagination-item'><button class="more-pages">...</button></li>
        <li class='pagination-item'><button class="button-number">${
          currentPage - 1
        }</button></li>
        <li class='pagination-item'><button class="button-number">${currentPage}</button></li>
        <li class='pagination-item'><button class="button-number">${
          currentPage + 1
        }</button></li>
        <li class='pagination-item'><button class="button-number">${
          currentPage + 2
        }</button></li>
        <li class='pagination-item'><button class="button-number">${
          currentPage + 3
        }</button></li>
        <li class='pagination-item'><button class="more-pages">...</button></li>
        <li class='pagination-item'><button class="button-number">${length}</button></li>
        <li class="pagination-item"><button class="right">&#8594</button></li>`;
    } else {
      pagMarkup = `<li class="pagination-item"><button class="left">&#8592</button></li>
    <li class='pagination-item'><button class="button-number">1</button></li>
        <li class='pagination-item'><button class="more-pages">...</button></li>
        <li class='pagination-item'><button class="button-number">${
          length - 4
        }</button></li>
        <li class='pagination-item'><button class="button-number">${
          length - 3
        }</button></li>
        <li class='pagination-item'><button class="button-number">${
          length - 2
        }</button></li>
        <li class='pagination-item'><button class="button-number">${
          length - 1
        }</button></li>
        <li class='pagination-item'><button class="button-number">${length}</button></li>
        <li class="pagination-item"><button class="right">&#8594</button></li>`;
    }
  }
}
export { clearPaginationMarkup };
