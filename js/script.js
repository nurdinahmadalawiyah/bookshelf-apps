const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak support local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generatedId() {
  return +new Date();
}

function generatedBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("books");
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completed-books");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});

function addBook() {
  const textTitle = document.getElementById("title").value;
  const textAuthor = document.getElementById("author").value;
  const numberYear = document.getElementById("year").value;
  const boolCompleted = document.getElementById("isCompleted").checked;

  const generatedID = generatedId();
  const bookObject = generatedBookObject(
    generatedID,
    textTitle,
    textAuthor,
    numberYear,
    boolCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);


  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.innerText = "Belum Selesai dibaca";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      if (
        confirm(
          `Apakah anda yakin ingin menghapus buku ${bookObject.title} ?`
        ) == true
      ) {
        removeBookFromCompleted(bookObject.id);
      } else {
        alert("Buku batal dihapus");
      }
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.innerText = "Selesai dibaca";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      if (
        confirm(
          `Apakah anda yakin ingin menghapus buku ${bookObject.title} ?`
        ) == true
      ) {
        removeBookFromCompleted(bookObject.id);
      } else {
        alert("Buku batal dihapus");
      }
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {

}