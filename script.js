let studentCount = 0;

/* -----------------------------------
   LOAD SAVED DATA ON PAGE OPEN
----------------------------------- */
window.onload = function () {
    let data = JSON.parse(localStorage.getItem("studentData")) || [];
    const table = document.querySelector("#studentTable tbody");

    data.forEach((row, index) => {
        row[0] = index + 1; // auto-fix Sl. No
        table.insertAdjacentHTML("beforeend", generateTableRowHTML(row));
    });

    studentCount = data.length;
};


/* -----------------------------------
          ADD STUDENT
----------------------------------- */
function addStudent(event) {
    event.preventDefault();

    // Input values
    const name = val("name");
    const courses = val("courses");
    const courseFees = num("courseFees");
    const mobileNumber = val("mobileNumber");
    const joiningDate = val("joiningDate");

    const payment1 = num("Payment1");
    const payment2 = num("Payment2");
    const payment3 = num("Payment3");
    const payment4 = num("Payment4");
    const payment5 = num("Payment5");
    const payment6 = num("Payment6");

    const totalFees = num("totalFees");
    const balanceFees = num("balanceFees");
    const comments = val("comments");

    // Required validation
    if (!name || !courses || !courseFees || !mobileNumber || !joiningDate || !totalFees) {
        alert("⚠ Please fill all required fields!");
        return;
    }

    let balanceStatus = balanceFees === 0 ? "Completed" : "Not Completed";

    studentCount++;

    const rowData = [
        studentCount, name, courses, courseFees, mobileNumber,
        joiningDate, payment1, payment2, payment3, payment4,
        payment5, payment6, totalFees, balanceFees, balanceStatus, comments
    ];

    const table = document.querySelector("#studentTable tbody");
    table.insertAdjacentHTML("beforeend", generateTableRowHTML(rowData));

    saveToLocalStorage();
    document.querySelector("form").reset();
    document.getElementById("balanceFees").value = "";
}

/* Helper functions */
function val(id) {
    return document.getElementById(id).value.trim();
}

function num(id) {
    return Number(document.getElementById(id).value) || 0;
}

/* -----------------------------------
       AUTO CALCULATE BALANCE
----------------------------------- */
["totalFees", "Payment1", "Payment2", "Payment3",
 "Payment4", "Payment5", "Payment6"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", calculateBalance);
});

function calculateBalance() {
    let total = num("totalFees");

    let payments = [
        num("Payment1"), num("Payment2"), num("Payment3"),
        num("Payment4"), num("Payment5"), num("Payment6")
    ];

    let balance = total - payments.reduce((a, b) => a + b, 0);
    document.getElementById("balanceFees").value = balance < 0 ? 0 : balance;
}

/* -----------------------------------
       DELETE ROW + SAVE
----------------------------------- */
function deleteRow(button) {
    button.closest("tr").remove();
    reindexTable();
    saveToLocalStorage();
}

/* Fix Sl. No after delete */
function reindexTable() {
    const rows = document.querySelectorAll("#studentTable tbody tr");

    rows.forEach((tr, index) => {
        tr.children[0].innerText = index + 1;
    });

    studentCount = rows.length;
}

/* -----------------------------------
       SAVE TO LOCAL STORAGE
----------------------------------- */
function saveToLocalStorage() {
    let rows = [];
    document.querySelectorAll("#studentTable tbody tr").forEach(tr => {
        let cells = [...tr.children].slice(0, 16).map(td => td.innerText);
        rows.push(cells);
    });

    localStorage.setItem("studentData", JSON.stringify(rows));
}

/* -----------------------------------
         EXPORT TO EXCEL
----------------------------------- */
function exportToExcel() {
    let data = JSON.parse(localStorage.getItem("studentData")) || [];

    if (data.length === 0) {
        alert("No data to export!");
        return;
    }

    let worksheet = XLSX.utils.aoa_to_sheet([
        ["Sl No.", "Name", "Courses", "Course Fees", "Mobile Number",
         "Joining Date", "Payment-1", "Payment-2", "Payment-3", "Payment-4",
         "Payment-5", "Payment-6", "Total Fees", "Balance Fees",
         "Status", "Comments"],
        ...data
    ]);

    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "Student_Details.xlsx");
}

/* -----------------------------------
      GENERATE TABLE ROW HTML
----------------------------------- */
function generateTableRowHTML(row) {
    return `
    <tr class="border-b">
        ${row.map(col => `<td class="py-2 px-3">${col}</td>`).join("")}
        <td class="py-2 px-3">
            <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteRow(this)">
                Delete
            </button>
        </td>
    </tr>`;
}
