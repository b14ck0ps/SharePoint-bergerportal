const ABS_URL = _spPageContextInfo.webAbsoluteUrl;
const API_GET_HEADERS = { "accept": "application/json;odata=verbose" };
const API_POST_HEADERS = {
    "Accept": "application/json; odata=verbose",
    "Content-Type": "application/json; odata=verbose",
    "X-RequestDigest": $("#__REQUESTDIGEST").val()
};

const PendingApprovalUniqueId = new URLSearchParams(window.location.search).get('UniqueId');
const USER_EMAIL_ID = _spPageContextInfo.userId;
const OPM_INFO = { id: 0, name: "" };
const RequesterInfo = {
    name: "",
    email: "",
    id: 0
};

let CurrentPendingWith = null;



/**
 * Angular module for the Marketing Activity app.
 * @module MarketingActivityApp
 */
const MarketingActivityModule = angular.module("MarketingActivityApp", []);

MarketingActivityModule.controller('UserController', ['$scope', '$http', function ($scope, $http) {
    $scope.today = new Date();
    $scope.UserInfo = {};

    const base = getApiEndpoint("bergerEmployeeInformation");
    const filter = `$filter=Email/ID eq '${USER_EMAIL_ID}'`;
    const query = `$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter&$expand=Email/ID,OptManagerEmail/ID&$top=1`;

    $scope.IsLoading = true;
    $http({
        method: "GET",
        url: `${base}?${filter}&${query}`,
        headers: API_GET_HEADERS
    })
        .then(function (response) {
            $scope.UserInfo = response.data.d.results[0];
            RequesterInfo.name = $scope.UserInfo.EmployeeName;
            RequesterInfo.email = $scope.UserInfo.Email.EMail;
            RequesterInfo.id = $scope.UserInfo.Email.ID;

            OPM_INFO.id = $scope.UserInfo.OptManagerEmail.ID;
            OPM_INFO.name = $scope.UserInfo.OptManagerEmail.Title;
        })
        .catch((e) => console.log("Error getting user information", e))
        .finally(() => $scope.IsLoading = false);
}]);


