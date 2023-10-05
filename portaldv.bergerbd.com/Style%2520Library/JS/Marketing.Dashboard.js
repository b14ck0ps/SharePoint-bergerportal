var filteredObjects = [];

const gridOptions = {
    columnDefs: [
        { headerName: "Requested By", field: 'Author', enableRowGroup: true },
        { headerName: "RequestID", field: 'Title' },
        { headerName: "Created", field: 'Created', enableRowGroup: true },
        { headerName: "Emp.Id", field: 'AuthorId', maxWidth: 100 },
        { headerName: "Request for", field: 'PendinWith', enableRowGroup: true, minWidth: 300 },
        { headerName: "Amount", field: 'Amount', maxWidth: 150 },
        { headerName: "Status", field: 'Status', enableRowGroup: true, minWidth: 300 },
        { headerName: "PendingWith", field: 'PendingWith', enableRowGroup: true },
        { headerName: "View/Action", field: 'View_Action', cellRenderer: viewActionCellRenderer, maxWidth: 150 },
    ],
    defaultColDef: {
        sortable: true,
        resizable: true,
    },
    animateRows: true,
    rowGroupPanelShow: 'always',
    flex: 1,
    minWidth: 100,

    paginationPageSize: 5,
    suppressRowClickSelection: true,
    groupSelectsChildren: true,
    rowSelection: 'multiple',
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    pagination: true,
};


function onFilterTextBoxChanged() {
    gridOptions.api.setQuickFilter(
        document.getElementById('filter-text-box').value
    );
}

function onBtExport() {
    gridOptions.api.exportDataAsExcel();
}

function viewActionCellRenderer(params) {
    if (params.value === undefined) return null;
    return LinkRanderer(params, 'View');
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#dataGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    const base = "https://portaldv.bergerbd.com/leaveauto/_api/web/lists/getByTitle('PendingApproval')/items";
    const queryx = `$expand=PendingWith,Author&$select=ID,Title,Author/Title,Created,Status,PendingWith/Id,PendingWith/Title`;

    const url = `${base}?&${queryx}`;

    fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json;odata=verbose"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Map the array of objects to create an array of filtered objects
            filteredObjects = data.d.results.map(info => ({
                "Id": info.Id,
                "Title": info.Title,
                "Status": info.Status,
                "ID": info.ID,
                "Created": info.Created,
                //"PendingWith": info?.PendingWith?.results[0]?.Title || "",
                "Author": info.Author.Title
            }));
            console.log(filteredObjects);
            gridOptions.api.setRowData(
                filteredObjects.map((item) => {
                    return {
                        ...item,
                        Created: new Date(item.Created),
                    }
                })
            );
        })
        .catch(error => {
            console.error("Error getting user information", error);
        })
        .finally(() => {

        });
});

function LinkRanderer(params, label) {
    const viewActionValue = `?id=${params.value}`;

    const linkElement = document.createElement('a');
    linkElement.href = viewActionValue;
    linkElement.textContent = label;

    linkElement.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(viewActionValue, '_blank');
    });

    return linkElement;
}

console.log('hi from override');