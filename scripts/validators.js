
function validateTitle(title) {
  return title === title.trim() && title.trim() !== "";
}

function validateAuthor(author) {
  return !/^\s*$/.test(author);
}

function validatePages(pages) {
  return /^\d+$/.test(String(pages)) &&
    Number(pages) > 0 &&
    Number(pages) <= 5000;
}

function validateTag(tag) {
  return /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/.test(tag);
}
function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

function hasRepeatedWords(title) {
  return /\b(\w+)\s+\1\b/i.test(title);
}

function validateImportedBooks(importedBooks) {
  if (!Array.isArray(importedBooks)) {
    return false;
  }

  return importedBooks.every(function (book) {
    return (
      book &&
      typeof book.title === "string" &&
      typeof book.author === "string" &&
      Number.isInteger(book.pages) &&
      book.pages > 0 &&
      typeof book.tag === "string" &&
      typeof book.dateAdded === "string" &&
      (typeof book.id === "string" || typeof book.id === "number") &&
      typeof book.createdAt === "string" &&
      typeof book.updatedAt === "string"
    );
  });
}
