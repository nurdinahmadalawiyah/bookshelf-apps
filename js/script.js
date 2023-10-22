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

const submitForm = document.getElementById("form");

document.addEventListener("DOMContentLoaded", function () {
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const searachInput = document.getElementById("search");
  searachInput.addEventListener("input", function () {
    searchBook(this.value);
  });
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

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("isCompleted").checked = false;

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
    const undoIcon = document.createElement("i");
    undoIcon.classList.add("fas", "fa-undo");
    undoButton.classList.add("undo-button");
    undoButton.appendChild(undoIcon);
    undoButton.innerHTML += " Belum Selesai dibaca";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    const editIcon = document.createElement("i");
    editButton.classList.add("edit-button");
    editIcon.classList.add("fas", "fa-edit");
    editButton.appendChild(editIcon);
    editButton.innerHTML += " Edit Buku";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    const trashIcon = document.createElement("i");
    trashButton.classList.add("trash-button");
    trashIcon.classList.add("fas", "fa-trash");
    trashButton.appendChild(trashIcon);
    trashButton.innerHTML += " Hapus Buku";

    trashButton.addEventListener("click", function () {
      Swal.fire({
        title: `Apakah Anda yakin ingin menghapus buku ${bookObject.title} ?`,
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Tidak',
      }).then((result) => {
        if (result.isConfirmed) {
          removeBookFromCompleted(bookObject.id);
          Swal.fire('Buku telah dihapus!', '', 'success');
        } else {
          Swal.fire('Buku batal dihapus', '', 'info');
        }
      })
    });

    container.append(undoButton, editButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    const checkIcon = document.createElement("i");
    checkButton.classList.add("check-button");
    checkIcon.classList.add("fas", "fa-check");
    checkButton.appendChild(checkIcon);
    checkButton.innerHTML += " Selesai dibaca";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    const editIcon = document.createElement("i");
    editButton.classList.add("edit-button");
    editIcon.classList.add("fas", "fa-edit");
    editButton.appendChild(editIcon);
    editButton.innerHTML += " Edit Buku";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    const trashIcon = document.createElement("i");
    trashButton.classList.add("trash-button");
    trashIcon.classList.add("fas", "fa-trash");
    trashButton.appendChild(trashIcon);
    trashButton.innerHTML += " Hapus Buku";

    trashButton.addEventListener("click", function () {
      Swal.fire({
        title: `Apakah Anda yakin ingin menghapus buku ${bookObject.title} ?`,
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Tidak',
      }).then((result) => {
        if (result.isConfirmed) {
          removeBookFromCompleted(bookObject.id);
          Swal.fire('Buku telah dihapus!', '', 'success');
        } else {
          Swal.fire('Buku batal dihapus', '', 'info');
        }
      })
    });

    container.append(checkButton, editButton, trashButton);
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

function searchBook(keyword) {
  const uncompletedBookList = document.getElementById("books");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completed-books");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    if (bookItem.title.toLowerCase().includes(keyword.toLowerCase())) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) {
        uncompletedBookList.append(bookElement);
      } else {
        completedBookList.append(bookElement);
      }
    }
  }
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const isCompletedInput = document.getElementById("isCompleted");

  titleInput.value = bookTarget.title;
  authorInput.value = bookTarget.author;
  yearInput.value = bookTarget.year;
  isCompletedInput.checked = bookTarget.isCompleted;

  const submitButton = document.querySelector(".btn-submit");
  submitButton.style.display = "none";

  const existingSaveButton = document.querySelector(".save-button");
  if (existingSaveButton) {
    existingSaveButton.remove();
  }

  const existingCancelButton = document.querySelector(".cancel-button");
  if (existingCancelButton) {
    existingCancelButton.remove();
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const saveButton = document.createElement("button");
  const saveIcon = document.createElement("i");
  saveIcon.classList.add("fas", "fa-save");
  saveButton.classList.add("save-button");
  saveButton.appendChild(saveIcon);
  saveButton.innerHTML += " Simpan Perubahan";

  saveButton.addEventListener("click", function () {
    saveEditedBook(bookTarget.id);
  });

  const cancelButton = document.createElement("button");
  const cancelIcon = document.createElement("i");
  cancelIcon.classList.add("fas", "fa-times");
  cancelButton.classList.add("cancel-button");
  cancelButton.appendChild(cancelIcon);
  cancelButton.innerHTML += " Batal Edit";

  cancelButton.addEventListener("click", function () {
    cancelEdit();
  });

  buttonContainer.append(saveButton, cancelButton);

  submitForm.appendChild(buttonContainer);
}

function saveEditedBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const isCompletedInput = document.getElementById("isCompleted");

  bookTarget.title = titleInput.value;
  bookTarget.author = authorInput.value;
  bookTarget.year = yearInput.value;
  bookTarget.isCompleted = isCompletedInput.checked;

  const submitButton = document.querySelector(".btn-submit");
  submitButton.style.display = "block";

  const saveButton = document.querySelector(".save-button");
  saveButton.remove();

  const cancelButton = document.querySelector(".cancel-button");
  cancelButton.remove();

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompletedInput.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function cancelEdit() {
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const isCompletedInput = document.getElementById("isCompleted");

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompletedInput.checked = false;

  const submitButton = document.querySelector(".btn-submit");
  submitButton.style.display = "block";

  const existingSaveButton = document.querySelector(".save-button");
  if (existingSaveButton) {
    existingSaveButton.remove();
  }

  const existingCancelButton = document.querySelector(".cancel-button");
  if (existingCancelButton) {
    existingCancelButton.remove();
  }
}