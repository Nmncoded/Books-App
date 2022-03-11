let charactersList = document.querySelector(`.characters-list`);
let booksList = document.querySelector(`.books-list`);
let showBooksBtn = document.querySelector(`.characters-list button`);
let rootElm = document.querySelector(`.root-ul`);
let characterRootUl = document.querySelector(`.character-ul`);
let booksUrl = `https://www.anapioficeandfire.com/api/books`;
let showErrMsg = document.querySelector(`.error-message`);

function handleSpinner(rootEl, status = false) {
  if (status) {
    rootEl.innerHTML = `<div class="spinner"><div class="donut"></div></div>`;
  }
}

function handleErrMessage(msg = 'Something went wrong') {
  showErrMsg.style.display = 'block';
  showErrMsg.innerText = msg;
  booksList.style.display = 'none';
}

function handleChBtnClick(event, book) {
  event.preventDefault();
  booksList.style.display = 'none';
  charactersList.style.display = 'block';
  displayCharactersUI(book.characters);
}

function handleBooksBtnClick() {
  booksList.style.display = 'block';
  charactersList.style.display = 'none';
}

function displayCharactersUI(characters) {
  handleSpinner(characterRootUl, true);
  Promise.all(
    characters.map((link) => fetch(link).then((res) => res.json()))
  ).then((allChar) => {
    characterRootUl.innerHTML = '';
    allChar.forEach((charac) => {
      let liName = document.createElement(`li`);
      liName.innerText = `${charac.name} : ${charac.aliases.join(', ')}`;
      characterRootUl.append(liName);
    });
  });
}

function displayBooksUI(data) {
  rootElm.innerHTML = '';
  data.forEach((book, index) => {
    let li = document.createElement(`li`);
    let h1 = document.createElement(`h1`);
    h1.innerText = book.name;
    let p = document.createElement(`p`);
    p.innerText = `Authors: ${book.authors.join(',')}`;
    let a = document.createElement(`a`);
    a.dataset.add = index;

    a.innerText = `Show characters ${book.characters.length}`;
    a.addEventListener(`click`, (event) => {
      handleChBtnClick(event, book);
    });
    li.append(h1, p, a);

    rootElm.append(li);
  });
}

function init() {
  function fetchData(url) {
    handleSpinner(rootElm, true);
    fetch(url)
      .then((res) => {
        //   console.log(res);
        if (res.ok) {
          return res.json();
        } else {
          throw new Error ('Books url is not ok!!!');
        }
      })
      .then((booksData) => {
        displayBooksUI(booksData);
      })
      .catch((err) => handleErrMessage(`Books url is not ok !!`))
      .finally(() => handleSpinner());
  }
  fetchData(booksUrl);
}

if (navigator.onLine) {
  init();
} else {
  handleErrMessage('check your internet connection !!!');
}

showBooksBtn.addEventListener(`click`, handleBooksBtnClick);
