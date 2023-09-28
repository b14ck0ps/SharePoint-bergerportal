const ABS_URL = _spPageContextInfo.webAbsoluteUrl;
const API_HEADERS = { "accept": "application/json;odata=verbose" };

const USER_EMAIL_ID = _spPageContextInfo.userId;
const OPM_INFO = { id: 0, name: "" };


/**
 * Angular module for the Marketing Activity app.
 * @module MarketingActivityApp
 */
const MarketingActivityModule = angular.module("MarketingActivityApp", []);

MarketingActivityModule.controller('UserController', ['$scope', '$http', function ($scope, $http) {
    $scope.today = new Date();
    $scope.IsLoading = true;
    $scope.UserInfo = {};

    /* This function Run at First when the page loaded. Invoked on Template Page (Line:21)  */
    $scope.InitPage = () => {
        getUserByInfoEmailId();
    }


    /**
     * Retrieves user information from a SharePoint list `bergerEmployeeInformation` based on their email ID.
     * @returns {void}
     */
    const getUserByInfoEmailId = () => {
        $scope.IsLoading = true;

        const base = getApiEndpoint("bergerEmployeeInformation");
        const filter = `$filter=Email/ID eq '${USER_EMAIL_ID}'`;
        const query = `$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter&$expand=Email/ID,OptManagerEmail/ID&$top=1`;

        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_HEADERS
        })
            .then(function (response) {
                $scope.UserInfo = response.data.d.results[0];
                OPM_INFO.id = $scope.UserInfo.OptManagerEmail.ID;
                OPM_INFO.name = $scope.UserInfo.OptManagerEmail.Title;
            })
            .catch((e) => console.log("Error getting user information", e))
            .finally(() => $scope.IsLoading = false);
    }
}]);


MarketingActivityModule.controller('FormController', ['$scope', '$http', function ($scope, $http) {

    $scope.services = services;
    $scope.MapActivityName = () => getActivityNames();
    $scope.MapCostHead = () => getCostHead();

    /**
     * Retrieves marketing activity names from a SharePoint list `MarketingActivityMapper` based on `$scope.services` and populates the `Activity Name` dropdown.
     * @returns {void}
     */
    const getActivityNames = () => {

        const base = getApiEndpoint("MarketingActivityMapper");
        const filter = `$filter=ServiceName eq '${$scope.serviceName}'`;
        const query = `$select=ActivityName`;

        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_HEADERS
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
        const filter = `$filter=ActivityName eq '${$scope.selectedActivity}'`;
        const query = `$select=CostHead`;

        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_HEADERS
        })
            .then((response) => $scope.costHeadDropdownList = response.data.d.results.map((item) => item.CostHead))
            .catch((e) => console.log("Error getting user information", e))
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

/**
 * List of services.
 */
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