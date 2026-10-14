

const state = {
    books: loadBooks(),
  editingBookId: null,
  pageTarget: loadPageTarget(),
  totalPages: 0,
};

function generateId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10)
  );
}

function startEditing(bookId) {
  state.editingBookId = bookId;
}

function stopEditing() {
  state.editingBookId = null;
}

function setPageTarget(target) {
  state.pageTarget = target;
  savePageTarget(target);
}

function recalculateTotalPages() {
  state.totalPages = state.books.reduce(function (total, book) {
    return total + book.pages;
  }, 0);
  return state.totalPages;
}
