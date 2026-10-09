const bookForm = document.getElementById("book-form");
const books = [];

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
    console.log("Book records:", book);
    alert("Book added successfully!");
    bookForm.reset();
  }
});
