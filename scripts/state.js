// state.js - the single place where the app's shared state lives.
// Loaded after storage.js and before ui.js / main.js (see index.html).
// Other files read and change state through this object instead of
// declaring their own global variables.

const state = {
  // Every saved book. This array is changed in place (push/splice) so
  // any file holding a reference to it always sees the latest data.
  books: loadBooks(),

  // id of the book being edited, or null when the form is in "add" mode.
  editingBookId: null,

  // Reading goal (pages), restored from localStorage.
  pageTarget: loadPageTarget(),

  // Sum of pages across all books. Recalculated by updateDashboard().
  totalPages: 0,
};

// Create an id that is very unlikely to repeat.
// (The old Math.random() * 1000 gave only 1000 possible ids, so two
// books could end up sharing one and Edit/Delete would hit the wrong one.)
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

// Put the form into "edit" mode for one book.
function startEditing(bookId) {
  state.editingBookId = bookId;
}

// Put the form back into "add" mode.
function stopEditing() {
  state.editingBookId = null;
}

// Update the reading goal in memory and in localStorage.
function setPageTarget(target) {
  state.pageTarget = target;
  savePageTarget(target);
}

// Add up the pages of every book and remember the result.
function recalculateTotalPages() {
  state.totalPages = state.books.reduce(function (total, book) {
    return total + book.pages;
  }, 0);
  return state.totalPages;
}
