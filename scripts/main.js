const bookForm = document.getElementById("book-form");
const books = loadBooks();
let editingBookId = null;
const submitBookButton = document.getElementById("submit-book");
submitBookButton.textContent = "Save Book";
let totalPages = 0;
const totalBooksElement = document.getElementById("total-books");
const totalPagesElement = document.getElementById("total-pages");
const mostCommonTagElement = document.getElementById("most-common-tag");
const booksThisWeekElement = document.getElementById("books-this-week");
const pageTargetElement = document.getElementById("page-target");
const pagesRemainingElement = document.getElementById("pages-remaining");
const pageTargetInput = document.getElementById("page-target-input");
const saveTargetButton = document.getElementById("save-target");
const goalStatus = document.getElementById("goal-status");
const pageCountInput = document.getElementById("page-count");
const conversionType = document.getElementById("conversion-type");
const conversionResult = document.getElementById("conversion-result");
const exportBooksButton = document.getElementById("export-books");
const deleteAllBooksButton = document.getElementById("delete-all-books");
const importBooksInput = document.getElementById("import-books");
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", function() {
  document.documentElement.setAttribute(
    "data-theme",
    themeToggle.checked ? "dark" : "light"
  );
});
importBooksInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const importedBooks = JSON.parse(reader.result);
      if (!Array.isArray(importedBooks)) {
        throw new Error("Invalid book data");
      }
      const isValid = importedBooks.every(function (book) {
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
      const ids = importedBooks.map(function (book) {
        return book.id;
      });
      if (!isValid || hasDuplicateIds) {
        throw new Error("Invalid book information or duplicate IDs");
      }
      const hasDuplicateIds = new Set(ids).size !== ids.length;

      books.splice(0, books.length, ...importedBooks);
      saveBooks(books);
      showBooks(books);
      updateWeeklyChart();
      updateDashboard();
      showStatus("Books imported successfully!");
      importBooksInput.value = "";

      console.log(importedBooks);
    } catch (error) {
      console.error("Import error:", error);

      if (error.message.includes("duplicate")) {
        importError.textContent =
          "Invalid input: Duplicate book IDs were found.";
      } else if (error.message.includes("book information")) {
        importError.textContent =
          "Invalid input: Some book details are missing or incorrect.";
      } else {
        importError.textContent =
          "Invalid input: Please select a valid JSON file.";
      }
      importBooksInput.value = "";
    }
  };

  reader.readAsText(file);
});
exportBooksButton.addEventListener("click", function () {
  const jsonData = JSON.stringify(books, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "my-books.json";
  link.click();
  URL.revokeObjectURL(url);
});
deleteAllBooksButton.addEventListener("click", function () {
  if (books.length === 0) {
    alert("There are no books to delete!");
    return;
  }

  const confirmDelete = confirm(
    "Are you sure you want to delete ALL books? This action cannot be undone.",
  );

  if (confirmDelete) {
    books.splice(0, books.length);

    saveBooks(books);
    showBooks(books);
    updateWeeklyChart();
    updateDashboard();

    editingBookId = null;
    submitBookButton.textContent = "Save Book";
    bookForm.reset();

    alert("All books deleted successfully!");
  }
});
function convertPages() {
  const pageCount = Number(pageCountInput.value);
  if (
    pageCountInput.value.trim() === "" ||
    !Number.isFinite(pageCount) ||
    pageCount < 0
  ) {
    conversionResult.textContent =
      "Please enter a valid page count (0 or greater).";
    return;
  }

  if (conversionType.value === "pages-to-sheets") {
    const result = pageCount / 2;
    conversionResult.textContent = `${result} sheets`;
  } else {
    const result = pageCount * 2;
    conversionResult.textContent = `${result} pages`;
  }
}
pageCountInput.addEventListener("input", convertPages);
conversionType.addEventListener("change", convertPages);
saveTargetButton.addEventListener("click", function () {
  const newTarget = Number(pageTargetInput.value);
  if (
    pageTargetInput.value.trim() === "" ||
    !Number.isFinite(newTarget) ||
    newTarget < 0
  ) {
    goalStatus.textContent = "Please enter a valid page number (0 or greater).";
    return;
  }
  pageTarget = newTarget;
  savePageTarget(pageTarget);
  pageTargetElement.textContent = pageTarget.toLocaleString();
  const pagesRemaining = Math.max(0, pageTarget - totalPages);
  pagesRemainingElement.textContent = pagesRemaining.toLocaleString();
  if (totalPages < pageTarget) {
    const remainingPages = pageTarget - totalPages;
    goalStatus.setAttribute("aria-live", "polite");
    goalStatus.textContent = `${remainingPages} pages remaining to reach your reading goal`;
  } else if (totalPages > pageTarget) {
    const exceededPages = totalPages - pageTarget;
    goalStatus.setAttribute("aria-live", "assertive");
    goalStatus.textContent = `Congratulations🥳 You exceeded your reading goal by ${exceededPages} pages.`;
  } else {
    goalStatus.setAttribute("aria-live", "polite");
    goalStatus.textContent =
      "Congratulations🎉 You have reached your reading goal!";
  }
});
const weeklyChartElement = document.getElementById("weekly-chart");
function updateWeeklyChart() {
  const now = new Date();
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const dailyBooks = books.filter(function (book) {
      return (
        new Date(book.createdAt).getFullYear() === day.getFullYear() &&
        new Date(book.createdAt).getMonth() === day.getMonth() &&
        new Date(book.createdAt).getDate() === day.getDate()
      );
    });
    const count = dailyBooks.length;
    weeklyData.push({
      label: day.toLocaleDateString(),
      count: count,
    });
  }
  const maxCount = Math.max(
    ...weeklyData.map(function (day) {
      return day.count;
    }),
  );
  weeklyChartElement.innerHTML = "";
  weeklyData.forEach(function (day) {
    const barWidth = maxCount === 0 ? 0 : (day.count / maxCount) * 100;
    const barLabel = document.createElement("div");
    barLabel.textContent = `${day.label}: ${day.count} books`;
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.width = `${barWidth}%`;
    bar.setAttribute("aria-label", `${day.label}: ${day.count} books`);
    const chartRow = document.createElement("div");
    chartRow.className = "chart-row";
    chartRow.appendChild(barLabel);
    chartRow.appendChild(bar);
    weeklyChartElement.appendChild(chartRow);
  });
}
updateWeeklyChart();
function updateDashboard() {
  totalPages = books.reduce(function (total, book) {
    return total + book.pages;
  }, 0);

  totalPagesElement.textContent = totalPages.toLocaleString();

  let pageTarget = loadPageTarget();
  pageTargetInput.value = pageTarget;

  const pagesRemaining = Math.max(0, pageTarget - totalPages);
  pageTargetElement.textContent = pageTarget.toLocaleString();
  pagesRemainingElement.textContent = pagesRemaining.toLocaleString();

  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysSinceMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const booksAddedThisWeek = books.filter(function (book) {
    return (
      new Date(book.createdAt) >= startOfWeek && new Date(book.createdAt) <= now
    );
  }).length;

  booksThisWeekElement.textContent = booksAddedThisWeek;

  const tagCounts = {};

  books.forEach(function (book) {
    const tag = book.tag;

    if (tagCounts[tag]) {
      tagCounts[tag]++;
    } else {
      tagCounts[tag] = 1;
    }
  });

  let mostCommonTag = "None";
  let highestCount = 0;

  for (const tag in tagCounts) {
    if (tagCounts[tag] > highestCount) {
      highestCount = tagCounts[tag];
      mostCommonTag = tag;
    }
  }

  mostCommonTagElement.textContent = mostCommonTag;
  totalBooksElement.textContent = books.length;
}

