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
const USER_ID = _spPageContextInfo.userId;
const OPM_INFO = { id: 0, name: "" };
const RequesterInfo = {
    id: 0,
    name: "",
    email: "",
};
const ApprovalStatus = {
    Saved: "Saved",
    Submitted: "Submitted",
    ChangeRequested: "ChangeRequested",
    OPMApproved: "OPMApproved",
    CMOApproved: "CMOApproved",
    COOApproved: "COOApproved",
    FinalApproved: "FinalApproved",
    Rejected: "Rejected",
}
/**
 * Approval chain for `Approver Info` list Filtered by `DeptID`, `Location` and `Department`.
 */
const ApprovalChain = {
    "OPM": null,
    "CMO": null,
    "COO": null,
    "FinalApprovar": null
}
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

    const base = getApiEndpoint("bergerEmployeeInformation");
    const filter = `$filter=Email/ID eq '${USER_ID}'`;
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
            ApprovalChain["OPM"] = OPM_INFO.id;
        })
        .catch((e) => devlog("Error getting user information", e))
        .finally(() => {
            /*getting Approvar information*/
            const base = getApiEndpoint("Approver Info");
            const query = `$select=Approver1Id,Approver2Id,Approver3Id,Approver4Id`;
            const filter = `$filter=DeptID eq '${$scope.UserInfo.DeptID}' and Location eq '${$scope.UserInfo.OfficeLocation}'`;

            $http({
                method: "GET",
                url: `${base}?${query}&${filter}`,
            }).then(function (response) {
                const approverInfoResponse = response.data.value[0];

                const keyMapping = {
                    "Approver2Id": "CMO",
                    "Approver3Id": "COO",
                    "Approver4Id": "FinalApprovar",
                };

                for (const key in keyMapping) {
                    const value = approverInfoResponse[key];
                    if (value !== null) {
                        const renamedKey = keyMapping[key];
                        ApprovalChain[renamedKey] = value;
                    }
                }
                devlog(ApprovalChain);
            })
                .catch((e) => devlog("Error getting user information", e))

            $scope.IsLoading = false
        });
}]);


