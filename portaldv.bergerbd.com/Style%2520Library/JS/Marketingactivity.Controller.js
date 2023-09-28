const USER_EMAIL_ID = _spPageContextInfo.userId;
const ABS_URL = _spPageContextInfo.webAbsoluteUrl;
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

        const base = `${ABS_URL}/_api/web/lists/getByTitle('bergerEmployeeInformation')/items`;

        const filter = `$filter=Email/ID eq '${USER_EMAIL_ID}'`;
        const query = `$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter&$expand=Email/ID,OptManagerEmail/ID&$top=1`;

        const url = `${base}?${filter}&${query}`;

        $http({
            method: "GET",
            url: url,
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).then(function (response) {
            $scope.UserInfo = response.data.d.results[0];

            OPM_INFO.id = $scope.UserInfo.OptManagerEmail.ID;
            OPM_INFO.name = $scope.UserInfo.OptManagerEmail.Title;
        }
        ).catch(function (err) {
            console.log("Error getting user information", err);
        })
            .finally(function () {
                $scope.IsLoading = false;
            });
    }
}]);


MarketingActivityModule.controller('FormController', ['$scope', '$http', function ($scope, $http) {

    $scope.services = services;
    $scope.MapActivityName = () => getActivityNames();

    /**
     * Retrieves marketing activity names from a SharePoint list `MarketingActivityMapper` based on `$scope.services` and populates the dropdown.
     * @returns {void}
     */
    const getActivityNames = () => {

        const selectedService = $scope.serviceName;
        $scope.activityNamesDropdown = "";

        const base = `${ABS_URL}/_api/lists/getbytitle('MarketingActivityMapper')/items`;
        const filter = `$filter=ServiceName eq '${selectedService}'`;
        const query = `$select=ActivityName`;

        const url = `${base}?${filter}&${query}`;

        $http({
            method: "GET",
            url: url,
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).then(function (response) {
            const ActivityNameList = response.data.d.results;
            $scope.activityNamesDropdownList = ActivityNameList.map((item) => item.ActivityName);

        }
        ).catch(function (err) {
            console.log("Error getting user information", err);
        })
            .finally(function () {
                $scope.IsLoading = false;
            });
    }

}]);

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