updateDashboard();
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
  if (searchInput.value !== searchInput.value.trim()) {
    searchError.textContent =
      "Invalid input: Leading or trailing spaces are not allowed.";

    showBooks([], null);
    return;
  }

  searchError.textContent = "";
  updateBookDisplay();
});
caseInsensitive.addEventListener("change", updateBookDisplay);
sortSelect.addEventListener("change", function () {
  updateBookDisplay();
});

const titleInput = document.getElementById("title");
const titleError = document.getElementById("title-error");
const tagInput = document.getElementById("tag");
const tagError = document.getElementById("tag-error");
const dateInput = document.getElementById("date");
const dateError = document.getElementById("date-error");
const authorInput = document.getElementById("author");
const authorError = document.getElementById("author-error");
const importError = document.getElementById("import-error");

titleInput.addEventListener("input", function () {
  if (titleInput.value !== titleInput.value.trim()) {
    titleError.textContent =
      "Invalid input: Leading or trailing spaces are not allowed.";
  } else {
    titleError.textContent = "";
  }
});

tagInput.addEventListener("input", function () {
  if (!validateTag(tagInput.value)) {
    tagError.textContent =
      "Invalid input: Please use letters, single spaces, or hyphens.";
  } else {
    tagError.textContent = "";
  }
});

authorInput.addEventListener("input", function () {
  if (authorInput.value !== authorInput.value.trim()) {
    authorError.textContent =
      "Invalid input: Please use letters, single spaces, or hyphens.";
  } else {
    authorError.textContent = "";
  }
});

dateInput.addEventListener("input", function () {
  if (!validateDate(dateInput.value)) {
    dateError.textContent = "Invalid input: Please enter a valid date.";
  } else {
    dateError.textContent = "";
  }
});

importBooksInput.addEventListener("change", function () {
  importError.textContent = "";
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
    if (!isTitleValid) {
      alert("Invalid input: Title cannot have leading or trailing spaces.");
      return;
    }

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
    if (editingBookId !== null) {
      const bookIndex = books.findIndex(function (item) {
        return item.id === editingBookId;
      });

      if (bookIndex !== -1) {
        books[bookIndex] = {
          ...book,
          id: editingBookId,
          createdAt: books[bookIndex].createdAt,
          updatedAt: new Date().toISOString(),
        };

        showStatus("Book updated successfully!");
      }
    } else {
      books.push(book);
      showStatus("Book added successfully!");
    }
    saveBooks(books);
    showBooks(books);
    updateWeeklyChart();
    updateDashboard();

    editingBookId = null;
    submitBookButton.textContent = "Save Book";
    bookForm.reset();
  }
});
