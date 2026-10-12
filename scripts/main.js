const bookForm = document.getElementById("book-form");
const books = loadBooks();
const totalBooksElement = document.getElementById("total-books");
const totalPagesElement = document.getElementById("total-pages");
const mostCommonTagElement = document.getElementById("most-common-tag");
const booksThisWeekElement = document.getElementById("books-this-week");
const pageTargetElement = document.getElementById("page-target");
const pagesRemainingElement = document.getElementById("pages-remaining");
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
const totalPages = books.reduce(function (total, book) {
  return total + book.pages;
}, 0);
totalPagesElement.textContent = totalPages.toLocaleString();
const pageTarget = 5000;
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
    updateWeeklyChart();
    console.log("Book records:", book);
    alert("Book added successfully!");
    bookForm.reset();
  }
});
