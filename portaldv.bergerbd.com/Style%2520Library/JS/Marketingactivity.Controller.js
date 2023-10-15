const ABS_URL = _spPageContextInfo.webAbsoluteUrl;
const API_GET_HEADERS = { "Accept": "application/json;odata=verbose" };
const API_POST_HEADERS = {
    ...API_GET_HEADERS,
    "Content-Type": "application/json; odata=verbose",
    "X-RequestDigest": $("#__REQUESTDIGEST").val()
};
const API_UPDATE_HEADERS = { ...API_POST_HEADERS, "IF-MATCH": "*", "X-HTTP-Method": "MERGE" };
/** no dev test 
 * @type {string}
 * @description add `&nodev` at the end of the url to disable the `DEV_ENV` flag
*/
const nodev = new URLSearchParams(window.location.search).get('nodev');
/**
 * Flag indicating whether the current environment is a development environment.
 * Any URL containing `portaldv` is considered a development environment.
 * This is used to prevent any logs or console messages from appearing in production.
 * @example DEV_ENV ? console.table(SomeTestVariable) : null;
 * @type {boolean}
 */
const DEV_ENV = ABS_URL.includes("portaldv") && nodev === null;
const PendingApprovalUniqueId = new URLSearchParams(window.location.search).get('UniqueId');
const CURRENT_USER_ID = _spPageContextInfo.userId;
const OPM_INFO = { id: 0, name: "" };
const SOIC_INFO = { id: 0, name: "" };
const RequesterInfo = {
    id: 0,
    name: "",
    email: "",
    location: "",
    DeptID: "",
};
const ApprovalStatus = {
    Saved: "Saved",
    Submitted: "Submitted",
    ChangeRequested: "ChangeRequested",
    OPMApproved: "OPMApproved",
    SOICApproved: "SOICApproved",
    CMOApproved: "CMOApproved",
    COOApproved: "COOApproved",
    FinalApproved: "FinalApproved",
    Closed: "Closed",
    Rejected: "Rejected",
}
/**
 * Approval chain for `Approver Info` list Filtered by `DeptID`, `Location` and `Department`.
 */
const ApprovalChain = {
    SOIC: null,
    OPM: null,
    CMO: null,
    COO: null,
    FinalApprovar: null
}
const RedirectOnSubmit = `https://${DEV_ENV ? 'portaldv' : 'portal'}.bergerbd.com/leaveauto/SitePages/MyWFRequest.aspx`
const RedirectOnApprove = `https://${DEV_ENV ? 'portaldv' : 'portal'}.bergerbd.com/_layouts/15/PendingApproval/PendingApproval.aspx`
/**
 * Default Expense Limit for `OPM` and `CMO` approval.
 * @constant 3,00,000 (3 Lakh)
 * @type {number}
 */
const DefaultExpenseLimit = 300000;
/**
 * Assigned in when getting the request data from `PendingApproval` list.
 * @type {number}
*/
let CurrentPendingWith = null;
/**
 * Sets the `NextPendingWith` based on the `Status` and `TotalExpectedExpense`.
 * If the `Status` is `Submitted` and `TotalExpectedExpense` is greater than `3,00,000` then `NextPendingWith` is `COO`. Then `NextPendingWith` is `CMO`.
 * Otherwise `NextPendingWith` direcly to  `CMO`.
 *@type {number}
 */
let NextPendingWith = null;
/**
 * When Approver Click a button, This status will be set on the `PendingApproval` list and `MarketingActivityMaster` list.
 */
let StatusOnApprove = null;
/**
 * This is the Current status of the `PendingApproval` list.
 * @type {string}
 **/
let CurrentStatus = null;
/**
 * This is the PK of the `PendingApproval` list. This is used to Update the `PendingApproval` list.
 * @type {number}
*/
let PendingApprovalId = null;
/**
 * This is the PK of the `MarketingActivityMaster` list. This is used to Update the `MarketingActivityMaster` list.
* @type {number}
* */
let RequestId = null;
/**
 * If `ChangeRequested` then `EditMode` will be `true` and `SaveOrSubmit` button will be visible. And input fields will be editable.
 * @type {boolean}
 */
let EditMode = false;



/**
 * Angular module for the Marketing Activity app.
 * @module MarketingActivityApp
 */
const MarketingActivityModule = angular.module("MarketingActivityApp", ['ngSanitize']);
MarketingActivityModule.run(($rootScope) => $rootScope.spinnerActive = true); /* Active spinner on page load only if `MarketingActivityModule` is loaded */