MarketingActivityModule.controller('FormController', ['$scope', '$http', function ($scope, $http) {

    var RequestId = null;
    var Status = null;

    $scope.services = services;
    $scope.activityTypes = activityTypes;
    $scope.budgetTypes = budgetTypes;
    $scope.brands = brands;
    $scope.commitmentItems = commitmentItems;
    $scope.vendorQuotations = vendorQuotations;

    $scope.MapActivityName = () => getActivityNames();
    $scope.MapCostHead = () => getCostHead();
    $scope.clickSaveOrSubmit = (status) => { saveOrSubmit(status); }

    if (!PendingApprovalUniqueId) {
        $scope.showSaveOrSubmitBtn = true;
    } else { /* If Some one click on a link from `Pending Approval` list */
        $scope.showApproveBtn = true;
        $scope.showChangeBtn = true;
        $scope.showRejectBtn = true;
        $scope.IsDataReadOnly = true;

        const base = getApiEndpoint("PendingApproval");
        const filter = `$filter=substringof('${PendingApprovalUniqueId}',RequestLink)`;
        const query = `$expand=PendingWith&$select=Title,ProcessName,Status,PendingWith/Id`;

        $scope.IsLoading = true;
        /* Getting the request id, status and pendingwith from `PendingApproval` list */
        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_GET_HEADERS
        })
            .then((response) => {
                const Row = response.data.d.results[0];
                RequestId = parseInt(Row.Title.replace(/\D/g, ''), 10); /* convert `MA-1` to `1` */
                Status = Row.Status;
                CurrentPendingWith = Row.PendingWith.results[0].Id;
            })
            .catch((e) => console.log("Error getting user information", e))
            .finally(() => {
                if (!RequestId) {
                    $scope.IsLoading = false;
                    return;
                }

                const base = getApiEndpoint("MarketingActivityMaster");
                const filter = `$filter=ID eq '${RequestId}'`;
                const query = `$select=ID,ActivityName,ServiceName,ActivityType,BudgetType,CostHead,BrandDescription,CommitmentItem,TotalExpectedExpense,ActivityStartDate,ExpectedDeliveryDate,ServiceReceivingDate,RequiredVendorQuotation,SingleVendorJustification,ProjectName,Status,AuthorId`;

                /* Getting the request data from `MarketingActivityMaster` list */
                $http({
                    method: "GET",
                    url: `${base}?${filter}&${query}`,
                    headers: API_GET_HEADERS
                })
                    .then((response) => {
                        const Row = response.data.d.results[0];
                        $scope.requestCode = `MA-${Row.ID}`;
                        $scope.FormData = { ...Row };
                    })
                    .catch((e) => console.log("Error getting user information", e))
                    .finally(() => $scope.IsLoading = false);

            });

    }

    /**
     * Retrieves marketing activity names from a SharePoint list `MarketingActivityMapper` based on `$scope.services` and populates the `Activity Name` dropdown.
     * @returns {void}
     */
    const getActivityNames = () => {

        const base = getApiEndpoint("MarketingActivityMapper");
        const filter = `$filter=ServiceName eq '${$scope.FormData.ServiceName}'`;
        const query = `$select=ActivityName`;
        $scope.IsLoading = true;
        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_GET_HEADERS
        })
            .then((response) => $scope.activityNamesDropdownList = response.data.d.results.map((item) => item.ActivityName))
            .catch((e) => console.log("Error getting user information", e))
            .finally(() => $scope.IsLoading = false);
    }

    /**
     * Retrieves cost head from a SharePoint list `MarketingActivityMapper` based on `$scope.selectedActivity` and populates the `Cost Head` dropdown.
     * @returns {void}
     */
    const getCostHead = () => {

        const base = getApiEndpoint("MarketingActivityMapper");
        const filter = `$filter=ActivityName eq '${$scope.FormData.ActivityName}'`;
        const query = `$select=CostHead`;

        $scope.IsLoading = true;
        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_GET_HEADERS
        })
            .then((response) => $scope.costHeadDropdownList = response.data.d.results.map((item) => item.CostHead))
            .catch((e) => console.log("Error getting user information", e))
            .finally(() => $scope.IsLoading = false);
    }

    /**
     * Saves the form data to a SharePoint list `MarketingActivity`.
     * @param {string} status Status of the form (Save or Submit)
     * @returns {void}
     */
    const saveOrSubmit = (status) => {
        $scope.IsLoading = true;
        const url = getApiEndpoint("MarketingActivityMaster");

        /* Spreding the FormData and adding the metadata */
        const marketingActivityMasterData = {
            ...$scope.FormData,
            'Status': status,

            // 'PendingWith': { id: OPM_INFO.id }, TODO: Fix this
            '__metadata': { "type": "SP.Data.MarketingActivityMasterListItem" }
        };

        $http({
            headers: API_POST_HEADERS,
            method: "POST",
            url: url,
            data: marketingActivityMasterData,
        })
            .then((response) => {
                /**
                 * Saves the request to a SharePoint list `PendingApproval`.
                 * @file constants.js
                 */
                saveAtMyTask(`MA-${response.data.d.ID}`, 'MarketingActivity', RequesterInfo.name, status, RequesterInfo.id.toString(), RequesterInfo.email, OPM_INFO.id, `	https://portaldv.bergerbd.com/leaveauto/SitePages/MarketingActivity.aspx?UniqueId=${crypto.randomUUID()}`);
            })
            .catch(function (message) {
                console.log(`Error saving data: ${message}`)
            })
            .finally(() => $scope.IsLoading = false);
    }

}]);

