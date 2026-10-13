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