MarketingActivityModule.controller('FormController', ['$scope', '$http', function ($scope, $http) {

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

    if (!PendingApprovalUniqueId) {
        $scope.showSaveOrSubmitBtn = true;
    } else {
        /* If Some one click on a link from `Pending Approval` list */
        const base = getApiEndpoint("PendingApproval");
        const filter = `$filter=substringof('${PendingApprovalUniqueId}',RequestLink)`;
        const query = `$expand=PendingWith&$select=ID,Title,ProcessName,Status,PendingWith/Id,PendingWith/Title`;

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
                EditMode = CurrentStatus === ApprovalStatus.ChangeRequested && USER_ID === CurrentPendingWith;
            })
            .catch((e) => devlog("Error getting user information", e))
            .finally(() => {
                if (!RequestId) {
                    $scope.IsLoading = false;
                    return;
                }

                const base = getApiEndpoint("MarketingActivityMaster");
                const filter = `$filter=ID eq '${RequestId}'`;
                const query = `$select=PendingWith/Id,PendingWith/Title,ID,ActivityName,ServiceName,ActivityType,BudgetType,CostHead,BrandDescription,CommitmentItem,TotalExpectedExpense,ActivityStartDate,ExpectedDeliveryDate,ServiceReceivingDate,RequiredVendorQuotation,SingleVendorJustification,ProjectName,Status,AuthorId&$expand=PendingWith&$top=1`;

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
                        devlog(Row);
                    })
                    .catch((e) => devlog("Error getting user information", e))
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

                        /* Setting the `NextPendingWith` and `StatusOnApprove` based on the `Status` and `TotalExpectedExpense` */
                        if (CurrentStatus === ApprovalStatus.Submitted && CurrentPendingWith === ApprovalChain.OPM) {
                            NextPendingWith = TotalExpectedExpense > DefaultExpenseLimit ? ApprovalChain.COO : ApprovalChain.CMO;
                            StatusOnApprove = ApprovalStatus.OPMApproved;
                        } else if (CurrentStatus === ApprovalStatus.Submitted || CurrentStatus === ApprovalStatus.OPMApproved && CurrentPendingWith === ApprovalChain.COO) {
                            NextPendingWith = ApprovalChain.CMO;
                            StatusOnApprove = ApprovalStatus.COOApproved;
                        } else if (CurrentStatus === ApprovalStatus.Submitted || CurrentStatus === ApprovalStatus.COOApproved || ApprovalStatus.OPMApproved && CurrentPendingWith === ApprovalChain.CMO) {
                            NextPendingWith = ApprovalChain.FinalApprovar;
                            StatusOnApprove = ApprovalStatus.CMOApproved;
                        } else if (CurrentStatus === ApprovalStatus.Submitted || CurrentStatus === ApprovalStatus.CMOApproved && CurrentPendingWith === ApprovalChain.FinalApprovar) {
                            NextPendingWith = USER_ID;
                            StatusOnApprove = ApprovalStatus.FinalApproved;
                        }

                        /* Approve, Reject, Change buttons configuration */
                        if (USER_ID === CurrentPendingWith || DEV_ENV) {
                            if (CurrentStatus !== ApprovalStatus.Rejected
                                && CurrentStatus !== ApprovalStatus.ChangeRequested
                                && CurrentStatus !== ApprovalStatus.FinalApproved) {
                                $scope.showApproveBtn = $scope.showChangeBtn = $scope.showRejectBtn = true;
                            }
                        }
                        /* Hide Attachments Panel and Comment Box if rejected or final approved */
                        if (CurrentStatus === ApprovalStatus.Rejected
                            || CurrentStatus === ApprovalStatus.FinalApproved || USER_ID !== CurrentPendingWith && !DEV_ENV) {
                            $scope.IsRejectedOrCompleted = true;
                        }

                        devlog(`CurrentPendingWith: ${CurrentPendingWith}, Total Expected Expenses : ${TotalExpectedExpense}, NextPendingWith: ${NextPendingWith}, CurrentStatus: ${CurrentStatus}, StatusOnApprove: ${StatusOnApprove}`);

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
                                devlog(response.data.d.results);
                                $scope.receiptRows = response.data.d.results;
                            })
                            .catch((e) => devlog("Error getting user information", e))

                        if (EditMode) {
                            $scope.MapActivityName(EditMode);
                            $scope.MapCostHead(EditMode);

                            /* Button Config */
                            $scope.showSaveOrSubmitBtn = $scope.EditMode = true;
                            $scope.showApproveBtn = $scope.showChangeBtn = $scope.showRejectBtn = false;
                        }
                        $scope.IsLoading = false
                    });
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
            devlog("Error getting user information", e);
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
            .catch((e) => devlog("Error getting user information", e))
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
            .catch((e) => devlog("Error getting user information", e))
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

        const url = getApiEndpoint("MarketingActivityMaster");

        /* Spreding the FormData and adding the metadata */
        const marketingActivityMasterData = {
            ...$scope.FormData,
            'Status': status,
            'PendingWithId': OPM_INFO.id,
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
                saveAtMyTask(Title, 'MarketingActivity', RequesterInfo.name, status, RequesterInfo.id.toString(), RequesterInfo.email, OPM_INFO.id, UniqueUrl);

                AddToLog(Title, status, $scope.actionComment, MarketingActivityID);
                SaveAllAttachments();
                if ($scope.pendingWithName === undefined) $scope.pendingWithName = OPM_INFO.name;
                SendEmail(InitiatorRequesterTemplate, USER_ID, [], RequesterInfo.name, $scope.pendingWithName, Title, status, UniqueUrl, "", "Marketing Activity");
            })
            .catch(function (message) {
                devlog(`Error saving data: ${message}`);
            })
            .finally(() => {
                $scope.IsLoading = false;
                window.location.href = RedirectOnSubmit;
            });
    }

    /**
     * Updates the approval status of a pending approval item in SharePoint.
     * @param {string} Action - The action to take on the pending approval item.
     */
    const UpdateApproveStatus = (Action) => {
        var data = {};
        devlog(`Action: ${Action}`);
        devlog(`StatusOnApprove: ${StatusOnApprove}, NextPendingWith: ${NextPendingWith}, CurrentPendingWith: ${CurrentPendingWith}, Status: ${CurrentStatus}`);
        devlog(`PendingApprovalId: ${PendingApprovalId}`);

        var setPendingWith = null;

        switch (Action) {
            case "Approved":
                data = { 'Status': StatusOnApprove };
                setPendingWith = NextPendingWith;
                break;
            case "Rejected":
                data = { 'Status': ApprovalStatus.Rejected, };
                StatusOnApprove = ApprovalStatus.Rejected;
                break;
            case "Changed":
                data = { 'Status': ApprovalStatus.ChangeRequested, };
                StatusOnApprove = ApprovalStatus.ChangeRequested;
                setPendingWith = USER_ID;
                break;
            default:
                devlog(`Invalid action: ${Action}`);
                return;
        }

        $scope.IsLoading = true;
        UpddatePendingApproval(data, setPendingWith)
            .then((res) => {
                UpdateActivityMaster(data, setPendingWith, StatusOnApprove);
                AddToLog(`MA-${RequestId}`, StatusOnApprove, $scope.actionComment, RequestId);
            })
            .catch((e) => { devlog("Error getting user information", e) })
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
                'PendingWithId': { 'results': StatusOnApprove === ApprovalStatus.Rejected ? [] : [setPendingWith] }, /* if rejected then sending empty array (pending with no one)*/
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
                devlog(res)
                SaveAllAttachments();
            })
            .catch((e) => { devlog(e) })
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
                devlog(response);
            })
            .catch(function (message) {
                devlog(`Error saving data: ${message}`);
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
            .catch((e) => { devlog(e) })
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
}]);