MarketingActivityModule.controller('UserController', ['$scope', '$http', function ($scope, $http) {
    $scope.today = new Date();
    $scope.UserInfo = {};
    let CurrentRequesterId = null;

    const P_base = getApiEndpoint("PendingApproval");
    const P_filter = `$filter=substringof('${PendingApprovalUniqueId}',RequestLink)`;
    const P_query = `$expand=Author&$select=Author/Id`;

    $scope.IsLoading = true;
    /* Getting the request id from `PendingApproval` list */
    $http({
        method: "GET",
        url: `${P_base}?${P_filter}&${P_query}`,
        headers: API_GET_HEADERS
    })
        .then((response) => {
            if (PendingApprovalUniqueId) {
                CurrentRequesterId = response.data.d.results[0].Author.Id
            }
        })
        .catch((e) => console.log(e))
        .finally(() => {

            CurrentRequesterId = CurrentRequesterId ?? CURRENT_USER_ID;
            const base = getApiEndpoint("bergerEmployeeInformation");
            const filter = `$filter=Email/ID eq '${CurrentRequesterId}'`;
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
                    RequesterInfo.location = $scope.UserInfo.OfficeLocation;
                    RequesterInfo.DeptID = $scope.UserInfo.DeptID;

                    OPM_INFO.id = $scope.UserInfo.OptManagerEmail.ID;
                    OPM_INFO.name = $scope.UserInfo.OptManagerEmail.Title;
                    ApprovalChain.OPM = OPM_INFO.id;
                })
                .catch((e) => DEV_ENV && console.log("Error getting user information", e))
                .finally(() => { $scope.IsLoading = false });
        });
}]);

/**
 * Retrieves the approver information for a given department ID.
 * @param {string} DeptID - The ID of the department to retrieve approver information for.
 * @returns {Promise<Object>} - A Promise that resolves with an object containing the approval chain for the given department.
 */
const getApproverInfo = (DeptID) => {
    return new Promise((resolve, reject) => {
        const base = getApiEndpoint("Approver Info");
        const query = `$select=Approver1Id,Approver2Id,Approver3Id,Approver4Id,BranchSalesMId,HODId,Location`;
        const filter = `$filter=DeptID eq '${DeptID}'`;

        $.ajax({
            method: "GET",
            url: `${base}?${query}&${filter}`,
            headers: API_GET_HEADERS,
            success: function (response) {
                const approverInfoResponse = response.d.results;

                const corporateApprovalRow = approverInfoResponse.find(item => item.Location === 'Corporate');
                const OtherLocationApprovalRow = approverInfoResponse.find(item => item.Location === RequesterInfo.location);

                const DefaultkeyMapping = {
                    "Approver2Id": "CMO",
                    "Approver3Id": "COO",
                    "Approver4Id": "FinalApprovar",
                };

                /* Default Approval Chain (OPM->COO/CMO->FinalApprover) */
                for (const key in DefaultkeyMapping) {
                    const value = corporateApprovalRow[key];
                    if (value !== null) {
                        const renamedKey = DefaultkeyMapping[key];
                        ApprovalChain[renamedKey] = value;
                    }
                }

                /* SOIC for non-corporate employee */
                if (OtherLocationApprovalRow.BranchSalesMId) {
                    ApprovalChain.SOIC = OtherLocationApprovalRow.BranchSalesMId;
                } else if (OtherLocationApprovalRow.HODId) {
                    ApprovalChain.SOIC = OtherLocationApprovalRow.HODId;
                }
                resolve(ApprovalChain);
            },
            error: function (xhr, status, error) {
                DEV_ENV && console.error("Error getting user information", error);
                reject(error);
            }
        });
    });
}

