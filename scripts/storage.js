function saveBooks(books) {
  localStorage.setItem("bookNotesVault", JSON.stringify(books));
}
function loadBooks() {
  const savedBooks = localStorage.getItem("bookNotesVault");

  if (savedBooks === null) {
    return [];
  } else {
    return JSON.parse(savedBooks);
  }
}