/**
 * Retrieves the base URL for a SharePoint list.
 * @param {string} ListName Name of the SharePoint list
 * @example getApiEndpoint("MarketingActivityMapper")
 * @returns {string} API base URL
 */
const getApiEndpoint = (ListName) => `${ABS_URL}/_api/web/lists/getByTitle('${ListName}')/items`;

const services = [
    { value: '', label: '-- Select Service --' },
    { value: 'TV Media', label: 'TV Media' },
    { value: 'TV Production and TVC', label: 'TV Production and TVC' },
    { value: 'Redio Media', label: 'Redio Media' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Sponsorship', label: 'Sponsorship' },
    { value: 'Press Ad', label: 'Press Ad' },
    { value: 'Outdoor Billboard, Wall and Shutter Painting', label: 'Outdoor Billboard, Wall and Shutter Painting' },
    { value: 'Shop Sign and Decoration', label: 'Shop Sign and Decoration' },
    { value: 'Software Development and Other', label: 'Software Development and Other' },
    { value: 'Corporate Marketing Service', label: 'Corporate Marketing Service' },
    { value: 'Market Research - Retail Audit', label: 'Market Research - Retail Audit' },
    { value: 'Market Research', label: 'Market Research' },
    { value: 'Scratch card, Mobile SMS, Recharge Service', label: 'Scratch card, Mobile SMS, Recharge Service' },
    { value: 'Dealer Shop Merchandising', label: 'Dealer Shop Merchandising' },
    { value: 'Event Management (Art, Competition, Awards, Daily Star Anniversary)', label: 'Event Management (Art, Competition, Awards, Daily Star Anniversary)' },
    { value: 'Consumer Promotion- Activation', label: 'Consumer Promotion- Activation' },
    { value: 'Fair and Exhibition', label: 'Fair and Exhibition' },
    { value: 'Pack Design & Creative', label: 'Pack Design & Creative' },
    { value: 'Franchise Expense-Experience Zone', label: 'Franchise Expense-Experience Zone' },
    { value: 'Umbrella - courier', label: 'Umbrella - courier' },
    { value: 'Shomporko Club scheme', label: 'Shomporko Club scheme' },
    { value: 'PTI service', label: 'PTI service' }
];

const activityTypes = [
    { value: '', label: '-- Select Activity Type --' },
    { value: 'One Time', label: 'One Time' },
    { value: 'Monthly Recurring', label: 'Monthly Recurring' }
];

const budgetTypes = [
    { value: '', label: '-- Select Budget Type --' },
    { value: 'Available Budget', label: 'Available Budget' },
    { value: 'Need to Transfer', label: 'Need to Transfer' },
    { value: 'Supplementary', label: 'Supplementary' }
];

const brands = [
    { value: '', label: '-- Select Brand Description --' },
    { value: 'Adhesive -Power Bond', label: 'Adhesive -Power Bond' },
    { value: 'Adhesive -Tex Bond', label: 'Adhesive -Tex Bond' },
    { value: 'APE', label: 'APE' },
    { value: 'Auto Refinish', label: 'Auto Refinish' },
    { value: 'Berger Experience Zone (Decorative)', label: 'Berger Experience Zone (Decorative)' },
    { value: 'BREATHE EASY', label: 'BREATHE EASY' },
    { value: 'BREATHE EASY Ena', label: 'BREATHE EASY Ena' },
    { value: 'Color Bank', label: 'Color Bank' },
    { value: 'Corporate Brand', label: 'Corporate Brand' },
    { value: 'Damp Guard', label: 'Damp Guard' },
    { value: 'Decorative', label: 'Decorative' },
    { value: 'DUROCEM', label: 'DUROCEM' },
    { value: 'EASY CLEAN', label: 'EASY CLEAN' },
    { value: 'EP Tools (Express Painting)', label: 'EP Tools (Express Painting)' },
    { value: 'Express Painting Service', label: 'Express Painting Service' },
    { value: 'Home Décor Branding', label: 'Home Décor Branding' },
    { value: 'Industrial Paints', label: 'Industrial Paints' },
    { value: 'INNOVA', label: 'INNOVA' },
    { value: 'JHILIK', label: 'JHILIK' },
    { value: 'LS. Metallic Finish', label: 'LS. Metallic Finish' },
    { value: 'LSE', label: 'LSE' },
    { value: 'Marine Paints', label: 'Marine Paints' },
    { value: 'Mr.EXPERT DAMP GUARD', label: 'Mr.EXPERT DAMP GUARD' },
    { value: 'Painters App', label: 'Painters App' },
    { value: 'Powder Coating', label: 'Powder Coating' },
    { value: 'PRE TREATMENT CHEM', label: 'PRE TREATMENT CHEM' },
    { value: 'Printing Ink', label: 'Printing Ink' },
    { value: 'REX', label: 'REX' },
    { value: 'RIN', label: 'RIN' },
    { value: 'ROBB WALL PUTTY', label: 'ROBB WALL PUTTY' },
    { value: 'ROBB WATER SEALER', label: 'ROBB WATER SEALER' },
    { value: 'RSE', label: 'RSE' },
    { value: 'Salt Safe', label: 'Salt Safe' },
    { value: 'SPD', label: 'SPD' },
    { value: 'Touch putty (Decorative)', label: 'Touch putty (Decorative)' },
    { value: 'Value Club App, LMS, Happy Wallet, MR/VR', label: 'Value Club App, LMS, Happy Wallet, MR/VR' },
    { value: 'Vehicle Refinish', label: 'Vehicle Refinish' },
    { value: 'W/C ANTIDIRT', label: 'W/C ANTIDIRT' },
    { value: 'W/C ANTIDIRT LONGLIF', label: 'W/C ANTIDIRT LONGLIF' },
    { value: 'W/C ANTIDIRT LONGLIFE (F167)', label: 'W/C ANTIDIRT LONGLIFE (F167)' },
    { value: 'W/C Antidirt Supreme (F168)', label: 'W/C Antidirt Supreme (F168)' },
    { value: 'W/C EXTERIOR SEALER', label: 'W/C EXTERIOR SEALER' },
    { value: 'W/C SMOOTH', label: 'W/C SMOOTH' },
    { value: 'WC GLOW', label: 'WC GLOW' },
    { value: 'WEATHER COAT EXTERIOR SEALER', label: 'WEATHER COAT EXTERIOR SEALER' },
    { value: 'Wood Coating / Innova', label: 'Wood Coating / Innova' },
    { value: 'WOOD KEEPER', label: 'WOOD KEEPER' },
    { value: 'Xpress Sealer (Decorative)', label: 'Xpress Sealer (Decorative)' }
];
const commitmentItems = [
    { value: '', label: '-- Select Commitment Item --' },
    { value: 'Con Pro_Campaign Actv Cost', label: 'Con Pro_Campaign Actv Cost' },
    { value: 'Corporate - Other', label: 'Corporate - Other' },
    { value: 'PTI Gift', label: 'PTI Gift' },
    { value: 'SC Production Cost', label: 'SC Production Cost' },
    { value: 'Shomporko Scheme_On invoice', label: 'Shomporko Scheme_On invoice' },
    { value: 'Mass Calendar Production', label: 'Mass Calendar Production' },
    { value: 'Exec. Diary Prod.', label: 'Exec. Diary Prod.' },
    { value: 'Small Diary Prod.', label: 'Small Diary Prod.' },
    { value: 'Shade Card Mgt', label: 'Shade Card Mgt' },
    { value: 'POSM Print', label: 'POSM Print' }
];
const vendorQuotations = [
    { value: '', label: '-- Select Required Vendor Quotation --' },
    { value: 'Minimum 3 parties', label: 'Minimum 3 parties' },
    { value: 'Single Vendor', label: 'Single Vendor' }
];