MarketingActivityModule.controller('FormController', ['$scope', '$http', function ($scope, $http) {

    /** All Concrete Data comming from @file Marketingactivity.Data.js */
    $scope.services = services;
    $scope.activityTypes = activityTypes;
    $scope.budgetTypes = budgetTypes;
    $scope.brands = brands;
    $scope.commitmentItems = commitmentItems;
    $scope.vendorQuotations = vendorQuotations;

    $scope.MapActivityName = (e) => getActivityNames(e);
    $scope.MapCostHead = (e) => getCostHead(e);
    $scope.ApproverAction = (Action) => { UpdateApproveStatus(Action); }
    $scope.clickSaveOrSubmit = (status) => { saveOrSubmit(status); }

    $scope.errors = {};
    if (!PendingApprovalUniqueId) {
        $scope.showSaveOrSubmitBtn = true;
        $scope.showPRNumber = false;
    } else {
        /* If Some one click on a link from `Pending Approval` list */
        const base = getApiEndpoint("PendingApproval");
        const filter = `$filter=substringof('${PendingApprovalUniqueId}',RequestLink)`;
        const query = `$expand=PendingWith,Author&$select=ID,Title,Author/Id,ProcessName,Status,PendingWith/Id,PendingWith/Title`;

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
                CurrentStatus = Row.Status;
                CurrentPendingWith = Row.PendingWith.results[0].Id;
                PendingApprovalId = Row.ID;
                $scope.pendingWithName = Row.PendingWith.results[0].Title;
                EditMode = CurrentStatus === ApprovalStatus.ChangeRequested && CURRENT_USER_ID === CurrentPendingWith;
            })
            .catch((e) => DEV_ENV && console.log("Error getting user information", e))
            .finally(() => {
                if (!RequestId) {
                    $scope.IsLoading = false;
                    return;
                }

                const base = getApiEndpoint("MarketingActivityMaster");
                const filter = `$filter=ID eq '${RequestId}'`;
                const query = `$select=PendingWith/Id,PendingWith/Title,ID,ActivityName,ServiceName,ActivityType,BudgetType,CostHead,BrandDescription,CommitmentItem,TotalExpectedExpense,ActivityStartDate,ExpectedDeliveryDate,ServiceReceivingDate,RequiredVendorQuotation,SingleVendorJustification,ProjectName,Status,PRNumber,Reamarks,AuthorId&$expand=PendingWith&$top=1`;

                /* Getting the request data from `MarketingActivityMaster` list */
                $http({
                    method: "GET",
                    url: `${base}?${filter}&${query}`,
                    headers: API_GET_HEADERS
                })
                    .then((response) => {
                        const Row = response.data.d.results[0];
                        $scope.requestCode = `MA-${Row.ID}`;
                        $scope.FormData = {
                            ...Row,
                            ActivityStartDate: new Date(Row.ActivityStartDate),
                            ExpectedDeliveryDate: new Date(Row.ExpectedDeliveryDate),
                            ServiceReceivingDate: new Date(Row.ServiceReceivingDate),
                        };

                        $scope.IsDataReadOnly = true; /* Hide all the input fields & Shows `MarketingActivityMaster` list data */
                        DEV_ENV && console.log(Row);
                    })
                    .catch((e) => DEV_ENV && console.log("Error getting user information", e))
                    .finally(async () => {
                        const logs = $scope.auditHistory = await getAllLogs();

                        if (EditMode) {
                            /**Getting The latest log. In edit mode, when user submit again, it should goto the last user who requested for Change. And that should be the latest log entry */
                            const latestLogEntry = logs.reduce((latest, current) => {
                                if (!latest || new Date(current.Created) > new Date(latest.Created)) return current;
                                return latest;
                            }, null);
                            NextPendingWith = latestLogEntry.Author.Id; /* This should user who requested the change */
                        }

                        /**
                         * @type {number}
                         */
                        const TotalExpectedExpense = $scope.FormData.TotalExpectedExpense;

                        /* Getting the `ApprovalChain` based on the `DeptID`, `Location` and `Department` */
                        getApproverInfo(RequesterInfo.DeptID)
                            .then(() => {
                                $scope.IsLoading = false
                                DEV_ENV && console.log(ApprovalChain);

                                /* -Start----------------------------------------------APPROVAL FLOW-------------------------------------------------- */
                                if (CurrentStatus === ApprovalStatus.Submitted && CurrentPendingWith === ApprovalChain.OPM || CurrentPendingWith === ApprovalChain.SOIC) { /* CMO*/
                                    NextPendingWith = ApprovalChain.CMO;
                                    if (RequesterInfo.location === 'Corporate' && CurrentPendingWith === ApprovalChain.OPM) {
                                        StatusOnApprove = ApprovalStatus.OPMApproved;
                                    } else {
                                        StatusOnApprove = ApprovalStatus.SOICApproved;
                                    }
                                } else if (CurrentStatus === ApprovalStatus.Submitted || CurrentStatus === ApprovalStatus.OPMApproved || CurrentStatus === ApprovalStatus.SOICApproved && CurrentPendingWith === ApprovalChain.CMO) { /* COO / Final */
                                    NextPendingWith = TotalExpectedExpense > DefaultExpenseLimit ? ApprovalChain.COO : ApprovalChain.FinalApprovar;
                                    StatusOnApprove = ApprovalStatus.CMOApproved;
                                } else if (CurrentStatus === ApprovalStatus.Submitted || CurrentStatus === ApprovalStatus.CMOApproved && CurrentPendingWith === ApprovalChain.COO) { /* COO */
                                    NextPendingWith = ApprovalChain.FinalApprovar;
                                    StatusOnApprove = ApprovalStatus.COOApproved;
                                } else if (CurrentStatus === ApprovalStatus.Submitted || CurrentStatus === ApprovalStatus.CMOApproved || CurrentStatus === ApprovalStatus.COOApproved && CurrentPendingWith === ApprovalChain.FinalApprovar) { /* Requester */
                                    NextPendingWith = CURRENT_USER_ID;
                                    StatusOnApprove = ApprovalStatus.FinalApproved;
                                    $scope.isFinalApprover = true /* `PRN & Remark` Input Field Config */
                                } else if (CurrentStatus === ApprovalStatus.FinalApproved && CurrentPendingWith === CURRENT_USER_ID) { /* Closed */
                                    NextPendingWith = null;
                                    StatusOnApprove = ApprovalStatus.Closed;
                                    $scope.showCloseBtn = true;
                                }
                                /* -End-----------------------------------------------APPROVAL FLOW-------------------------------------------------- */

                                /* Approve, Reject, Change buttons configuration */
                                if (CURRENT_USER_ID === CurrentPendingWith && CurrentStatus !== ApprovalStatus.FinalApproved || DEV_ENV) {
                                    if (CurrentStatus !== ApprovalStatus.Rejected
                                        && CurrentStatus !== ApprovalStatus.ChangeRequested
                                        && CurrentStatus !== ApprovalStatus.Closed) {
                                        $scope.showApproveBtn = $scope.showChangeBtn = $scope.showRejectBtn = true;
                                    }
                                }
                                /* Hide Attachments Panel and Comment Box if rejected or closed */
                                if (CurrentStatus === ApprovalStatus.Rejected
                                    || CurrentStatus === ApprovalStatus.Closed || CURRENT_USER_ID !== CurrentPendingWith && !DEV_ENV) {
                                    $scope.IsRejectedOrCompleted = true;
                                }

                                DEV_ENV && console.log(`CurrentPendingWith: ${CurrentPendingWith}, Total Expected Expenses : ${TotalExpectedExpense}, NextPendingWith: ${NextPendingWith}, CurrentStatus: ${CurrentStatus}, StatusOnApprove: ${StatusOnApprove}`);

                                /*Get The Attachments from `MarketingActivityAttachment` list */
                                const baseAttachment = getApiEndpoint("MarketingActivityAttachment");
                                const filterAttachment = `$filter=MarketingActivityID eq '${RequestId}'`;
                                const queryAttachment = `$select=ID,Title,AttachmentFiles,Created,Author/Title&$expand=AttachmentFiles,Author`;

                                $http({
                                    method: "GET",
                                    url: `${baseAttachment}?${filterAttachment}&${queryAttachment}`,
                                    headers: API_GET_HEADERS
                                })
                                    .then((response) => {
                                        DEV_ENV && console.log(response.data.d.results);
                                        $scope.receiptRows = response.data.d.results;
                                    })
                                    .catch((e) => DEV_ENV && console.log("Error getting user information", e))

                                if (EditMode) {
                                    $scope.MapActivityName(EditMode);
                                    $scope.MapCostHead(EditMode);

                                    /* Button Config */
                                    $scope.showSaveOrSubmitBtn = $scope.EditMode = true;
                                    $scope.showApproveBtn = $scope.showChangeBtn = $scope.showRejectBtn = false;
                                }
                                $scope.IsLoading = false
                            });
                    })
            });
    }

    const getAllLogs = async () => {
        try {
            /* Get The logs from `MarketingActivityLog` list */
            const base = getApiEndpoint("MarketingActivityLog");
            const filter = `$filter=MarketingActivityID eq '${RequestId}'`;
            const query = `$select=ID,Title,Status,Comment,Created,Author/Id,Author/Title,Author/EMail&$expand=Author&$orderby=Created asc`;

            const response = await $http({
                method: "GET",
                url: `${base}?${filter}&${query}`,
                headers: API_GET_HEADERS
            });

            return response.data.d.results;
        } catch (e) {
            DEV_ENV && console.log("Error getting user information", e);
            throw e; // Re-throw the error to propagate it further if needed
        }
    };


    /**
     * Retrieves marketing activity names from a SharePoint list `MarketingActivityMapper` based on `$scope.services` and populates the `Activity Name` dropdown.
     * @param {boolean} IsCalledBySystem - If `true` then `Activity Name` will be set to the data comming from the API.
     * @description IsCalledBySystem `false` means This function is called by the The user. So, `Activity Name` will be set to empty string.
     * @returns {void}
     */
    const getActivityNames = (IsCalledBySystem) => {

        const base = getApiEndpoint("MarketingActivityMapper");
        const filter = `$filter=ServiceName eq '${$scope.FormData.ServiceName}'`;
        const query = `$select=ActivityName`;
        $scope.IsLoading = true;
        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_GET_HEADERS
        })
            .then((response) => {
                IsCalledBySystem ? null : $scope.FormData.ActivityName = '';
                $scope.activityNamesDropdownList = response.data.d.results.map((item) => item.ActivityName)
            })
            .catch((e) => DEV_ENV && console.log("Error getting user information", e))
            .finally(() => $scope.IsLoading = false);
    }

    /**
     * Retrieves cost head from a SharePoint list `MarketingActivityMapper` based on `$scope.selectedActivity` and populates the `Cost Head` dropdown.
     * @param {boolean} IsCalledBySystem - If `true` then `Cost Head` will be set to the data comming from the API.
     * @description IsCalledBySystem `false` means This function is called by the The user. So, `Cost Head` will be set to empty string.
     * @returns {void}
     */
    const getCostHead = (IsCalledBySystem) => {

        const base = getApiEndpoint("MarketingActivityMapper");
        const filter = `$filter=ActivityName eq '${$scope.FormData.ActivityName}'`;
        const query = `$select=CostHead`;

        $scope.IsLoading = true;
        $http({
            method: "GET",
            url: `${base}?${filter}&${query}`,
            headers: API_GET_HEADERS
        })
            .then((response) => {
                IsCalledBySystem ? null : $scope.FormData.CostHead = '';
                $scope.costHeadDropdownList = response.data.d.results.map((item) => item.CostHead)
            })
            .catch((e) => DEV_ENV && console.log("Error getting user information", e))
            .finally(() => $scope.IsLoading = false);
    }

    /**
     * Saves the form data to a SharePoint list `MarketingActivity`.
     * @param {string} status Status of the form (Save or Submit)
     * @returns {void}
     */
    const saveOrSubmit = (status) => {

        if (!isFormDataValid($scope.FormData)) return;

        if (EditMode) {
            const data = { 'Status': ApprovalStatus.Submitted };
            UpddatePendingApproval(data, NextPendingWith)
                .then(() => {
                    UpdateActivityMaster($scope.FormData, NextPendingWith, ApprovalStatus.Submitted)
                    AddToLog(`MA-${RequestId}`, 'Updated', $scope.actionComment, RequestId);
                })
                .catch((e) => { console.log("Error getting information", e) })
                .finally(() => {
                    window.location.href = RedirectOnSubmit;
                });
            return;
        }
        if (StatusOnApprove === ApprovalStatus.Closed) {
            const data = { 'Status': StatusOnApprove };
            UpddatePendingApproval(data, NextPendingWith)
                .then(() => {
                    UpdateActivityMaster($scope.FormData, NextPendingWith, StatusOnApprove)
                    AddToLog(`MA-${RequestId}`, StatusOnApprove, $scope.actionComment, RequestId);
                })
                .catch((e) => { console.log("Error getting information", e) })
                .finally(() => {
                    window.location.href = RedirectOnSubmit;
                });
            return;
        }

        const url = getApiEndpoint("MarketingActivityMaster");
        /* Spreding the FormData and adding the metadata */
        const marketingActivityMasterData = {
            ...$scope.FormData,
            'Status': status,
            'PendingWithId': ApprovalChain.SOIC ?? ApprovalChain.OPM,
            '__metadata': { "type": "SP.Data.MarketingActivityMasterListItem" }
        };

        /** Saves/Submit the request to a SharePoint list `MarketingActivityMaster` */
        $scope.IsLoading = true;
        $http({
            headers: API_POST_HEADERS,
            method: "POST",
            url: url,
            data: marketingActivityMasterData,
        })
            .then((response) => {
                /**  This is the ID of the newly created item @type {number} */
                const MarketingActivityID = response.data.d.ID;
                RequestId = MarketingActivityID;
                const Title = `MA-${MarketingActivityID}`;
                const UniqueUrl = `${ABS_URL}/SitePages/MarketingActivity.aspx?UniqueId=${crypto.randomUUID()}`;

                /** Saves the request to a SharePoint list `PendingApproval`. @file constants.js */
                saveAtMyTask(Title, 'MarketingActivity', RequesterInfo.name, status, RequesterInfo.id.toString(), RequesterInfo.email, ApprovalChain.SOIC ?? ApprovalChain.OPM, UniqueUrl);

                AddToLog(Title, status, $scope.actionComment, MarketingActivityID);
                SaveAllAttachments();
                if ($scope.pendingWithName === undefined) $scope.pendingWithName = OPM_INFO.name;
                SendEmail(InitiatorRequesterTemplate, CURRENT_USER_ID, [], RequesterInfo.name, $scope.pendingWithName, Title, status, UniqueUrl, "", "Marketing Activity");
            })
            .catch(function (message) {
                DEV_ENV && console.log(`Error saving data: ${message}`);
            })
            .finally(() => {
                window.location.href = RedirectOnSubmit;
                $scope.IsLoading = false;
            });
    }

    /**
     * Updates the approval status of a pending approval item in SharePoint.
     * @param {string} Action - The action to take on the pending approval item.
     */
    const UpdateApproveStatus = (Action) => {
        var data = {};
        DEV_ENV && console.log(`Action: ${Action}`);
        DEV_ENV && console.log(`StatusOnApprove: ${StatusOnApprove}, NextPendingWith: ${NextPendingWith}, CurrentPendingWith: ${CurrentPendingWith}, Status: ${CurrentStatus}`);
        DEV_ENV && console.log(`PendingApprovalId: ${PendingApprovalId}`);

        var setPendingWith = null;

        switch (Action) {
            case "Approved":
                data = { 'Status': StatusOnApprove };
                setPendingWith = NextPendingWith;
                break;
            case "Changed":
                data = { 'Status': ApprovalStatus.ChangeRequested, };
                StatusOnApprove = ApprovalStatus.ChangeRequested;
                setPendingWith = CURRENT_USER_ID;
                break;
            case "Rejected":
                data = { 'Status': ApprovalStatus.Rejected, };
                StatusOnApprove = ApprovalStatus.Rejected;
                break;
            case "Closed":
                data = { 'Status': ApprovalStatus.Closed, };
                StatusOnApprove = ApprovalStatus.Closed;
                break;
            default:
                DEV_ENV && console.log(`Invalid action: ${Action}`);
                return;
        }
        if (Action === "Approved" && CurrentPendingWith === ApprovalChain.FinalApprovar && $scope.FormData.PRNumber === null || $scope.FormData.PRNumber === '') {
            $scope.errors.PRNumber = 'Please fill up PR Number'
            return;
        }

        $scope.IsLoading = true;
        UpddatePendingApproval(data, setPendingWith)
            .then((res) => {
                if (CurrentPendingWith === ApprovalChain.FinalApprovar && Action === 'Approved') {
                    data = { ...data, 'PRNumber': $scope.FormData.PRNumber, 'Reamarks': $scope.FormData.Reamarks };
                }
                UpdateActivityMaster(data, setPendingWith, StatusOnApprove);
                AddToLog(`MA-${RequestId}`, StatusOnApprove, $scope.actionComment, RequestId);
            })
            .catch((e) => { DEV_ENV && console.log(e); })
            .finally(() => {
                $scope.IsLoading = false;
                window.location.href = RedirectOnApprove;
            });
    }

    const UpddatePendingApproval = (data, setPendingWith) => {
        return $http({
            headers: API_UPDATE_HEADERS,
            method: "POST",
            url: `${getApiEndpoint("PendingApproval")}(${PendingApprovalId})`,
            data: {
                ...data,
                'PendingWithId': { 'results': StatusOnApprove === ApprovalStatus.Rejected || StatusOnApprove === ApprovalStatus.Closed ? [] : [setPendingWith] }, /* if rejected or closed then sending empty array (pending with no one)*/
                '__metadata': { "type": "SP.Data.PendingApprovalListItem" }
            }
        })
    }

    const UpdateActivityMaster = (data, setPendingWith, Status) => {

        const {
            "__metadata": _metadata,
            "PendingWith": _pendingWith,
            "Id": _id,
            "Status": _status,
            "AuthorId": _authorId,
            ...filteredData
        } = data; /* Remove unnecessary data from the `data` object */

        $scope.IsLoading = true;
        /* Updating the `MarketingActivityMaster` list */
        $http({
            headers: API_UPDATE_HEADERS,
            method: "POST",
            url: `${getApiEndpoint("MarketingActivityMaster")}(${RequestId})`,
            data: {
                ...filteredData,
                'Status': Status,
                'PendingWithId': setPendingWith,
                '__metadata': { "type": "SP.Data.MarketingActivityMasterListItem" }
            }
        })
            .then((res) => {
                DEV_ENV && console.log(res)
                SaveAllAttachments();
            })
            .catch((e) => { DEV_ENV && console.log(e) })
            .finally(() => $scope.IsLoading = false);
    }

    /**
     * Add a log to `MarketingActivityLog` list.
     * @param {String} Title MA-{RequestId}
     * @param {String} Status Current Status
     * @param {String} Comment from comment box
     * @param {number} MarketingActivityID `RequestId`
     */
    const AddToLog = (Title, Status, Comment, MarketingActivityID) => {
        const url = getApiEndpoint("MarketingActivityLog");
        const data = {
            'Title': Title,
            'Status': Status,
            'Comment': Comment,
            'MarketingActivityID': MarketingActivityID,
            '__metadata': { "type": "SP.Data.MarketingActivityLogListItem" }
        };
        /** Add a log to `MarketingActivityLog` list. */
        $http({
            headers: API_POST_HEADERS,
            method: "POST",
            url: url,
            data: data,
        })
            .then((response) => {
                DEV_ENV && console.log(response);
            })
            .catch(function (message) {
                DEV_ENV && console.log(`Error saving data: ${message}`);
            });
    }

    /**
     * Saves all attachments from input file elements to the SP List _MarketingActivityAttachment_.
     * @description This create a **new item** in the list **for each file** and set the Attachment.
     * @async
     */
    const SaveAllAttachments = async () => {
        const fileInputs = $("#attachFilesContainer input:file");
        const filesToUpload = Array.from(fileInputs)
            .map((input) => input.files[0])
            .filter((file) => file);

        if (filesToUpload.length === 0) return;

        try {
            filesToUpload.forEach(async (file) => await AddReceiptInitial(file));
        }
        catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    /**
     * Adds a receipt to the MarketingActivityAttachment list and uploads a file to SharePoint.
     * @async
     * @param {File} file - The file to upload to SharePoint.
     * @returns {Promise<void>}
     */
    const AddReceiptInitial = async (file) => {
        const ListName = "MarketingActivityAttachment";
        var url = getApiEndpoint(ListName);
        $scope.IsLoading = true;
        /** Add a Item with `RequestId`  to `MarketingActivityAttachment` list. */
        $http({
            headers: API_POST_HEADERS,
            method: "POST",
            url: url,
            data: {
                'Title': `MA-${RequestId}`,
                'MarketingActivityID': RequestId,
                '__metadata': { "type": "SP.Data.MarketingActivityAttachmentListItem" },
            }
        })
            .then(async (res) => await uploadFileToSharePoint(res.data.d.ID, file, ListName))
            .catch((e) => { DEV_ENV && console.log(e) })
            .finally(() => $scope.IsLoading = false);
    }

    /**
     * Reads a notification list template and creates a notification item.
     *
     * @param {string} template - The ID of the notification list template to read.
     * @param {string} toList - The email address of the recipient of the notification.
     * @param {string} ccList - The email address of the CC recipient of the notification.
     * @param {string} initiator - The name of the initiator of the notification.
     * @param {string} approver - The name of the approver of the notification.
     * @param {string} requestId - The ID of the request associated with the notification.
     * @param {string} requestStatus - The status of the request associated with the notification.
     * @param {string} reviewLink - The link to the review page associated with the notification.
     * @param {string} approvalLink - The link to the approval page associated with the notification.
     * @param {string} wfName - The name of the workflow associated with the notification.
     */
    const SendEmail = (template, toList, ccList, initiator, approver, requestId, requestStatus, reviewLink, approvalLink, wfName) => {

        const base = getApiEndpoint(notificationTemplateList);
        const filter = `$filter=ID eq '${template}'`;
        const query = `$select=Title,Body,BottomBodyText`;

        $http(
            {
                method: "GET",
                url: `${base}?${filter}&${query}`,
                headers: { "accept": "application/json;odata=verbose" }
            }
        ).success(function (data) {
            const replacements = [
                ['Workflow', wfName],
                ['RequestId', requestId],
                ['Initiator', initiator],
                ['Approver', approver],
                ['ApprovalStatus', requestStatus],
            ];

            if (data.d.results.length > 0) {
                const { Title, Body, BottomBodyText } = data.d.results[0];

                const replaceInText = (text) => {
                    for (const [placeholder, value] of replacements) {
                        const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
                        text = text.replace(regex, value);
                    }
                    return text;
                };

                const varSubject = replaceInText(Title);
                const varBody = replaceInText(Body);
                const varBodyBottomText = replaceInText(BottomBodyText);

                CreateNotificationItem(varSubject, varBody, toList, ccList, reviewLink, approvalLink, varBodyBottomText);
            }
        }).error(function (e) {
            console.log("Something went wrong, ", e)
        });
    }
    /**
     * Creates a notification item with the given subject, body, toList, ccList, reviewLink, approvalLink, and varBodyBottomText.
     * @param {string} subject - The subject of the notification item.
     * @param {string} body - The body of the notification item.
     * @param {string[]} toList - An array of user IDs to whom the notification should be sent.
     * @param {string[]} ccList - An array of user IDs to whom the notification should be CC'd.
     * @param {string} reviewLink - The link to the review page.
     * @param {string} approvalLink - The link to the approval page.
     * @param {string} varBodyBottomText - The text to be displayed at the bottom of the notification body.
     * @returns {Promise} A Promise that resolves with the created notification item data.
     */
    const CreateNotificationItem = (subject, body, toList, ccList, reviewLink, approvalLink, varBodyBottomText) => {
        const MailData =
        {
            __metadata: { "type": "SP.Data.NotificationListListItem" },
            Title: subject,
            Body: body,
            ToId: { results: [toList] },
            CCId: { results: ccList },
            ReviewLink: reviewLink,
            ApprovalLink: approvalLink,
            BodyBottomText: varBodyBottomText,
            Status: "Started"
        }
        return $http({
            headers: API_POST_HEADERS,
            method: "POST",
            url: getApiEndpoint(notificationList),
            data: MailData
        })
            .then(logAdded)
            .catch(function (message) {
                console.log(`Error saving data: ${message}`);
            });
        function logAdded(data) {
            return data.data.d;
        }
    }
    /**
     * Checks if the given form data is valid and add errors to the `$scope.errors` object.
     *
     * @param {Object} formData - The form data to validate.
     * @returns {boolean} - Returns true if the form data is valid, false otherwise.
     */
    const isFormDataValid = (formData) => {
        if (formData === undefined) formData = {};

        let isValid = true;
        $scope.errors = {};

        if (formData.ProjectName === undefined || formData.ProjectName === '') {
            $scope.errors.ProjectName = 'Please fill up Project Name';
            isValid = false;
        }

        if (formData.ServiceName === undefined || formData.ServiceName === '') {
            $scope.errors.ServiceName = 'Please Select a Service Name';
            isValid = false;
        }

        if (formData.ActivityName === undefined || formData.ActivityName === '') {
            $scope.errors.ActivityName = 'Please Select an Activity Name';
            isValid = false;
        }

        if (formData.CostHead === undefined || formData.CostHead === '') {
            $scope.errors.CostHead = 'Please Select a Cost Head';
            isValid = false;
        }

        if (formData.BrandDescription === undefined || formData.BrandDescription === '') {
            $scope.errors.BrandDescription = 'Please Select a Brand Description';
            isValid = false;
        }

        const activityStartDate = new Date(formData.ActivityStartDate);
        const serviceReceivingDate = new Date(formData.ServiceReceivingDate);
        const expectedDeliveryDate = new Date(formData.ExpectedDeliveryDate);

        if (formData.ActivityStartDate === undefined) {
            $scope.errors.ActivityStartDate = 'Please Select a valid Activity Start Date';
            isValid = false;
        }

        if (formData.ServiceReceivingDate === undefined) {
            $scope.errors.ServiceReceivingDate = 'Please Select a valid Service Receiving Date';
            isValid = false;
        }

        if (formData.ExpectedDeliveryDate === undefined) {
            $scope.errors.ExpectedDeliveryDate = 'Please Select a valid Expected Delivery Date';
            isValid = false;
        }

        if (activityStartDate > expectedDeliveryDate) {
            $scope.errors.ActivityStartDate = 'Activity Start Date can\'t be greater than Expected Delivery Date';
            isValid = false;
        }

        if (activityStartDate > serviceReceivingDate) {
            $scope.errors.ActivityStartDate = 'Activity Start Date can\'t be greater than Service Receiving Date';
            isValid = false;
        }

        if (expectedDeliveryDate > serviceReceivingDate) {
            $scope.errors.ExpectedDeliveryDate = 'Expected Delivery Date can\'t be greater than Service Receiving Date';
            isValid = false;
        }

        if (serviceReceivingDate === 'Invalid Date') {
            $scope.errors.ServiceReceivingDate = 'Please Select a valid Service Receiving Date';
            isValid = false;
        }

        if (formData.RequiredVendorQuotation === undefined || formData.RequiredVendorQuotation === '') {
            $scope.errors.RequiredVendorQuotation = 'Please fill up Required Vendor Quotation';
            isValid = false;
        }

        if (formData.ActivityType === undefined || formData.ActivityType === '') {
            $scope.errors.ActivityType = 'Please fill up Activity Type';
            isValid = false;
        }

        if (formData.CommitmentItem === undefined || formData.CommitmentItem === '') {
            $scope.errors.CommitmentItem = 'Please fill up Commitment Item';
            isValid = false;
        }

        if (formData.BudgetType === undefined || formData.BudgetType === '') {
            $scope.errors.BudgetType = 'Please fill up Budget Type';
            isValid = false;
        }

        if (formData.TotalExpectedExpense === undefined || formData.TotalExpectedExpense === '') {
            $scope.errors.TotalExpectedExpense = 'Please fill up Total Expected Expense';
            isValid = false;
        }

        return isValid;
    };

}]);
/**
 * Retrieves the base URL for a SharePoint list.
 * @param {string} ListName Name of the SharePoint list
 * @example getApiEndpoint("MarketingActivityMapper")
 * @returns {string} API base URL
 */
