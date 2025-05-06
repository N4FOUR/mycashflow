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
    const new_row = table_body.insertRow(0); // Insert a new row at the end of the table
    new_row.setAttribute('data-index', index); // Store the data index in the row
    new_row.insertCell(0).innerHTML = amount; // Create a new cell in the row
    const typerow = new_row.insertCell(1); // Create a new cell in the row
    typerow.innerHTML = type; // Create a new cell in the row
    if (type === "Income") {
        typerow.style.color = "green"; // Green for income
    }
    else if (type === "Expense") {
        typerow.style.color = "red"; // Red for expense
    }
    new_row.insertCell(2).innerHTML = date; // Create a new cell in the row
    const deleteButton = document.createElement("button"); // Create a delete button
    deleteButton.innerHTML = "Delete"; // Set button text
    deleteButton.addEventListener("click", () => {
        const packdata = JSON.parse(localStorage.getItem("packdata")) || [];
        const rowIndex = new_row.getAttribute('data-index'); // Get the index from the row
        packdata.splice(rowIndex, 1); // Remove the data from the array
        localStorage.setItem("packdata", JSON.stringify(packdata)); // Update local storage
        table_body.deleteRow(new_row.rowIndex); // Delete the row from the table
        load_data(); // Reload data to update total
    }); // Add event listener to the button
    new_row.insertCell(3).appendChild(deleteButton); // Append the button to the last cell of the row
}

function load_data() {
    const table_body = document.getElementById("cash-flow-table");
    table_body.innerHTML = ""; // Clear the table before reloading data
    const packdata = JSON.parse(localStorage.getItem("packdata")) || [];
    let total = 0;
    console.log(packdata);
    packdata.forEach((data, index) => {
        new_row(data.amount, data.type, data.date, index); // Pass the index to new_row
        if (data.type === "income") {
            total += parseFloat(data.amount); // Add income to total
        } 
        else if (data.type === "expense") {
            total -= parseFloat(data.amount); // Subtract expense from total
        }
    });
    const totalText = document.getElementById("total-text");
    totalText.innerText = "Total: " + total.toFixed(2); // Display total in the footer
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
// Event listeners for buttons
const subminitButton = document.getElementById("submit");
subminitButton.addEventListener("click", submit);
const cancelButton = document.getElementById("cancel");
cancelButton.addEventListener("click", cancel);

// Load data when the page loads
document.addEventListener("DOMContentLoaded", load_data);

window.addEventListener("storage", function(event) {
    if (event.key === "packdata") {
        load_data(); // Only reload when packdata is changed
    }
});
