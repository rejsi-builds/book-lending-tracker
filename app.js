// ===== JavaScript library for Book Lending Tracker =====

// ----- data functions (the "library") -----
const BookLibrary = {

    storageKey: 'lentBooks',

    // returns all loans saved in localStorage
    getLoans: function () {
        let loans = [];
        let saved = localStorage.getItem(this.storageKey);
        if (saved !== null) {
            loans = JSON.parse(saved);
        }
        return loans;
    },

    saveLoans: function (loans) {
        localStorage.setItem(this.storageKey, JSON.stringify(loans));
    },

    addLoan: function (loan) {
        let loans = this.getLoans();
        loans.push(loan);
        this.saveLoans(loans);
    },
};

// ----- page code -----
document.addEventListener('DOMContentLoaded', () => {

    let form = document.getElementById('lend-form');

    // ----- form submit -----
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let loan = {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            borrower: document.getElementById('borrower').value.trim(),
            dueDate: document.getElementById('due-date').value,
            genre: document.getElementById('genre').value,
            returned: false
        };

        BookLibrary.addLoan(loan);
        form.reset();
    });
});
