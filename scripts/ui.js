function showBooks(books) {
const booksList = document.getElementById("books-list");
booksList.innerHTML = "";
books.forEach(function(book) {
    const bookCard = document.createElement("li");
    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;
    bookCard.appendChild(titleElement);
    const authorElement = document.createElement("p");
    authorElement.textContent = book.author;
    bookCard.appendChild(authorElement);
    const pagesElement = document.createElement("p");
    pagesElement.textContent = `Pages: ${book.pages}`;
    bookCard.appendChild(pagesElement);
    const tagElement = document.createElement("p");
    tagElement.textContent = `Tag: ${book.tag}`;
    bookCard.appendChild(tagElement);
    const dateElement = document.createElement("p");
    dateElement.textContent = `Date Added: ${book.dateAdded}`;
    bookCard.appendChild(dateElement);
    booksList.appendChild(bookCard);
});
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
