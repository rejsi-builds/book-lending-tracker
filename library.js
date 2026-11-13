// JavaScript library for Book Lending Tracker
// Reusable loan logic (storage, status, overdue). The page code lives in app.js.


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

    markReturned: function (index) {
        let loans = this.getLoans();
        loans[index].returned = true;
        this.saveLoans(loans);
    },

    deleteLoan: function (index) {
        let loans = this.getLoans();
        loans.splice(index, 1);
        this.saveLoans(loans);
    },

    // today as YYYY-MM-DD, same format as the date input
    getToday: function () {
        let now = new Date();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        return now.getFullYear() + '-' + month + '-' + day;
    },

    // a loan is overdue when it is not returned and the due date is before today
    isOverdue: function (loan) {
        return loan.returned === false && loan.dueDate < this.getToday();
    },

    getStatus: function (loan) {
        if (loan.returned) {
            return 'Returned';
        }
        if (this.isOverdue(loan)) {
            return 'Overdue';
        }
        return 'Lent';
    },

    countOverdue: function () {
        let loans = this.getLoans();
        let count = 0;
        loans.forEach((loan) => {
            if (this.isOverdue(loan)) {
                count++;
            }
        });
        return count;
    },
};