const ABS_URL = _spPageContextInfo.webAbsoluteUrl;
var PendingApprovalData = [];
var MarketingMasterData = [];
var TableData = [];

const gridOptions = {
    columnDefs: [
        { headerName: "Emp.Id", field: 'AuthorId', maxWidth: 100 },
        { headerName: "Requested By", field: 'Author', enableRowGroup: true },
        { headerName: "RequestID", field: 'Title', maxWidth: 140 },
        { headerName: "Total Expected Expense", field: 'TotalExpectedExpense' },
        { headerName: "Status", field: 'Status', enableRowGroup: true, maxWidth: 140 },
        { headerName: "PendingWith", field: 'PendingWith', enableRowGroup: true, minWidth: 250 },
        { headerName: "PRNumber", field: 'PRNumber', maxWidth: 140 },
        { headerName: "Link", field: 'RequestLink', cellRenderer: viewActionCellRenderer, maxWidth: 100 },
        { headerName: "Created", field: 'Created', enableRowGroup: true, sort: 'desc' },
    ],
    defaultColDef: {
        sortable: true,
        resizable: true,
    },
    animateRows: true,
    rowGroupPanelShow: 'always',
    flex: 1,
    minWidth: 100,

    paginationPageSize: 100,
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

document.addEventListener('DOMContentLoaded', async function () {
    var gridDiv = document.querySelector('#dataGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    await FetchPendingApproval();
    await FetchMarketingMaster();
    JoinPendingApprovalWithMaster();

    gridOptions.api.setRowData(TableData.map((item) => {
        return {
            ...item,
            Created: new Date(item.Created),
        };
    }));
});

function LinkRanderer(params, label) {
    const viewActionValue = params.value;

    const linkElement = document.createElement('a');
    linkElement.href = viewActionValue;
    linkElement.textContent = label;

    linkElement.addEventListener('click', (event) => {
        event.preventDefault();
        window.open(viewActionValue, '_blank');
    });

    return linkElement;
}

const FetchPendingApproval = async () => {
    const base = `${ABS_URL}/_api/web/lists/getByTitle('PendingApproval')/items`;
    const queryx = `$expand=PendingWith,Author&$select=ID,Title,Author/Title,Author/Id,Created,Status,RequestLink,PendingWith/Id,PendingWith/Title&$top=20000`;
    const filter = `$filter=ProcessName eq 'MarketingActivity'`;

    const url = `${base}?&${queryx}&${filter}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json;odata=verbose"
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        PendingApprovalData = data.d.results.map(info => ({
            "Id": info.Id,
            "Title": info.Title,
            "Status": info.Status,
            "ID": info.ID,
            "Created": info.Created,
            "Author": info.Author.Title,
            "AuthorId": info.Author.Id,
            "RequestLink": info.RequestLink,
            "PendingWith": info.PendingWith?.results?.[0]?.Title ?? "N/A"
        }));
    } catch (error) {
        console.error("Error getting user information", error);
    }
};

const FetchMarketingMaster = async () => {
    const base = `${ABS_URL}/_api/web/lists/getByTitle('MarketingActivityMaster')/items`;
    const query = `$select=ID,TotalExpectedExpense,PRNumber&$top=20000`;

    const url = `${base}?&${query}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json;odata=verbose"
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        MarketingMasterData = data.d.results.map(info => ({
            "Id": info.Id,
            "TotalExpectedExpense": info.TotalExpectedExpense,
            "PRNumber": info.PRNumber
        }));

        console.log(MarketingMasterData);

    } catch (error) {
        console.error("Error getting user information", error);
    }

};


const JoinPendingApprovalWithMaster = () => {
    // Create a new array by matching Id from MarketingMasterData with Title from PendingApprovalData
    TableData = PendingApprovalData.map(item => {
        // Extract the integer part from the Title, assuming it's always in the format "IAT-<integer>"
        const titleInteger = parseInt(item.Title.split('-')[1]);

        // Find the corresponding MarketingMasterData object with the same Id
        const marketingData = MarketingMasterData.find(data => data.Id === titleInteger);

        return {
            "Author": item.Author,
            "AuthorId": item.AuthorId,
            "Title": item.Title,
            "Status": item.Status,
            "Created": item.Created,
            "RequestLink": item.RequestLink,
            "PendingWith": item.PendingWith,
            "PRNumber": marketingData?.PRNumber,
            "TotalExpectedExpense": marketingData?.TotalExpectedExpense ?? 0
        };
    });
};