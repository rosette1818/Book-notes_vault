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