/**
 * Retrieves the base URL for a SharePoint list.
 * @param {string} ListName Name of the SharePoint list
 * @example getApiEndpoint("MarketingActivityMapper")
 * @returns {string} API base URL
 */
const getApiEndpoint = (ListName) => `${ABS_URL}/_api/web/lists/getByTitle('${ListName}')/items`;
/**
 * Logs a message to the console if the `DEV_ENV` flag is set to true.
 * @param {string} message - The message to log to the console.
 */
const devlog = (message) => DEV_ENV ? console.log(message) : null;
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
/**
 * Default Expense Limit for `OPM` and `CMO` approval.
 * @constant 3,00,000 (3 Lakh)
 * @type {number}
 */
const DefaultExpenseLimit = 300000;

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
/**
 * Checks if the given form data is valid or not.
 * @param {Object} formData - The form data to be validated.
 * @returns {boolean} - Returns true if the form data is valid, false otherwise.
 */
const isFormDataValid = (formData) => {
    if (
        formData.ServiceName === undefined || formData.ServiceName === '' ||
        formData.ActivityName === undefined || formData.ActivityName === '' ||
        formData.CostHead === undefined || formData.CostHead === '' ||
        formData.BrandDescription === undefined || formData.BrandDescription === '' ||
        formData.ActivityStartDate === undefined || formData.ActivityStartDate === '' ||
        formData.ServiceReceivingDate === undefined || formData.ServiceReceivingDate === '' ||
        formData.ExpectedDeliveryDate === undefined || formData.ExpectedDeliveryDate === '' ||
        formData.RequiredVendorQuotation === undefined || formData.RequiredVendorQuotation === '' ||
        formData.ActivityType === undefined || formData.ActivityType === '' ||
        formData.CommitmentItem === undefined || formData.CommitmentItem === '' ||
        formData.BudgetType === undefined || formData.BudgetType === '' ||
        formData.TotalExpectedExpense === undefined || formData.TotalExpectedExpense === '' ||
        formData.SingleVendorJustification === undefined || formData.SingleVendorJustification === ''
    ) {
        return false;
    }
    return true;
};

const RedirectOnSubmit = `https://${DEV_ENV ? 'portaldv' : 'portal'}.bergerbd.com/leaveauto/SitePages/MyWFRequest.aspx`
const RedirectOnApprove = `https://${DEV_ENV ? 'portaldv' : 'portal'}.bergerbd.com/leaveauto/Lists/PendingApproval/AllItems.aspx`