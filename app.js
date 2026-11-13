// Page code for Book Lending Tracker
// Uses the BookLibrary object from library.js (loaded before this file).

// page code
document.addEventListener('DOMContentLoaded', () => {

    let form = document.getElementById('lend-form');
    let tblBody = document.getElementById('loan-list');

    // validation 
    function showError(fieldId, message) {
        document.getElementById(fieldId).classList.add('invalid');
        document.getElementById(fieldId + '-error').textContent = message;
    }

    function clearErrors() {
        let fieldIds = ['title', 'author', 'borrower', 'due-date', 'genre'];
        fieldIds.forEach((fieldId) => {
            document.getElementById(fieldId).classList.remove('invalid');
            document.getElementById(fieldId + '-error').textContent = '';
        });
    }

    function validateForm() {
        let valid = true;
        clearErrors();

        if (document.getElementById('title').value.trim() === '') {
            showError('title', 'Please enter the book title.');
            valid = false;
        }
        if (document.getElementById('author').value.trim() === '') {
            showError('author', 'Please enter the author.');
            valid = false;
        }
        if (document.getElementById('borrower').value.trim() === '') {
            showError('borrower', 'Please enter who borrowed the book.');
            valid = false;
        }
        if (document.getElementById('due-date').value === '') {
            showError('due-date', 'Please choose a due date.');
            valid = false;
        }
        if (document.getElementById('genre').value === '') {
            showError('genre', 'Please select a genre.');
            valid = false;
        }

        return valid;
    }

    // summary
    function showSummary() {
        let loans = BookLibrary.getLoans();
        document.getElementById('total-loans').textContent = loans.length;
        document.getElementById('overdue-loans').textContent = BookLibrary.countOverdue();
    }

    // table
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

    // form submit
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

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