function showBooks(books, regex) {
const booksList = document.getElementById("books-list");
booksList.innerHTML = "";
books.forEach(function(book) {
    const bookCard = document.createElement("li");
    const titleElement = document.createElement("h3");
    titleElement.replaceChildren(highlightText(book.title, regex));   
    bookCard.appendChild(titleElement);
    const authorElement = document.createElement("p");
    authorElement.replaceChildren(highlightText(book.author, regex));
    bookCard.appendChild(authorElement);
    const pagesElement = document.createElement("p");
    pagesElement.replaceChildren(highlightText(String(book.pages), regex));
    bookCard.appendChild(pagesElement);
    const tagElement = document.createElement("p");
    tagElement.replaceChildren(highlightText(book.tag, regex));
     bookCard.appendChild(tagElement);
    const dateElement = document.createElement("p");
    dateElement.replaceChildren(highlightText(book.dateAdded, regex));
    bookCard.appendChild(dateElement);
    const editButton = document.createElement("button");
editButton.textContent = "Edit";
bookCard.appendChild(editButton);
editButton.addEventListener("click", function () {
const selectedBook = books.find(function (item) {
  return item.id === book.id;
});
if (selectedBook) {
    editingBookId = selectedBook.id;
    submitBookButton.textContent = "Update Book";
document.getElementById("title").value = selectedBook.title;
document.getElementById("author").value = selectedBook.author;
document.getElementById("pages").value = selectedBook.pages;
document.getElementById("tag").value = selectedBook.tag;
document.getElementById("date").value = selectedBook.dateAdded;
}
});
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    bookCard.appendChild(deleteButton);deleteButton.addEventListener("click", function () {
  const confirmDelete = confirm(
    `Are you sure you want to delete? "${book.title}"?`
  );

  if (confirmDelete) {
    const bookIndex = books.findIndex(function (item) {
  return item.id === book.id;
}

);
if (bookIndex !== -1) {
  books.splice(bookIndex, 1);
  saveBooks(books);
  showBooks(books, regex);
}
  }
});

    booksList.appendChild(bookCard);
});
}
function highlightText(text, regex) {
    if (!regex) {
        return text;
    }
    const highlightRegex = new RegExp(`(${regex.source})`, regex.flags);
    const parts = text.split(highlightRegex);
    const highlightedParts = parts.map(function(part) {
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
    highlightedParts.forEach(function(node) {
        fragment.appendChild(node);
    });
    return fragment;
}

function searchBooks(books, searchText) {
    return books.filter(function(book) {
        return book.title.toLowerCase().includes(searchText.toLowerCase()) || book.author.toLowerCase().includes(searchText.toLowerCase());
    });
}
 function sortBooks(books, sortBy) {
    if (sortBy === "title") {
            return books.sort(function(a, b) {
        return a.title.localeCompare(b.title);
    });
}
    else if (sortBy === "date") {
    return books.sort(function(a, b) {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
}
     else if (sortBy === "pages") {
         return books.sort(function(a, b) {
        return a.pages - b.pages;
    });
    }
    return books;
}
