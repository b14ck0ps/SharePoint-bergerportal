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