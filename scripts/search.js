function compileRegex(input, flags = "i") {
  if (input.trim() === "") {
    return null;
  }
  try {
    return new RegExp(input, flags);
  } catch (error) {
        return null;
  }
}

function searchBooks(books, searchText) {
    const regex = compileRegex(searchText);
    if (regex === null) {
        return [];
    }
    return books.filter(function(book) {
        return regex.test(book.title) || regex.test(book.author);
    });
}
