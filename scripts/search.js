function compileRegex(input, ignoreCase = true) {
    if (input.trim() === "") {
        return null;
    }

    try {
        return new RegExp(input, ignoreCase ? "i" : "");
    } catch (error) {
        return false;
    }
}

function searchBooks(books, searchText, ignoreCase = true) {
    const regex = compileRegex(searchText, ignoreCase);
    if (regex === null) {
        return books;
    }
    if (regex === false) {
        return [];
    }
    return books.filter(function (book) {
        regex.lastIndex = 0;
        const titleMatches = regex.test(book.title);
        regex.lastIndex = 0;
        const authorMatches = regex.test(book.author);
        return titleMatches || authorMatches;
    });
}
