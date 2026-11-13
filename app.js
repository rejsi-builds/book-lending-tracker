// Book Lending Tracker (app)
// Everything specific to books and loans lives here.
// The generic tools (storage, validation, dates, DOM helper) come from library.js (Lib).

document.addEventListener('DOMContentLoaded', () => {

    const loanStore = Lib.createStore('lentBooks');

    // the required form fields: the loan property, the input id, and the error message
    const fields = [
        { key: 'title', id: 'title', message: 'Please enter the book title.' },
        { key: 'author', id: 'author', message: 'Please enter the author.' },
        { key: 'borrower', id: 'borrower', message: 'Please enter who borrowed the book.' },
        { key: 'dueDate', id: 'due-date', message: 'Please choose a due date.' },
        { key: 'genre', id: 'genre', message: 'Please select a genre.' }
    ];

    // loan rules
    function isOverdue(loan) {
        return !loan.returned && loan.dueDate < Lib.today();
    }

    function getStatus(loan) {
        if (loan.returned) {
            return 'Returned';
        }
        if (isOverdue(loan)) {
            return 'Overdue';
        }
        return 'Lent';
    }

    // which badge style from the CSS library goes with which status
    const badgeForStatus = {
        'Lent': 'badge badge-success',
        'Overdue': 'badge badge-danger',
        'Returned': 'badge badge-muted'
    };

    // form errors
    function clearErrors() {
        fields.forEach((field) => {
            document.getElementById(field.id).classList.remove('is-invalid');
            document.getElementById(field.id + '-error').textContent = '';
        });
    }

    function showErrors(errors) {
        fields.forEach((field) => {
            if (errors[field.key]) {
                document.getElementById(field.id).classList.add('is-invalid');
                document.getElementById(field.id + '-error').textContent = errors[field.key];
            }
        });
    }

    // summary
    function showSummary() {
        let loans = loanStore.all();
        let overdue = loans.filter(isOverdue).length;
        document.getElementById('total-loans').textContent = loans.length;
        document.getElementById('overdue-loans').textContent = overdue;
    }

    //table
    function buildRow(loan) {
        let status = getStatus(loan);
        let actions = [];

        if (!loan.returned) {
            actions.push(Lib.el('button', {
                className: 'btn btn-success btn-sm',
                text: 'Return',
                onClick: () => {
                    loanStore.update(loan.id, { returned: true });
                    refresh();
                }
            }));
        }

        actions.push(Lib.el('button', {
            className: 'btn btn-danger btn-sm',
            text: 'Delete',
            onClick: () => {
                loanStore.remove(loan.id);
                refresh();
            }
        }));

        return Lib.el('tr', {}, [
            Lib.el('td', { text: loan.title }),
            Lib.el('td', { text: loan.author }),
            Lib.el('td', { text: loan.borrower }),
            Lib.el('td', { text: loan.dueDate }),
            Lib.el('td', { text: loan.genre }),
            Lib.el('td', {}, [Lib.el('span', { className: badgeForStatus[status], text: status })]),
            Lib.el('td', {}, actions)
        ]);
    }

    function showTable() {
        let loans = loanStore.all();
        let tableBody = document.getElementById('loan-list');
        tableBody.innerHTML = '';

        loans.forEach((loan) => {
            tableBody.appendChild(buildRow(loan));
        });

        document.getElementById('empty-message').classList.toggle('hidden', loans.length > 0);
    }

    function refresh() {
        showTable();
        showSummary();
    }

    // form submit
    let form = document.getElementById('lend-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let values = {};
        let rules = {};
        fields.forEach((field) => {
            values[field.key] = document.getElementById(field.id).value.trim();
            rules[field.key] = field.message;
        });

        clearErrors();
        let errors = Lib.validate(values, rules);

        if (Object.keys(errors).length > 0) {
            showErrors(errors);
            return;
        }

        values.returned = false;
        loanStore.add(values);
        form.reset();
        refresh();
    });

    refresh();
});