const getApiEndpoint = (ListName) => `${ABS_URL}/_api/web/lists/getByTitle('${ListName}')/items`;

/**
 * Uploads a file to a SharePoint list item as an attachment.
 *
 * @param {number} itemId - The ID of the SharePoint list item.
 * @param {File} file - The File object representing the file to upload.
 * @param {string} listName - The name of the SharePoint list.
 * @returns {Promise<void>} A Promise that resolves when the file is uploaded successfully.
 */
const uploadFileToSharePoint = async (itemId, file, listName) => {
    try {
        const buffer = await getFileBufferAsync(file);
        const queryUrl = `${getApiEndpoint(listName)}(${itemId})/AttachmentFiles/add(FileName='${file.name}')`;

        await $.ajax({
            url: queryUrl,
            type: 'POST',
            processData: false,
            contentType: 'application/json;odata=verbose',
            data: buffer,
            headers: API_POST_HEADERS,
        });
        console.log('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

/**
 * Reads a File object and returns its content as an ArrayBuffer.
 *
 * @param {File} file - The File object to read.
 * @returns {Promise<ArrayBuffer>} A Promise that resolves with the ArrayBuffer of the file's content.
 */
const getFileBufferAsync = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e.target.error);
        reader.readAsArrayBuffer(file);
    });
}