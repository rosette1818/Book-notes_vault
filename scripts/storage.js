function saveBooks(books) {
  localStorage.setItem("bookNotesVault", JSON.stringify(books));
}
function loadBooks() {
  const savedBooks = localStorage.getItem("bookNotesVault");
  if (savedBooks === null) {
    return [];
  }

  try {
    const parsedBooks = JSON.parse(savedBooks);

    if (!Array.isArray(parsedBooks)) {
      return [];
    }

    return parsedBooks;
  } catch (error) {
    console.error("Could not load saved books:", error);
    return [];
  }
}
function savePageTarget(target) {
  localStorage.setItem("pageTarget", target);
}
function loadPageTarget() {
  const savedTarget = localStorage.getItem("pageTarget");
  if (savedTarget === null) {
    return 5000;
  } else {
    return Number(savedTarget);
  }
}