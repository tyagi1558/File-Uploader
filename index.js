// const button = document.getElementById("colorButton");
const container = document.querySelector(".container");
const fileInput = document.getElementById("fileInput");
const dataTable = document.getElementById("dataTable");

// button.addEventListener("click", () => {
//     const colors = ["#FF5733", "#33FF57", "#5733FF", "#33FFF7"];
//     const randomColor = colors[Math.floor(Math.random() * colors.length)];
//     container.style.backgroundColor = randomColor;
// });

fileInput.addEventListener("change", () => {
    const selectedFile = fileInput.files[0];

    if (selectedFile) {
        const allowedExtensions = ["csv", "xlsx"];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        if (allowedExtensions.includes(fileExtension)) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const data = e.target.result;

                if (fileExtension === "xlsx") {
                    const workbook = XLSX.read(data, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const table = XLSX.utils.sheet_to_html(worksheet);

                    dataTable.innerHTML = table;

                    localStorage.setItem("tableData", table);
                } else if (fileExtension === "csv") {
                    const text = e.target.result;
                    const lines = text.split("\n");
                    let table = "<table>";
                    lines.forEach(function (line) {
                        table += "<tr>";
                        const cells = line.split(",");
                        cells.forEach(function (cell) {
                            table += "<td>" + cell + "</td>";
                        });
                        table += "</tr>";
                    });
                    table += "</table>";

                    dataTable.innerHTML = table;

                    localStorage.setItem("tableData", table);
                }
            };

            reader.readAsBinaryString(selectedFile);
        } else {
            alert("Invalid file type. Please upload a CSV or XLSX file.");
            fileInput.value = '';
        }
    }
});

window.addEventListener("load", () => {
    const storedTableData = localStorage.getItem("tableData");
    if (storedTableData) {
        dataTable.innerHTML = storedTableData;
    }
});
