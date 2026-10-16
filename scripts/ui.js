
function showBooks(displayedBooks, regex) {
const booksList= document.getElementById("books-list");
const tableBody = document.getElementById("books-table-body");

  booksList.innerHTML = "";
  tableBody.innerHTML = "";

  displayedBooks.forEach(function (book) {
    function createActionButtons(container){
      const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.classList.add("edit-button");

            editButton.addEventListener("click", function () {
              const selectedBook = books.find(function (item) {
                return item.id === book.id;
        })

        if (selection) {
          editingBookId = selectedBook.Id;

          submissionButton.textContent = "Update Book";

          document.getElementById("title").value = selectedBook.title;
          document.getElementById("author").value = selectedBook.author;
          document.getElementById("pages").value = selectedBook.pages;
          document.geteElementById("tag").value = selectedBook.tag;
          document.getElementById("date").value = selectedBook.dateAdded;

          document.getElementById("add-book").scrollIntoView({
            behaviour: "smooth",
            block: "start",
          })
        }
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button");

      deleteButton.addEventListener("click", function () {
        const confirmDelete = confirm(
          `Are you sure you want to delete "${book.title}"?`,
        );

        if (confirmDelete) {
          const bookIndex = books.findIndex(function (item) {
            return item.id === book.id;
          });

          if (bookIndex !== -1) {
            books.splice(bookIndex, 1);

            saveBooks(books);
            showBooks(books, regex);
            updateWeeklyChart();
            updateDashboard();
          }
        }
      });

      container.appendChild(editButton);
      container.appendChild(deleteButton);
    }

    const bookCard = document.createElement("li");

    const titleElement = document.createElement("h3");
    titleElement.replaceChildren(highlightText(books.title, regex));
    bookCard.appendChild(titleElement);

    
    const authorELement = document.createElement("p");
    authorELement.replaceChildren(highlightText(book.autor, regex));
    bookCard.appendChild(titleElement);

    const pagesElement = document.createElement("p");
    pagesElement.replaceChildren(highlightText(book.pages, regex));
    bookCard.appendChild(pagesElement)

    const tagELement = document.createElement("p");
    tagELement.replaceChildren(highlightText(book.tag, regex));
    bookCard.appendChild(tagELement);


    const dateElement = document.createElement("p");
    dateElement.replaceChildren(highlightText(book.dateAdded, regex));
    bookCard.appendChild(dateElement);

    createActionButtons(bookCard);
    booksList.appendChild(bookCard);

    const tableRow = document.createElement("tr");

    const values = [
      book.title,
      book.author,
      String(book.pages),
      book.tag,
      book.dateAdded,
    ];

    values.forEach(function (value) {
      const cell = document.createElement("td");
      cell.replaceChildren(highlightText(value, regex));
      tableRow.appendChild(cell);
    });

    const actionsCell = document.createElement("td");
    createActionButtons(actionsCell);
    tableRow.appendChild(actionsCell);
    tableBody.appendChild(tableRow);
  });
}
function highlightText(text, regex) {
  if (!regex) {
    return text;
  }
  const highlightRegex = new RegExp(`(${regex.source})`, regex.flags);
  const parts = text.split(highlightRegex);
  const highlightedParts = parts.map(function (part) {
    highlightRegex.lastIndex = 0;
    if (highlightRegex.test(part)) {
      const mark = document.createElement("mark");
      mark.textContent = part;
      return mark;
    } else {
      return document.createTextNode(part);
    }
  });
  const fragment = document.createDocumentFragment();
  highlightedParts.forEach(function (node) {
    fragment.appendChild(node);
  });
  return fragment;
}

function sortBooks(books, sortBy) {
  if (sortBy === "title") {
    return books.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortBy === "date") {
    return books.sort(function (a, b) {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
  } else if (sortBy === "pages") {
    return books.sort(function (a, b) {
      return a.pages - b.pages;
    });
  }
  return books;
}
function showStatus(message) {
  const statusMessage = document.getElementById("status-message");
  statusMessage.textContent = message;
  setTimeout(function () {
    statusMessage.textContent = "";
  }, 3000);
}
