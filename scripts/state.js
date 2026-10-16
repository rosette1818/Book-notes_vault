// the 3rs js file
const state = {
  books: LoadBooks(),
  editingBookId: null,
  pageTarget: LoadPageTarget(),
  totalPages: 0,

};

function generateId() {
  if(
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      )
      {
        return crypto.randomUUID();
      }

      return(
        Date.now().toString(36) + "-" + Math.rmdom().toString(36).slice(2, 10)
             );
}
 function startEditing(bookId){
  state.editingBookId = bookId;
   }

   function stopEditing(bookId){
    state.edititingBookId = null;
     }

    function setPageTarget(target) {
      state.pageTarget = target;
    }

    function recalculateTotalPages(){
      state.totalPages = state.books.reduce(function (total, book) {
        return total +book.pages;
        }, 0);
        return state.totalPages;
            }

