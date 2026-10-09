function validateTitle(title) {
  return !/^\s*$/.test(title);
}
// console.log(validateTitle(" "));
// console.log(validateTitle("first"));

function validateAuthor(author) {
  return !/^\s*$/.test(author);
}

function validatePages(pages) {
  return /^\d+$/.test(String(pages)) && Number(pages) > 0 && Number(pages) <= 5000;
}

function validateTag(tag) {
  return /^[A-Za-z -]+$/.test(tag);
}

function validateDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function hasRepeatedWords(title) {
  return /\b(\w+)\s+\1\b/i.test(title);
}
// console.log(hasRepeatedWords(" The biok the"))
