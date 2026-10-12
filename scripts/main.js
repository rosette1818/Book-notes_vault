const bookForm = document.getElementById("book-form");
const books = loadBooks();
showBooks(books);
const searchInput = document.getElementById("search-books");
const caseInsensitive = document.getElementById("case-insensitive");
const searchError = document.getElementById("search-error");
const sortSelect = document.getElementById("sort-books");
function updateBookDisplay() {
    const searchText = searchInput.value;
    const regex = compileRegex(searchText, caseInsensitive.checked);
    if (regex === false) {
        searchError.textContent = "Invalid expression! Please check your input.";
        showBooks([], null);
        return;
    }
    searchError.textContent = "";
    const filteredBooks = searchBooks(books, searchText, caseInsensitive.checked);
    const sortedBooks = sortBooks(filteredBooks, sortSelect.value);
    showBooks(sortedBooks, regex);
}
searchInput.addEventListener("input", function () {
  updateBookDisplay();
});
caseInsensitive.addEventListener("change", updateBookDisplay);
sortSelect.addEventListener("change", function () {
  updateBookDisplay();
});
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const author = document.getElementById("author").value;
  const tag = document.getElementById("tag").value;
  const pages = document.getElementById("pages").value;

  const isTitleValid = validateTitle(title);
  const isDateValid = validateDate(date);
  const isPagesValid = validatePages(pages);
  const isAuthorValid = validateAuthor(author);
  const isTagValid = validateTag(tag);
  const hasRepeatedTitleWords = hasRepeatedWords(title);
  const isFormValid =
    isTitleValid &&
    isAuthorValid &&
    isPagesValid &&
    isTagValid &&
    isDateValid &&
    !hasRepeatedTitleWords;

  console.log("Title:", isTitleValid);
  console.log("Author:", isAuthorValid);
  console.log("Pages:", isPagesValid);
  console.log("Tag:", isTagValid);
  console.log("Date:", isDateValid);
  console.log("Repeated words:", hasRepeatedTitleWords);

  if (isFormValid === false) {
    alert("Some fields are invalid. Please check your entries!");
    return;
  } else {
    const now = new Date().toISOString();
    const book = {
      id: Math.floor(Math.random() * 1000),
      title: title,
      author: author,
      pages: Number(pages),
      tag: tag,
      dateAdded: date,
      createdAt: now,
      updatedAt: now,
    };
    books.push(book);
    saveBooks(books);
    showBooks(books);
    console.log("Book records:", book);
    alert("Book added successfully!");
    bookForm.reset();
  }
});
