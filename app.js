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

// ----- page code -----
document.addEventListener('DOMContentLoaded', () => {

    let form = document.getElementById('lend-form');
    let tblBody = document.getElementById('loan-list');

    // ----- summary -----
    function showSummary() {
        let loans = BookLibrary.getLoans();
        document.getElementById('total-loans').textContent = loans.length;
        document.getElementById('overdue-loans').textContent = BookLibrary.countOverdue();
    }

    // ----- table -----
    function showTable() {
        let loans = BookLibrary.getLoans();
        tblBody.innerHTML = '';

        loans.forEach((loan, index) => {
            let tblRow = document.createElement('tr');

            let titleTd = document.createElement('td');
            titleTd.textContent = loan.title;

            let authorTd = document.createElement('td');
            authorTd.textContent = loan.author;

            let borrowerTd = document.createElement('td');
            borrowerTd.textContent = loan.borrower;

            let dueDateTd = document.createElement('td');
            dueDateTd.textContent = loan.dueDate;

            let genreTd = document.createElement('td');
            genreTd.textContent = loan.genre;

            let statusTd = document.createElement('td');
            let status = BookLibrary.getStatus(loan);
            let statusSpan = document.createElement('span');
            statusSpan.className = 'status status-' + status.toLowerCase();
            statusSpan.textContent = status;
            statusTd.appendChild(statusSpan);

            let actionTd = document.createElement('td');

            if (!loan.returned) {
                let returnBtn = document.createElement('button');
                returnBtn.className = 'btn btn-small btn-return';
                returnBtn.textContent = 'Return';
                returnBtn.addEventListener('click', () => {
                    BookLibrary.markReturned(index);
                    refresh();
                });
                actionTd.appendChild(returnBtn);
            }

            let deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-small btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                BookLibrary.deleteLoan(index);
                refresh();
            });
            actionTd.appendChild(deleteBtn);

            tblRow.appendChild(titleTd);
            tblRow.appendChild(authorTd);
            tblRow.appendChild(borrowerTd);
            tblRow.appendChild(dueDateTd);
            tblRow.appendChild(genreTd);
            tblRow.appendChild(statusTd);
            tblRow.appendChild(actionTd);

            tblBody.appendChild(tblRow);
        });

        let emptyMessage = document.getElementById('empty-message');
        if (loans.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
        }
    }

    function refresh() {
        showTable();
        showSummary();
    }

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
        refresh();
    });

    refresh();
});
