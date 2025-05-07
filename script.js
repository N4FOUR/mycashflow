function input_bubble() {
    const frame = document.getElementById("data-input-window");
    frame.classList.toggle("hidden");
}

function cancel() {
    const frame = document.getElementById("data-input-window");
    frame.className = "hidden";
}

function new_row(amount, type, date, index) {
    const table_body = document.getElementById("cash-flow-table");
    // create a new row and insert at the top of table
    // set the data-index attribute to the index of the row
    const new_row = table_body.insertRow(0);
    new_row.setAttribute('data-index', index);
    new_row.insertCell(0).innerHTML = amount;
    // insert data to column
    const typerow = new_row.insertCell(1).innerHTML = type;
    new_row.insertCell(2).innerHTML = date;
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", () => {
        const packdata = JSON.parse(localStorage.getItem("packdata")) || [];
        const rowIndex = new_row.getAttribute('data-index');
        packdata.splice(rowIndex, 1);
        localStorage.setItem("packdata", JSON.stringify(packdata));
        table_body.deleteRow(new_row.rowIndex);
        load_data();
    });
    new_row.insertCell(3).appendChild(deleteButton); // Append the button to the last cell of the row
}

function load_data() {
    const table_body = document.getElementById("cash-flow-table");
    table_body.innerHTML = ""; // Clear the table
    const packdata = JSON.parse(localStorage.getItem("packdata")) || [];
    let total = 0;
    console.log(packdata);
    packdata.forEach((data, index) => {
        new_row(data.amount, data.type, data.date, index);
        if (data.type === "income") {
            total += parseFloat(data.amount); // Add income to total
        } 
        else if (data.type === "expense") {
            total -= parseFloat(data.amount); // Subtract expense from total
        }
    });
    const totalText = document.getElementById("total-text");
    totalText.innerText = "Total: " + total.toFixed(2); // Display total
}

function submit() {
    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;

    if (amount && type && date) {
        const packdata = {
            amount: amount,
            type: type,
            date: date,
        }

        let existingData = JSON.parse(localStorage.getItem("packdata"));

        if (!Array.isArray(existingData)) {
            existingData = [];
        }

        existingData.push(packdata);
        localStorage.setItem("packdata", JSON.stringify(existingData));

        cancel(); // Close the input bubble
        load_data();
    } else {
        alert("Please fill in all fields.");
    }
}

function clear_table() {
    let ans = prompt("Clear all data?");
    if(ans === "yes") {
        localStorage.removeItem("packdata");
        console.log("clear storage");
        load_data();
    }
    else {
        console.log("Cancel Clear Data");
    }
}

// Add envent to buttons
const subminitButton = document.getElementById("submit"); // sunmit
subminitButton.addEventListener("click", submit);

const cancelButton = document.getElementById("cancel"); // cancel
cancelButton.addEventListener("click", cancel);

const addlistButton = document.document.getElementById("add-list"); // add list
addlistButton.addEventListener("click", input_bubble);

const clearButton = document.getElementById("clear-list"); //clear
clearButton.addEventListener("click", clear_table);

// Load data when the page loads
document.addEventListener("DOMContentLoaded", load_data);
