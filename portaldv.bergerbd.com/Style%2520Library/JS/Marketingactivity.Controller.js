var userId = _spPageContextInfo.userId;
var varSiteUrl = _spPageContextInfo.webAbsoluteUrl;
var requestId = "";
var jsonData = "";
var initiator = "";
var updateArray = [];
var ReceiptFileUpdated = "FileUpdated";
var ReceiptUpdated = "ReceiptUpdated";
var Delete = "Delete";
var entitlementText = "";
var employeeId = "";
var employeeName = "";
var employeeGrade = "";
var deptId = "";
var ofcLocation = "";
var mobile = "";
var requesterId = "";
var requesterName = "";
var opmId = "";
var opmName = "";
var hodApproverId = "";
var hodApproverName = "";
var paymentsApproverId = "";
var paymentsApproverName = "";
var mdApproverId = "";
var mdApproverName = "";
var nextApproverID = "";
var reviewLink = "";
var approvalLink = "";
var editLink = "";
var approverName = "";
var CostCentre = "";
var employee = "";
var workshopPurposeOrObjective = "";
var month = "";
var actualDate = "";
var actualExpenditure = "";
var status = "";
var pendingWithId = "";
var pendingWithName = "";
var soicId = "";
var soicName = "";
var accountsConcernId = "";
var accountsConcernName = "";
var gMMarketingId = "";
var gMMarketingName = "";
var marketingAccountantId = "";
var marketingAccountantName = "";
var marketingSupportExeId = "";
var marketingSupportExeName = "";
var headChannelEngagementId = "";
var headChannelEngagementName = "";
var fileData = [];
var uId = "";
var costCenterArrayObject = [];
var jsonResponse = processJSON(notificationReceiverJSON);
var delegate = "";
var empEmail = '';

/**
 *  List of Approval-Chain Approver's ID.
 */
const approvalChainId = {
    Approver1: undefined,
    Approver2: undefined,
    Approver3: undefined,
    Approver4: undefined,
    Approver5: undefined,
    Approver6: undefined,
    Approver7: undefined,
    Approver8: undefined,
};

let PendingApprovalUniqueId = ""
let currentApprover = ""
let nextApprover = ""
let PendingApprovalStatus = ""

let pageHasData = false;
let pageData = {
    ActivityName: "",
    ActivityType: "",
    BrandDescription: "",
    BudgetType: "",
    CommitmentItem: "",
    CostHead: "",
    ExpectedDeliveryDate: "",
    ID: "",
    ProjectName: "",
    RequiredVendorQuotation: "",
    ServiceName: "",
    ServiceReceivingDate: "",
    SingleVendorJustification: "",
    Status: "",
    Title: "",
    TotalExpectedExpense: ""
};


var spApp = angular
    .module("MarketingActivityApp", ['ngSanitize'])
    .config(function ($httpProvider) {
        var requests = 0;

        function show() {
            requests++;
            if (requests === 1) {
                $("#wait").show();
            }
        }

        function hide() {
            requests--;
            if (requests === 0) {
                $("#wait").hide();
            }
        }

        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    show();
                    return $q.when(config);
                },
                'response': function (response) {
                    hide();
                    return $q.when(response);
                },
                'responseError': function (rejection) {
                    hide();
                    return $q.reject(rejection);
                }
            };
        });
    })
    //config setting for showing in progress image -- End

    //Get Requester Information -- Start
    .controller("getRequesterInfoController", function ($scope, $http, $location) {
        var varCurrentUrl = $location.absUrl();
        var wm = $scope;
        var uId = "";
        var readMode = "";
        if (varCurrentUrl.indexOf('=') > -1) {
            var varCurrentUrlSplitArray = $location.absUrl().split('?');
            if (varCurrentUrlSplitArray.length >= 2) {
                var queryString = varCurrentUrlSplitArray[1];
                var parameters = queryString.split('&');
                for (var i = 0; i < parameters.length; i++) {
                    var param = parameters[i];
                    if (param.toLowerCase().indexOf('uniqueid=') > -1)
                        uId = param.split('=')[1];
                    else if (param.toLowerCase().indexOf('mode=') > -1)
                        readMode = param.split('=')[1];
                }
            }
        }
        //Reading unique id from url -- End	

        //Function for getting requester's information -- Start
        wm.getRequesterInformation = function () {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + bergerEmployeeInformationList + "')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq '" + requesterId + "'";

            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                $scope.requesters = data.d.results;
                initiator = data.d.results[0].EmployeeName;
                ofcLocation = data.d.results[0].OfficeLocation;
                mobile = data.d.results[0].Mobile;
                employeeGrade = data.d.results[0].EmployeeGrade;
                employeeId = data.d.results[0].EmployeeId;
                employeeName = data.d.results[0].EmployeeName;
                deptId = data.d.results[0].DeptID;
                opmId = data.d.results[0].OptManagerEmail.ID;
                opmName = data.d.results[0].OptManagerEmail.Title;
                requesterId = data.d.results[0].Email.ID;
                requesterName = data.d.results[0].Email.Title;
                CostCentre = data.d.results[0].CostCenter;
                empEmail = data.d.results[0].Email.EMail;
                wm.getAllApproverInformation();
                wm.getUniqueIdFromCurrentUrl();
                wm.getMarketingActivityListData(50, (maData) => {
                    pageHasData = true;
                    pageData.ProjectName = maData.ProjectName;
                    pageData.ActivityName = maData.ActivityName;
                    pageData.ActivityType = maData.ActivityType;
                    pageData.BrandDescription = maData.BrandDescription;
                    pageData.BudgetType = maData.BudgetType;
                    pageData.CommitmentItem = maData.CommitmentItem;
                    pageData.CostHead = maData.CostHead;
                    pageData.ExpectedDeliveryDate = maData.ExpectedDeliveryDate;
                    pageData.ID = maData.ID;
                    pageData.RequiredVendorQuotation = maData.RequiredVendorQuotation;
                    pageData.ServiceName = maData.ServiceName;
                    pageData.ServiceReceivingDate = maData.ServiceReceivingDate;
                    pageData.SingleVendorJustification = maData.SingleVendorJustification;
                    pageData.Status = maData.Status;
                    pageData.Title = maData.Title;
                    pageData.TotalExpectedExpense = maData.TotalExpectedExpense;
                    console.log(pageData);
                });
                if (pageHasData) {
                    wm.setPageData(pageData);
                }
                wm.getApprovalListData(PendingApprovalUniqueId, (data) => { PendingApprovalStatus = data?.Status || "", currentApprover = data?.PendingWith.results[0].Id || "" });
            }).error(function (data, status, headers, config) { });
        }
        //Function for getting requester's information -- End

        //=============Get approver list -- Start===============
        wm.getAllApproverInformation = function () {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + workflowAprroverInforList + "')/items?&$top=2000000&$select=DeptID,Location,HOD/ID,HOD/Title,AcInChrg/ID,AcInChrg/Title,InvInchrg/ID,InvInchrg/Title,Approver7/ID,Approver7/Title,Approver2/ID,Approver2/Title,Approver3/ID,Approver3/Title,BranchSalesM/ID,BranchSalesM/Title&$expand=BranchSalesM/ID,HOD/ID,AcInChrg/ID,InvInchrg/ID,Approver7/ID,Approver2/ID,Approver3/ID";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                /**
                 * Returns an array of list items from the Approval-Information-list.
                 * @type {Array<Array<Array>>}
                 */
                const response = data.d.results;

                if (response.length > 0) {
                    for (var count = 0; count < response.length; count++) {
                        if (response[count].DeptID == deptId && response[count].Location == ofcLocation) {
                            // #region (OLD CODE) This is the old code, which was used to populate the approval chain. This is not used anymore.
                            /* soicId = response[count].BranchSalesM.ID; 
                            soicName = response[count].BranchSalesM.Title;

                            soicId = response[count].HOD.ID;
                            soicName = response[count].HOD.Title;

                            accountsConcernId = response[count].AcInChrg.ID;
                            accountsConcernName = response[count].AcInChrg.Title;
                            */
                            //#endregion
                            //* Loop through the Approvers and save to the approvalChainId array
                            for (let i = 1; i <= 8; i++) {
                                const approverKey = `Approver${i}`;
                                if (response[count][approverKey]) {
                                    const approverID = response[count][approverKey].ID
                                    if (typeof approverID === 'number') { /* this will skip the approval with no ID */
                                        approvalChainId[approverKey] = approverID;
                                    }
                                }
                            }
                        }
                        if (response[count].DeptID == "SM02" && response[count].Location == "Corporate") {
                            //gMMarketingId = response[count].HOD.ID;
                            //gMMarketingName = response[count].HOD.Title;
                            headChannelEngagementId = response[count].Approver3.ID;
                            headChannelEngagementName = response[count].Approver3.Title;
                        }
                        if (response[count].DeptID == "SM03" && response[count].Location == "Corporate") {
                            gMMarketingId = response[count].HOD.ID;
                            gMMarketingName = response[count].HOD.Title;
                        }
                        if (response[count].DeptID == "SM01" && response[count].Location == "Corporate") {
                            marketingAccountantId = response[count].InvInchrg.ID;
                            marketingAccountantName = response[count].InvInchrg.Title;
                            marketingSupportExeId = response[count].Approver7.ID;
                            marketingSupportExeName = response[count].Approver7.Title;
                        }
                    }
                }
                wm.setNextApprover();
            }
            ).error(function (data, status, headers, config) { });
        }
        //------------Get approver list -- End----------------

        wm.getApprovalListData = function (uid, successCallback, errorCallback) {
            const apiUrl = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getByTitle('PendingApproval')/items`;
            const filter = `RequestLink eq 'https://portaldv.bergerbd.com/leaveauto/SitePages/MarketingActivity.aspx?UniqueId=${uid}'`;
            const query = `?$expand=PendingWith&$select=Title,ProcessName,Status,PendingWith/Id&$filter=${filter}`;

            $.ajax({
                async: false,
                url: apiUrl + query,
                method: "GET",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose"
                },
                success: function (data) {
                    if (typeof successCallback === 'function') {
                        successCallback(data.d.results[0]);
                    }
                },
                error: function (error) {
                    if (typeof errorCallback === 'function') {
                        errorCallback(error);
                    }
                }
            });
        }

        wm.setPageData = function (maData) {
            $("#projectName").val(maData.ProjectName).prop("disabled", true);
            $("#selectService").val(maData.ServiceName).prop("disabled", true);

            setTimeout(function () {
                $("#selectService").trigger("change");
                $("#selectedActivity").prop("disabled", true);
                    
            }, 2000);
            setTimeout(function () {
                $("#selectedActivity").val(maData.ActivityName).prop("disabled", true);
            }, 4000);
            $("#selectActivityType").val(maData.ActivityType).prop("disabled", true);
            $("#selectBudgetType").val(maData.BudgetType).prop("disabled", true);
            $("#selectBrandDescription").val(maData.BrandDescription).prop("disabled", true);
            $("#selectCommitmentItem").val(maData.CommitmentItem).prop("disabled", true);
            $("#totalExpectedExpense").val(maData.TotalExpectedExpense).prop("disabled", true);
            $("#selectRequiredVendorQuotation").val(maData.RequiredVendorQuotation).prop("disabled", true);
        }

        wm.getUniqueIdFromCurrentUrl = function () {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                PendingApprovalUniqueId = urlParams.get('UniqueId');
            } catch (e) {
                PendingApprovalUniqueId = null;
            }
        }

        wm.setNextApprover = function () {

            if (PendingApprovalStatus == '') {
                nextApprover = opmId;
            } else if (PendingApprovalStatus == 'OPMApproved' || PendingApprovalStatus == 'Submitted') {
                const keys = Object.keys(approvalChainId);

                if (currentApprover !== opmId) {
                    for (const key in approvalChainId) {
                        if (approvalChainId[key] === currentApprover) {
                            let currentIndex = keys.indexOf(key);

                            if (currentIndex !== -1 && currentIndex < keys.length - 1) {

                                if (approvalChainId[keys[currentIndex + 1]] !== undefined) {
                                    const nextApproverKey = keys[currentIndex + 1];
                                    nextApprover = approvalChainId[nextApproverKey];
                                    break;
                                } else {
                                    while (currentIndex < keys.length - 1) {
                                        if (approvalChainId[keys[currentIndex]] !== currentApprover && approvalChainId[keys[currentIndex]] !== undefined) {
                                            const nextApproverKey = keys[currentIndex];
                                            nextApprover = approvalChainId[nextApproverKey];
                                            break;
                                        } else {
                                            currentIndex++;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 1; i <= 8; i++) {
                        const approverKey = `Approver${i}`;
                        if (approvalChainId[approverKey] !== undefined) {
                            nextApprover = approvalChainId[approverKey];
                            break;
                        }
                    }
                }
            }
        }

        wm.getMarketingActivityListData = function (MarketingActivityID, successCallback) {
            const apiUrl = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/lists/getByTitle('MarketingActivityMaster')/items`;

            const selectFields = "ActivityName,ServiceName,ActivityType,BudgetType,CostHead,BrandDescription,CommitmentItem,TotalExpectedExpense,ExpectedDeliveryDate,ServiceReceivingDate,RequiredVendorQuotation,SingleVendorJustification,ProjectName,Status,Title";

            const filter = `Id eq ${MarketingActivityID}`;
            const query = `?$select=${selectFields}&$filter=${filter}`;

            $.ajax({
                async: false,
                url: apiUrl + query,
                method: "GET",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose"
                },
                success: function (data) {
                    if (typeof successCallback === 'function') {
                        successCallback(data.d.results[0]);
                    }
                },
                error: function (error) {
                    if (typeof errorCallback === 'function') {
                        errorCallback(error);
                    }
                }
            });
        }



        if (uId != "") {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityMaster + "')/items?&$top=2000000&$select=ID,Status,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title&$expand=PendingWith/ID,Author/ID&$filter=GUID eq '" + uId + "'";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                requestId = data.d.results[0].ID;
                requesterId = data.d.results[0].Author.ID;
                requesterName = data.d.results[0].Author.Title;
                pendingWithId = data.d.results[0].PendingWith.ID,
                    pendingWithName = data.d.results[0].PendingWith.Title,
                    status = data.d.results[0].Status,
                    $scope.today = new Date(data.d.results[0].Created);
                wm.getRequesterInformation();
            }).error(function (data, status, headers, config) { });
        } else {
            requesterId = userId;
            wm.getRequesterInformation();
        };
    })
    //Get Requester Information -- End

    //Save Request Data in List -- Start
    .controller("marketingActivityController", function ($scope, $http, $location, $window) {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + specialOrderRequestList + "')/items";
        var vm = $scope;
        vm.uniqueId = "";
        vm.readMode = "";
        vm.status = "";
        vm.entitlement = "";
        vm.currentUser = userId;
        vm.pendingWithId = "";
        vm.employeeName = "";
        vm.delegatee = "";
        $scope.allCities = [];
        $scope.cities = [];
        vm.myVar = false;
        $scope.showSaveButton = false;
        $scope.saveRowIndex = "";
        $scope.totalCost = 0;
        $scope.totalEmployeeExpenseCost = 0;
        $scope.totalCompanyExpenseCost = 0;
        $scope.totalExpenseCost = 0;
        $scope.totalReceiptAmount = 0;
        $scope.showStatus = false;
        $scope.addAuditLogFlag = true;

        //Reading unique id from url -- Start
        var varCurrentUrl = $location.absUrl();
        if (varCurrentUrl.indexOf('=') > -1) {
            var varCurrentUrlSplitArray = $location.absUrl().split('?');
            if (varCurrentUrlSplitArray.length >= 2) {
                var queryString = varCurrentUrlSplitArray[1];
                var parameters = queryString.split('&');
                for (var i = 0; i < parameters.length; i++) {
                    var param = parameters[i];
                    if (param.toLowerCase().indexOf('uniqueid=') > -1)
                        $scope.uniqueId = param.split('=')[1];
                    else if (param.toLowerCase().indexOf('mode=') > -1)
                        $scope.readMode = param.split('=')[1];
                }
            }
        }
        //Reading unique id from url -- End
        $scope.workshopProposalRows = [];
        $scope.receiptCounter = 1;
        $scope.receiptRowsMaintain = [];

        //Add receipt row function -- Start
        vm.addReceiptRow = function () {
            var totalEstimatedAmount = 0;
            var validationMsg = "";
            if (typeof vm.expectedDate == "undefined" || vm.expectedDate == "") {
                validationMsg += "Please select Expected Date.";
            }
            if (typeof vm.workshopLocation == "undefined" || vm.workshopLocation == "") {
                validationMsg += "Please provide Workshop Location.";
            }

            if (typeof vm.purpose == "undefined" || vm.purpose == "") {
                validationMsg += "Please provide Purpose.";
            }
            if (typeof vm.expectedParticipant == "undefined" || vm.expectedParticipant == "") {
                validationMsg += "Please provide no. of Expected Participant.";
            }
            if (validationMsg != "") {
                vm.showMessage('red', validationMsg);
                return false;
            }

            var receiptText = "";

            $scope.purpose = $("#selectPurpose option:selected").text();
            $scope.gLCode = $("#selectPurpose option:selected").val();

            // $scope.gLCode = $("#inpGLCode").val();
            $scope.costCenter = CostCentre;
            $scope.costCenter = $("#inpCostCenter").val();
            $scope.totalAmount = $("#inpFldTotalAmount").val();
            $scope.totalActualExpenditure = $("#lblTotalActualExpenditure").text();
            $scope.workshopProposalRows.push({
                slNo: $scope.receiptCounter,
                Month: $scope.month,
                ExpectedDate: $scope.expectedDate,
                WorkshopLocation: $scope.workshopLocation,
                ExpectedParticipant: $scope.expectedParticipant,
                Purpose: $scope.purpose,
                GLCode: $scope.gLCode,
                CostCenter: $scope.costCenter,
                IONumber: $scope.iONumber,
                FoodCost: $scope.foodCost,
                HallOrVenueRent: $scope.hallOrVenueRent,
                PromotionalItem: $scope.promotionalItem,
                TotalAmount: $scope.totalAmount,
                DecorationCost: $scope.decorationCost,
                OtherCost: $scope.otherCost,
                OtherGiftItems: $scope.otherGiftItems,
                BudgetedExpenditure: $scope.budgetedExpenditure,
                //------ for reimbursment start------------
                ActualDate: $scope.actualDate,
                ActualLocation: $scope.actualLocation,
                ActualParticipant: $scope.actualParticipant,
                ActualFoodCost: $scope.actualFoodCost,
                ActualDecorationCost: $scope.actualdecorationCost,
                ActualHallOrVenueRent: $scope.actualHallOrVenueRent,
                ActualPromotionalItem: $scope.actualPromotionalItem,
                TotalActualExpenditure: $scope.totalActualExpenditure,
                ActualDecorationCost: $scope.actualDecorationCost,
                ActualExpenditure: $scope.actualExpenditure,
                ActualOtherCost: $scope.actualOtherCost
                //------ for reimbursment end------------
            });
            $scope.receiptCounter++;

            if (uId == "" || $scope.uniqueId == "" || $scope.status == 'Submitted' || $scope.status == 'SOICtoUser' || $scope.status == 'GMMarketingToUser' || status == 'Submitted' || status == 'SOICtoUser' || status == 'GMMarketingToUser' || status == 'MarketingAccountantToUser') {
                for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                    totalEstimatedAmount += parseFloat($scope.workshopProposalRows[count].TotalAmount);
                    $scope.totalEstimatedAmount = totalEstimatedAmount;
                }
            }
            if (status == 'ProposalApproved&ActualBillSubmissionRequest' || status == 'MarketingAccountantToUser' || status == 'SOICtoUser' || status == 'GMMarketingToUser' || status == 'AccountsConcernToUser' || status == 'MarketingAccountantToUser' || $scope.status == 'MarketingAccountantToUser' || $scope.status == 'SOICtoUser' || $scope.status == 'GMMarketingToUser') {
                for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                    totalActualExpenditure += parseFloat($scope.workshopProposalRows[count].actualExpenditure);
                    $scope.totalActualExpenditure = totalActualExpenditure;
                }
            }

            reset();

            function reset() {
                $("#btnsubmit").prop("disabled", false);
                $('input[type=text]').val('');
                $('#textarea').val('');
                $('input[type=select]').val('');
            }
        }
        //---------------Add receipt row function -- End-----------

        //Delete New row -- Start
        $scope.deleteRow = function (index) {
            if ($scope.rows.length > 1) {
                $scope.rows.splice(index, 1);
                $scope.cities.splice(index, 1);
            } else {
                vm.showMessage('red', 'There should be atleast one destination');
            }
        }
        //Delete New row -- End

        //Delete receipt row -- Start
        vm.deleteReceiptRow = function (index) {
            var receiptId = $scope.workshopProposalRows[index].Id;
            $scope.workshopProposalRows.splice(index, 1);
            setTimeout(function () {
                for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                    $scope.totalEstimatedAmount = parseFloat($scope.totalEstimatedAmount) - parseFloat($scope.workshopProposalRows[index].TotalAmount);
                }
            }, 1000);
        }
        //----------Delete receipt row -- End----------

        //=======Edit receipt row -- Start
        vm.editReceiptRow = function (index) {
            if ($scope.status == "ProposalApproved&ActualBillSubmissionRequest" || $scope.status == "ReimbursementSOICToUser" || $scope.status == "ReimbursementGMMarketingToUser") {
                $scope.actualLineItemNotAdded = true;
                $scope.actualLineItemNotAdding = false;
            };
            $scope.showSaveButton = true;
            $scope.month = $scope.workshopProposalRows[index].Month;
            $scope.expectedDate = $scope.workshopProposalRows[index].ExpectedDate;
            $scope.workshopLocation = $scope.workshopProposalRows[index].WorkshopLocation;
            $scope.expectedParticipant = $scope.workshopProposalRows[index].ExpectedParticipant;
            $scope.purpose = $scope.workshopProposalRows[index].Purpose;
            $scope.gLCode = $scope.workshopProposalRows[index].GLCode;
            $scope.costCenter = $scope.workshopProposalRows[index].CostCenter;
            $scope.iONumber = $scope.workshopProposalRows[index].IONumber;
            $scope.foodCost = $scope.workshopProposalRows[index].FoodCost;
            $scope.hallOrVenueRent = $scope.workshopProposalRows[index].HallOrVenueRent;
            $scope.promotionalItem = $scope.workshopProposalRows[index].PromotionalItem;
            $scope.totalAmount = $scope.workshopProposalRows[index].TotalAmount;
            $scope.decorationCost = $scope.workshopProposalRows[index].DecorationCost;
            $scope.otherCost = $scope.workshopProposalRows[index].OtherCost;
            $scope.otherGiftItems = $scope.workshopProposalRows[index].OtherGiftItems;
            $scope.budgetedExpenditure = $scope.workshopProposalRows[index].BudgetedExpenditure;
            $scope.myFile = $scope.workshopProposalRows[index].file;
            $scope.saveRowIndex = index;
            //------ for reimbursment start------------
            $scope.actualDate = $scope.workshopProposalRows[index].ActualDate;
            $scope.actualLocation = $scope.workshopProposalRows[index].ActualLocation;
            $scope.actualPromotionalItem = $scope.workshopProposalRows[index].ActualPromotionalItem;
            $scope.actualTotalAmount = $scope.workshopProposalRows[index].ActualTotalAmount;
            $scope.actualExpenditure = $scope.workshopProposalRows[index].ActualExpenditure;

            if ($scope.status == "AccountsConcernToUser") {
                $scope.actualPromotionalItem = $scope.workshopProposalRows[index].PromotionalItem;
                $scope.actualParticipant = 0;
                $scope.actualFoodCost = 0;
                $scope.actualdecorationCost = 0;
                $scope.actualHallOrVenueRent = 0;
                $scope.actualDecorationCost = 0;
                $scope.actualOtherCost = 0;
            } else {
                $scope.actualParticipant = $scope.workshopProposalRows[index].ActualParticipant;
                $scope.actualFoodCost = $scope.workshopProposalRows[index].ActualFoodCost;
                $scope.actualdecorationCost = $scope.workshopProposalRows[index].ActualdecorationCost;
                $scope.actualHallOrVenueRent = $scope.workshopProposalRows[index].ActualHallOrVenueRent;
                $scope.actualDecorationCost = $scope.workshopProposalRows[index].ActualDecorationCost;
                $scope.actualOtherCost = $scope.workshopProposalRows[index].ActualOtherCost;
            }
            //------ for reimbursment end------------
            var receiptId = $scope.workshopProposalRows[index].Id;
            if ($scope.status == "AccountsConcernToUser") {
                $("#inpFldActualFoodCost").val("0");
                $("#inpFldActualParticipant").val("0");
                $("#inpFldActualHallOrVenueRent").val("0");
                $("#inpFldActualOtherCost").val("0");
                $("#inpFldinpFldActualDecorationCost").val("0");
            }
        }
        //Edit receipt row -- End


        //Save receipt row -- Start
        vm.saveReceiptRow = function () {
            var validationMsg = "";
            if (validationMsg != "") {
                vm.showMessage('red', validationMsg);
                return false;
            }
            $scope.saveData = [];
            if ($scope.status == 'GMMarketingToMarketingAccountant') {
                $scope.purpose = $("#selectPurpose option:selected").text();
                $scope.gLCode = $("#selectPurpose option:selected").val();
            }
            //$scope.gLCode = $("#inpGLCode").val();
            $scope.saveData.push({
                slNo: $scope.saveRowIndex + 1,
                Id: $scope.workshopProposalRows[$scope.saveRowIndex].Id,
                Month: $scope.month,
                ExpectedDate: $scope.expectedDate,
                WorkshopLocation: $scope.workshopLocation,
                ExpectedParticipant: $scope.expectedParticipant,
                Purpose: $scope.purpose,
                GLCode: $scope.gLCode,
                CostCenter: $scope.costCenter,
                IONumber: $scope.iONumber,
                FoodCost: $scope.foodCost,
                HallOrVenueRent: $scope.hallOrVenueRent,
                PromotionalItem: $scope.promotionalItem,
                TotalAmount: $scope.totalAmount,
                DecorationCost: $scope.decorationCost,
                OtherCost: $scope.otherCost,
                OtherGiftItems: $scope.otherGiftItems,
                BudgetedExpenditure: $scope.budgetedExpenditure,
                //---------for reimbursment start-------------
                ActualDate: $scope.actualDate,
                ActualLocation: $scope.actualLocation,
                ActualParticipant: $scope.actualParticipant,
                ActualFoodCost: $scope.actualFoodCost,
                ActualHallOrVenueRent: $scope.actualHallOrVenueRent,
                ActualPromotionalItem: $scope.actualPromotionalItem,
                TotalActualExpenditure: $scope.totalActualExpenditure,
                ActualDecorationCost: $scope.actualDecorationCost,
                ActualExpenditure: $scope.actualExpenditure,
                ActualOtherCost: $scope.actualOtherCost
                //-------------reimbursment end ------------
            });
            //$scope.saveData.push({slNo:$scope.saveRowIndex + 1, Id:$scope.receiptRows[$scope.saveRowIndex].Id, ReceiptType:{Id:$scope.expenseReceiptType, WTText:receiptText1} ,Amount:$scope.receiptAmount, Currency:{Id:$scope.currency, Title:currencyText1}, ConversionRate:$scope.conversionRate, Date:$scope.receiptDate, Description:$scope.description, AttachmentFiles:{results:[{ServerRelativeUrl: document.getElementById("receiptFile").files[0], FileName: ''}]}});

            $scope.workshopProposalRows[$scope.saveRowIndex] = $scope.saveData[0];
            $scope.showSaveButton = false;
            $scope.receiptLink = "";
            $scope.myFile = null;
            $("#receiptFile").val('');
            var control = $("#receiptFile");
            control.replaceWith(control = control.clone(true));
            $scope.calculateTotalAmount();
            $scope.calculateActualExpenditure();
            if ($scope.status == 'GMMarketingToMarketingAccountant' && $scope.readMode == 'e') {
                $scope.updateGlCcIoInfo();
            }
            reset();
            function reset() {
                $("#btnsubmit").prop("disabled", false);
                $('input[type=text]').val('');
                $('#textarea').val('');
                $('input[type=select]').val('');
            }
            if ($scope.status == "ProposalApproved&ActualBillSubmissionRequest" || $scope.status == "ReimbursementSOICToUser" || $scope.status == "ReimbursementGMMarketingToUser") {
                $scope.actualLineItemNotAdded = false;
                $scope.actualLineItemNotAdding = true;
            };
            /*
            if ($scope.status == "ReimbursementSOICToUser" || $scope.status == "ReimbursementGMMarketingToUser") {
                $scope.actualLineItemNotAdded = true;
                $scope.actualLineItemNotAdding = true;
            };
            */
        }
        //Save receipt row -- End

        //===========Populate Purpose and GL Code dropdown -- Start========
        vm.getWorkshopPurposeList = function () {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopPurposeGlCode + "')/items?&$top=2000000&$select=option,value";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                $scope.purposeOptions = data.d.results;
            }).error(function (data, status, headers, config) {
                $scope.insertLog(WorkshopPurposeGlCode, message, "Fail");
            });
        }

        vm.getActivityName = function () {
            var selectedService = $scope.serviceName; // Get the selected Service Name
            $scope.activityNamesDropdown = "";
            // SharePoint REST API URL to retrieve Activity Name based on selected Service Name
            var apiUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('MarketingActivityMapper')/items?$filter=ServiceName eq '" + selectedService + "'&$select=ActivityName";

            $.ajax({
                url: apiUrl,
                method: "GET",
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function (data) {
                    var activityNames = [];
                    if (data.d.results.length > 0) {
                        for (var i = 0; i < data.d.results.length; i++) {
                            activityNames.push(data.d.results[i].ActivityName);
                        }
                        // Update the Activity Name field with the fetched value
                        $scope.activityNamesDropdown = activityNames;
                        console.log("Activity Names:", activityNames);
                        $scope.$apply(); // Apply changes to the AngularJS scope
                    }
                },
                error: function (error) {
                    console.log("Error fetching Data: " + JSON.stringify(error));
                }
            });
        }

        vm.getCostHead = function () {
            var selectedActivity = $scope.selectedActivity; // Get the selected Service Name

            $scope.costHeadsDropdown = "";
            // SharePoint REST API URL to retrieve Activity Name based on selected Service Name
            var apiUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('MarketingActivityMapper')/items?$filter=ActivityName eq '" + selectedActivity + "'&$select=CostHead";

            $.ajax({
                url: apiUrl,
                method: "GET",
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function (data) {
                    var costHeads = [];
                    if (data.d.results.length > 0) {
                        for (var i = 0; i < data.d.results.length; i++) {
                            costHeads.push(data.d.results[i].CostHead);
                        }
                        // Update the Activity Name field with the fetched value
                        $scope.costHeadsDropdown = costHeads;
                        console.log("Cost Heads:", costHeads);
                        $scope.$apply(); // Apply changes to the AngularJS scope
                    }
                },
                error: function (error) {
                    console.log("Error fetching Data: " + JSON.stringify(error));
                }
            });
        }

        vm.getPurposeGLCode = function () {
            setTimeout(function () {
                $scope.gLCode = $("#selectPurpose option:selected").val();

                function reset() {
                    $('#inpGLCode').text('$scope.gLCode');
                }
            }, 1000);
        }
        /*  vm.getPurposeGLCode = function() {
            //$scope.gLCode = $scope.$parent.purpose;
            //var e = document.getElementById("selectPurpose");
            //$scope.gLCode = e.options[e.selectPurpose].value;
            //$scope.purpose = e.options[e.selectPurpose].text;
            //$scope.purpose = $("#selectPurpose :selected").text();
        	
            setTimeout(function() {
                $scope.purpose = $("#selectPurpose :selected").text();
                $scope.gLCode = $("#selectPurpose option:selected").val();
            }, 1000);
        } */

        //  ============== AutoComplete dropDown Menue by MK start====================
        vm.getCostCenterCollection = function () {
            var costCenterCodeDescriptionObject = '';
            var costCenterDescriptionCodeObject = '';
            var costCenterCodeDescriptionObjectArray = [];
            var costCenterDescriptionCodeObjectArray = [];
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + BergerCostCenterMaster + "')/items?&$top=2000000&$select=ID,CostCenter,CostCenterDescription";
            $("#inpCostCenter").val(CostCentre);

            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                $scope.costCenterCollection = data.d.results;

                for (var i = 0; i < $scope.costCenterCollection.length; i++) {
                    $scope.individualCostCenterCode = ($scope.costCenterCollection[i].CostCenter).substring(2, 10);
                    $scope.individualCostCenterDescription = $scope.costCenterCollection[i].CostCenterDescription;

                    costCenterCodeDescriptionObject = {
                        "key": $scope.individualCostCenterCode + "-" + $scope.individualCostCenterDescription,
                        "value": $scope.individualCostCenterCode + "-" + $scope.individualCostCenterDescription
                    };
                    costCenterDescriptionCodeObject = {
                        "key": $scope.individualCostCenterDescription + "(#" + $scope.individualCostCenterCode + ")",
                        "value": $scope.individualCostCenterCode + "-" + $scope.individualCostCenterDescription
                    };

                    costCenterCodeDescriptionObjectArray.push(costCenterCodeDescriptionObject);
                    costCenterDescriptionCodeObjectArray.push(costCenterDescriptionCodeObject);
                }
                costCenterArrayObject = costCenterCodeDescriptionObjectArray.concat(costCenterDescriptionCodeObjectArray);

                for (var i = 0, l = arr.length; i < l; i++)

                    if (costCenterArrayObject.indexOf(arr[i]) === -1 && arr[i] !== '')
                        costCenterArrayObject.push(arr[i]);
                $scope.costCenterArrayObject = costCenterArrayObject;
            }).error(function (data, status, headers, config) {
                $scope.insertLog(BergerCostCenterMasterLogList, message, "Fail");
            });
        }

        vm.getCostCenterByNameWithAutoComplete = function () {
            var searchTerm = ($('#inpCostCenter').val()).toUpperCase();
            var resultCostCenter = [];
            costCenterArrayObject.forEach(function (i) {
                if (i.key.indexOf(searchTerm) !== -1) {
                    resultCostCenter.push(i);
                }
            });
            $('#inpCostCenter').autocomplete({
                minLength: 1,
                source: resultCostCenter,
            });
        }
        //------------------AutoComplete dropDownMenue by MK start--by mk end ----------------------


        //======== Advanced Search link click for Account/GL Code -- Start ===============
        $scope.openGLList = function (index) {
            var Url = _spPageContextInfo.webAbsoluteUrl + SearchGLURL + "?rowNo=" + index;
            var varTitle = "GL Code";
            openDialog(Url, varTitle, varWidth, varHeight);

            //OpenDialog Function ---Start
            function openDialog(url, title, width, height) {
                var options = {
                    url: url,
                    width: width / 1.2,
                    height: height / 1.6,
                    title: title,
                    dialogReturnValueCallback: demoCallback
                };
                SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showModalDialog", options);

                function demoCallback(result, target) {
                    if (result == SP.UI.DialogResult.ok) {
                        window.location.reload();
                    }
                }
            }
            //OpenDialog Function ---End
        }

        // Function for getting Account/GL information -- start
        $scope.getGLByCode = function (accountCode, index) {
            var grandTotal = 0;
            var totalVolumn = 0;
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + GLMaster + "')/items?&$top=2000000&$select=ID,AccountCode,AccountName,&$filter=AccountCode eq '" + accountCode + "'";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                if (data.d.results.length > 0) {
                    $scope.gLCode = data.d.results[0].MaterialCode;
                    $scope.gLName = data.d.results[0].MaterialName;
                }
            }).error(function (data, status, headers, config) { });
        }
        // Function for getting Account/GL information -- end

        //=============== calculate estimated TotalAmount start ==================
        vm.calculateTotalAmount = function () {
            if (uId == "" || $scope.uniqueId == "" || status == 'SOICtoUser' || status == 'GMMarketingToUser' || status == 'AccountsConcernToUser' || status == 'MarketingAccountantToUser' || $scope.status == 'SOICtoUser' || $scope.status == 'GMMarketingToUser' || $scope.status == 'AccountsConcernToUser') {
                var totalEstimatedAmount = 0;
                if (typeof $scope.foodCost == "undefined" || $scope.foodCost == "" || typeof $scope.hallOrVenueRent == "undefined" || $scope.hallOrVenueRent == "" || typeof $scope.decorationCost == "undefined" || $scope.decorationCost == "" || typeof $scope.otherCost == "undefined" || $scope.otherCost == "") {

                    return false;
                } else {
                    $scope.totalAmount = parseFloat($scope.foodCost) * parseFloat($scope.expectedParticipant) + parseFloat($scope.hallOrVenueRent) + parseFloat($scope.decorationCost) + parseFloat($scope.otherCost);
                    setTimeout(function () {
                        for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                            totalEstimatedAmount += parseFloat($scope.workshopProposalRows[count].TotalAmount);
                            $scope.totalEstimatedAmount = totalEstimatedAmount;
                        }
                    }, 1000);
                }
            }
        }
        //------------- calculate estimated TotalAmount end -------------------

        //============== calculate Actual TotalExpenditure start ==================
        vm.calculateActualExpenditure = function () {
            if ($scope.status == 'ProposalApproved&ActualBillSubmissionRequest' || $scope.status == 'MarketingAccountantToUser' || $scope.status == 'SOICtoUser' || $scope.status == 'GMMarketingToUser' || $scope.status == 'AccountsConcernToUser' || $scope.status == 'MarketingAccountantToUser' || $scope.status == 'ReimbursementSOICToUser' || $scope.status == 'ReimbursementGMMarketingToUser') {
                var totalActualExpenditure = 0;
                if (typeof $scope.actualFoodCost == "undefined" || $scope.actualFoodCost == "" || typeof $scope.actualHallOrVenueRent == "undefined" || $scope.actualHallOrVenueRent == "" || typeof $scope.actualDecorationCost == "undefined" || $scope.actualDecorationCost == "" || $scope.actualOtherCost == "" || typeof $scope.actualOtherCost == "undefined") {

                } else {
                    $scope.actualExpenditure = parseFloat($scope.actualFoodCost) * parseFloat($scope.actualParticipant) + parseFloat($scope.actualHallOrVenueRent) + parseFloat($scope.actualDecorationCost) + parseFloat($scope.actualOtherCost);

                }
            }
            for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                if (typeof $scope.workshopProposalRows[count].ActualExpenditure == "undefined" || $scope.workshopProposalRows[count].ActualExpenditure == "") {
                    $scope.workshopProposalRows[count].ActualExpenditure = 0;
                }
                totalActualExpenditure += parseFloat($scope.workshopProposalRows[count].ActualExpenditure);
                $scope.totalActualExpenditure = totalActualExpenditure;
            }
        }
        //------------- calculate Actual TotalExpenditure end -------------------

        //Format date -- Start
        vm.formateDate = function (date) {
            if (date == null || date == "")
                return "";
            date = new Date(date);
            var dd = date.getDate();
            var mm = date.getMonth(); //January is 0!
            var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            mm = month[mm];
            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            var formattedDate = mm + ' ' + dd + ',' + yyyy;
            return formattedDate;
        }
        //Format date -- End

        angular.element(document).ready(function () {
            if (vm.uniqueId != "") {
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalMaster + "')/items?&$top=2000000&$select=ID,Title,WorkshopPurposeOrObjective,ActualExpenditure,PendingWith/ID,PendingWith/Title,Author/ID,Created,Status,Author/Title,TotalEstimatedAmount&$expand=PendingWith/ID,Author/ID&$filter=GUID eq '" + vm.uniqueId + "'";
                $http({
                    method: "GET",
                    url: url,
                    async: false,
                    headers: {
                        "accept": "application/json;odata=verbose"
                    }
                }).success(function (data, status, headers, config) {
                    $scope.wpmTableRow = data.d.results;
                    $scope.requestId = $scope.wpmTableRow[0].ID;
                    $scope.requestCode = $scope.wpmTableRow[0].Title;
                    //vm.employee = $scope.wpmTableRow[0].Employee;
                    $scope.workshopPurposeOrObjective = $scope.wpmTableRow[0].WorkshopPurposeOrObjective;
                    $scope.month = $scope.wpmTableRow[0].Month;
                    $scope.actualDate = $scope.wpmTableRow[0].ActualDate;
                    $scope.totalActualExpenditure = $scope.wpmTableRow[0].ActualExpenditure;
                    $scope.status = $scope.wpmTableRow[0].Status;
                    $scope.pendingWithId = $scope.wpmTableRow[0].PendingWith.ID;
                    $scope.pendingWithName = $scope.wpmTableRow[0].PendingWith.Title;
                    $scope.requesterId = $scope.wpmTableRow[0].Author.ID;
                    $scope.requesterName = $scope.wpmTableRow[0].Author.Title;
                    $scope.today = new Date($scope.wpmTableRow[0].Created);
                    $scope.totalEstimatedAmount = $scope.wpmTableRow[0].TotalEstimatedAmount;
                    if ($scope.status == "ProposalApproved&ActualBillSubmissionRequest" || $scope.status == "ReimbursementSOICToUser" || $scope.status == "ReimbursementGMMarketingToUser") {
                        $scope.actualLineItemNotAdded = true;
                        $scope.actualLineItemNotAdding = true;
                    };

                    $scope.getAllAttachments();
                    $scope.getAuditLog();
                    $scope.getWorkshopPurposeList();
                    $scope.checkDelegateApprover();
                    //$scope.getToggleBtnControll();
                }).error(function (data, status, headers, config) { });
            } else {
                $("#divAttachmentDisplayTbl").hide();
            }
        });

        //========= populating workshop purpose options function calling start==============
        if (vm.uniqueId == "" || $scope.status == "SOICtoUser" || $scope.status == "GMMarketingToUser" || $scope.status == "ReimbursementSOICtoUser" || $scope.status == "ReimbursementGMMarketingtoUser") {
            $scope.getWorkshopPurposeList();
        }
        //-----------------end-------------------------------------------------------------

        //============= toggle btn control start ========
        vm.getToggleBtnControll = function () {
            var myEl = angular.element(document.querySelector('#wpiToggleControlBtnDiv'));
            myEl.append('Hi<br/>');
        }
        //---------- toggle btn end -------------------	

        if ($scope.uniqueId == "") {
            if (typeof $scope.status == "" || $scope.status == "" || $scope.status == 'Submitted' || $scope.status == 'SOICtoGMMarketing' || $scope.status == 'GMMarketingToAccountsConcern' || $scope.status == 'AccountsConcernToMarketingAccountant') {
                if ($scope.workshopProposalRows.length != 0) {
                    $scope.toggleControlvalue = false;
                } else {
                    $scope.toggleControlvalue = true;
                }
            }
        }

        //===========show hide attachment div sart =========
        vm.showDivAttachmentDisplayTbl = function () {
            if (($scope.status == "Submitted" || $scope.status == "UserToSOIC" || $scope.status == "SOICToUser" || $scope.status == "SOICtoGMMarketing" || $scope.status == "UserToGMMarketing" || $scope.status == "GMMarketingToMarketingAccountant" || $scope.status == "UserToMarketingAccountant" || $scope.status == "MarketingAccountantToAccountsConcern" || $scope.status == "ReimbursementMarketingAccountantToAccountsConcern" || $scope.status == "GMMarketingToAccountsConcern" || $scope.status == "UserToAccountsConcern" || $scope.status == "AccountsConcernToUser" || $scope.status == "AccountsConcernToMarketingAccountant" || $scope.status == "ReimbursementSubmitted" || $scope.status == "ReimbursementUserToSOIC" || $scope.status == "ReimbursementSOICtoGMMarketing" || $scope.status == "ReimbursementUserToGMMarketing" || $scope.status == "ReimbursementGMMarketingToACConcern" || $scope.status == "ReimbursementACConcernToMarketingAC") && $scope.showAttachmentDiv == 'true') {
                return true;
            }
            return false;
        }
        //----------------------end ---------------------


        vm.checkDelegateApprover = function () {
            setTimeout(function () {
                if ($scope.status == "Submitted" || $scope.status == "UserToSOIC" || $scope.status == "ReimbursementSubmitted" || $scope.status == "ReimbursementUserToSOIC") {
                    vm.checkDelegation(soicId);
                }
                if ($scope.status == "GMMarketingToMarketingAccountant" || $scope.status == "UserToMarketingAccountant" || $scope.status == "SOICtoGMMarketing" || $scope.status == "UserToGMMarketing" || $scope.status == "ReimbursementSOICtoGMMarketing" || $scope.status == "ReimbursementUserToGMMarketing") {
                    vm.checkDelegation(gMMarketingId);
                }
                if ($scope.status == "GMMarketingToAccountsConcern" || $scope.status == "UserToAccountsConcern" || $scope.status == "MarketingAccountantToAccountsConcern" || $scope.status == "ReimbursementMarketingAccountantToAccountsConcern" || $scope.status == "ReimbursementGMMarketingToACConcern") {
                    vm.checkDelegation(accountsConcernId);
                }
                if ($scope.status == "AccountsConcernToMarketingAccountant" || $scope.status == "ReimbursementACConcernToMarketingAC") {
                    vm.checkDelegation(marketingAccountantId);
                }
            }, 3000);
        }


        vm.getAuditLog = function () {
            //Get Audit History -- Start
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityLog + "')/items?&$top=2000000&$select=Created,Status,Author/Id,Author/Title,Comment&$expand=Author/ID&$filter=Title eq'" + requestId + "'";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                $scope.auditHistory = data.d.results;

            }).error(function (data, status, headers, config) {
                $scope.insertLog(MarketingActivityLog, message, "Fail");
            });
            //Get Audit History -- End 
        }

        vm.formatStringAfterSave = function (format) {
            var day = parseInt(format.substring(8, 10));
            var month = parseInt(format.substring(5, 7));
            var year = parseInt(format.substring(0, 4));
            var date = new Date(year, month - 1, day);
            return date;
        }

        vm.formatString = function (format) {
            var day = parseInt(format.substring(4, 6));
            var monthText = format.substring(0, 3);
            var year = parseInt(format.substring(7, 11));
            var monthInt = "";
            if (monthText == "Jan")
                monthInt = "01";
            else if (monthText == "Feb")
                monthInt = "02";
            else if (monthText == "Mar")
                monthInt = "03";
            else if (monthText == "Apr")
                monthInt = "04";
            else if (monthText == "May")
                monthInt = "05";
            else if (monthText == "Jun")
                monthInt = "06";
            else if (monthText == "Jul")
                monthInt = "07";
            else if (monthText == "Aug")
                monthInt = "08";
            else if (monthText == "Sep")
                monthInt = "09";
            else if (monthText == "Oct")
                monthInt = "10";
            else if (monthText == "Nov")
                monthInt = "11";
            else if (monthText == "Dec")
                monthInt = "12";
            monthInt = parseInt(monthInt);
            var date = new Date(year, monthInt - 1, day);
            return date;
        }
        //Calculate no of days -- End

        //Check delegation for a user -- Start
        vm.checkDelegation = function (id) {
            var today = new Date();
            var delegationData = "";
            var delegateeId = 0;
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + taskDelegationList + "')/items?&$top=2000000&$select=User/ID,User/Title,FormDate,ToDate,Delegate_x0020_To/ID,Delegate_x0020_To/Title&$expand=User/ID,Delegate_x0020_To/ID&$filter=FormDate le datetime'" + today.toISOString() + "' and ToDate ge datetime'" + today.toISOString() + "' and User/ID eq '" + id + "'";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                if (data.d.results.length > 0)
                    delegatee = data.d.results[0].Delegate_x0020_To.ID;
                vm.delegatee = delegatee;
            }).error(function (data, status, headers, config) {
                $scope.insertLog(taskDelegationList, message, "Fail");
            });
        }
        //Check delegation for a user -- End

        vm.clickSaveOrSubmit = function (action) {

            // $("#btnsubmit").prop("disabled", true);
            // $("#btnsave").prop("disabled", true);
            // $("#btncancel").prop("disabled", true);
            if (action == "Submitted") {

                $scope.saveMarketingActivityMaster();


                // if ($scope.status == 'SOICtoUser' ||$scope.status == 'ReimbursementSOICToUser'||$scope.status == 'ReimbursementGMMarketingToUser') {
                //     $scope.updateWorkshopDetails(action);
                //     $scope.updateRequest(vm.requestId);
                // } else if ($scope.status == 'GMMarketingToAccountsConcern' && $scope.readMode == 'e') {
                //     $scope.updateGlCcIoInfo();
                // } else {
                //     $scope.saveMarketingActivityMaster();
                // }
            }
        }


        //Show message function -- Start
        vm.showMessage = function (txtColor, msg) {
            $scope.showStatus = true;
            $scope.textColor = txtColor;
            $scope.bold = 'bold';
            $scope.statusText = msg;
            //$("#status").html(msg);
        }
        //Show message function -- End

        //============= GL CostCenter IO update function definition start ================
        vm.updateGLCCIOInfo = function () {
            for (var count = 0; count < $scope.workshopProposalRows.length; count++) {

                var requestId = $scope.workshopProposalRows[count].Id;
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalInfo + "')/items(" + requestId + ")";
                var actualWorkshopInfo = {
                    'Purpose': $scope.workshopProposalRows[count].Purpose,
                    'GLCode': $scope.workshopProposalRows[count].GLCode,
                    //'CostCenter': $scope.workshopProposalRows[count].CostCenter,
                    'IONumber': $scope.workshopProposalRows[count].IONumber,
                    '__metadata': {
                        "type": "SP.Data.WorkshopProposalInfoListItem"
                    },
                }
                $http({
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "Content-Type": "application/json; odata=verbose",
                        "X-HTTP-Method": "MERGE",
                        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                        "Content-Length": actualWorkshopInfo.length,
                        'IF-MATCH': "*"
                    },
                    method: "POST",
                    async: false,
                    url: url,
                    data: actualWorkshopInfo
                })
                    .then(updateRequestStatusSuccess)
                    .catch(function (message) {
                        $scope.insertLog(WorkshopProposalInfo, message, "Fail");
                    });

                function updateRequestStatusSuccess(data, status, headers, config) {
                    //alert("Updated one line item with actual info successfully");
                }
            }
        }
        // ------------------ end -------------------------------


        //============function definition of updating central Pending Approval list start==============
        vm.updatePendingApprovallistWithLink = function (sta, pen, tit, proName, requestLink) {
            $.ajax({
                async: true,
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('PendingApproval')/items?&$top=1&$select=Id,Title,ProcessName&$filter=(Title eq '" + tit + "') and (ProcessName eq '" + proName + "')",
                method: "GET",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose"
                },
                success: function (data) {
                    updateAtMyTask(data.d.results[0].ID, sta, pen);
                },
                error: function (error) {
                    debugger;
                    console.log(JSON.stringify(error));
                }
            })

            function updateAtMyTask(uId, status, pendingWith) {
                var results = null;
                if (pendingWith == 0) {
                    results = [];
                } else {
                    results = [pendingWith];
                }
                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('PendingApproval')/items(" + uId + ")",
                    method: "POST",
                    data: JSON.stringify({
                        '__metadata': {
                            'type': 'SP.Data.PendingApprovalListItem'
                        },
                        'Status': status,
                        'PendingWithId': {
                            'results': results
                        },
                        'RequestLink': requestLink,
                    }),
                    headers: {
                        "accept": "application/json;odata=verbose",
                        "content-type": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "MERGE"
                    },
                    success: function (data) { },
                    error: function (error) {
                        console.log(JSON.stringify(error));
                    }
                })
            }
        }
        //------------------- end --------------------


        //Click Aprove/Reject button function -- Start
        vm.ApproverAction = function (action) {
            var updatedata = "";
            nextApproverID = "";
            $("#btnApprove").prop("disabled", true);
            $("#btnReject").prop("disabled", true);
            $("#btnChange").prop("disabled", true);
            $("#btncancel").prop("disabled", true);
            if (action == "Rejected") {
                if (vm.actionComment == "" || typeof vm.actionComment == "undefined") {
                    vm.showMessage('red', 'Please provide reason for rejection in comment box.');
                    return false;
                }
            }
            if (action == "Changed") {
                if (vm.actionComment == "" || typeof vm.actionComment == "undefined") {
                    vm.showMessage('red', 'Please provide reason for requesting change in comment box.');
                    return false;
                }
            }
            if ($scope.status == "Submitted" || $scope.status == "UserToSOIC") {
                vm.checkDelegation(soicId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = gMMarketingId;
                        approverName = soicName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "SOICtoGMMarketing",
                            'PendingWithId': gMMarketingId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = requesterName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "SOICtoUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': action,
                            'PendingWithId': 0
                        };
                        $scope.updateRequestStatus(updatedata);
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "SOICtoGMMarketing" || $scope.status == "UserToGMMarketing") {
                vm.checkDelegation(gMMarketingId);

                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = marketingAccountantId;
                        //nextApproverID = accountsConcernId;						
                        approverName = gMMarketingName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "GMMarketingToMarketingAccountant",

                            'PendingWithId': marketingAccountantId,

                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = requesterName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "GMMarketingToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': action,
                            'PendingWithId': 0
                        };
                        $scope.updateRequestStatus(updatedata);
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "GMMarketingToMarketingAccountant" || $scope.status == "UserToMarketingAccountant") {
                vm.checkDelegation(marketingAccountantId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        $scope.updateGLCCIOInfo();
                        nextApproverID = $scope.requesterId;
                        approverName = marketingAccountantName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "ProposalApproved&ActualBillSubmissionRequest",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = requesterName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "MarketingAccountantToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': action,
                            'PendingWithId': 0
                        };
                        $scope.updateRequestStatus(updatedata);
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "MarketingAccountantToAccountsConcern" || $scope.status == "ReimbursementMarketingAccountantToAccountsConcern") {
                vm.checkDelegation(accountsConcernId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = $scope.requesterId;
                        approverName = accountsConcernName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "AccountsConcernToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = accountsConcernName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "accountsConcernToUser",
                            'PendingWithId': $scope.$scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        validationMsg = "Any rejection is not allowed at this level of this workflow.";
                        vm.showMessage('red', validationMsg);
                        return false;
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "GMMarketingToAccountsConcern" || $scope.status == "UserToAccountsConcern") {
                vm.checkDelegation(accountsConcernId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = $scope.requesterId;
                        approverName = accountsConcernName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "AccountsConcernToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = accountsConcernName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "accountsConcernToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        validationMsg = "Any rejection is not allowed at this level of this workflow.";
                        vm.showMessage('red', validationMsg);
                        return false;
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "AccountsConcernToUser") {
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = $scope.requesterId;
                        approverName = marketingAccountantName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "MarketingAccountantToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        alert("Any Change Request is not allowed at this level of this workflow.");
                        return false;
                    } else {
                        alert("Any rejection is not allowed at this level of this workflow.");
                        return false;
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "AccountsConcernToMarketingAccountant") {
                vm.checkDelegation(marketingAccountantId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = $scope.requesterId;
                        approverName = marketingAccountantName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "MarketingAccountantToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        alert("Any Change Request is not allowed at this level of this workflow.");
                        return false;
                    } else {
                        alert("Any rejection is not allowed at this level of this workflow.");
                        return false;
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "ReimbursementSubmitted" || $scope.status == "ReimbursementUserToSOIC") {
                vm.checkDelegation(soicId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = gMMarketingId;
                        approverName = soicName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "ReimbursementSOICtoGMMarketing",
                            'PendingWithId': gMMarketingId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = requesterName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "ReimbursementSOICToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': action,
                            'PendingWithId': 0
                        };
                        $scope.updateRequestStatus(updatedata);
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "ReimbursementSOICtoGMMarketing" || $scope.status == "ReimbursementUserToGMMarketing") {
                vm.checkDelegation(gMMarketingId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = 0;
                        approverName = gMMarketingName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "Completed",
                            'PendingWithId': 0,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = requesterName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "ReimbursementGMMarketingToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': action,
                            'PendingWithId': 0
                        };
                        $scope.updateRequestStatus(updatedata);
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "ReimbursementGMMarketingToACConcern") {
                vm.checkDelegation(accountsConcernId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = marketingAccountantId;
                        approverName = accountsConcernName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "ReimbursementACConcernToMarketingAC",
                            'PendingWithId': marketingAccountantId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        nextApproverID = $scope.requesterId;
                        approverName = accountsConcernName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "ReimbursementAccountsConcernToUser",
                            'PendingWithId': $scope.requesterId,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else {
                        alert("Any rejection is not allowed at this level of this workflow.");
                        return false;
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else if ($scope.status == "ReimbursementACConcernToMarketingAC") {
                vm.checkDelegation(marketingAccountantId);
                if (userId == vm.pendingWithId || userId == vm.delegatee) {
                    if (action == "Approved") {
                        nextApproverID = 0;
                        approverName = marketingAccountantName;
                        updatedata = {
                            '__metadata': {
                                'type': 'SP.Data.WorkshopProposalMasterListItem'
                            },
                            'Status': "Completed",
                            'PendingWithId': 0,
                        };
                        $scope.updateRequestStatus(updatedata);
                    } else if (action == "Changed") {
                        alert("Any Change Request is not allowed at this level of this workflow.");
                        return false;
                    } else {
                        alert("Any rejection is not allowed at this level of this workflow.");
                        return false;
                    }
                } else {
                    validationMsg = "You are not authorized to approve/reject this request.";
                    vm.showMessage('red', validationMsg);
                    return false;
                }
            } else {
                alert("Status is not matched with any pre-defined workflow.");
                return false;
            }
            getAndUpdateAtMyTask(updatedata.Status, updatedata.PendingWithId, $scope.requestId, "WorkshopProposal");
        }
        //Click Aprove/Reject button function -- End

        //Update status and next approver in SO Request -- Start
        vm.updateRequestStatus = function (updatedata) {
            var generatedLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId;
            $http({
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose",
                    "X-HTTP-Method": "MERGE",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "Content-Length": updatedata.length,
                    'IF-MATCH': "*"
                },
                method: "POST",
                async: false,
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityMaster + "')/items(" + $scope.requestId + ")",
                data: updatedata
            })
                .then(updateRequestStatusSuccess)
                .catch(function (message) {
                    $scope.insertLog(MarketingActivityMaster + "3", message, "Fail");
                });

            //function updateRequestStatusSuccess() {
            function updateRequestStatusSuccess(data, status, headers, config) {
                if ($scope.addAuditLogFlag)
                    $scope.addAuditLog($scope.requestId, updatedata.Status, $scope.actionComment);

                reviewLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId + "&mode=read";
                approvalLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId;
                editLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId + "&mode=e";


                if (updatedata.Status == "Completed") {
                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [$scope.requesterId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, reviewLink, "", "WorkshopProposal");
                    vm.showMessage('green', 'Workshop Proposal Request has been Approved and completed successfully !');
                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [marketingAccountantId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, reviewLink, "", "Workshop Proposal Workflow");
                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [accountsConcernId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, reviewLink, "", "Workshop Proposal Workflow");
                }
                else if (updatedata.Status == "Rejected") {
                    $scope.readNotificationListTemplate(ApprovalRejectionTemplate, [$scope.requesterId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, reviewLink, "", "WorkshopProposal");
                    vm.showMessage('red', 'Workshop Proposal Request has been Rejected successfully !');
                }
                else if (updatedata.PendingWithId == $scope.requesterId) {
                    $scope.updatePendingApprovallistWithLink(updateStatus, $scope.requesterId, "WP-" + vm.requestId, "WorkshopProposal", editLink);
                    $scope.readNotificationListTemplate(ChangeRequestTemplate, [$scope.requesterId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, "", editLink, "WorkshopProposal");
                    vm.showMessage('green', 'Change Request has been processed successfully !');
                }
                else {
                    $scope.readNotificationListTemplate(ApproverTemplate, [updatedata.PendingWithId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, "", approvalLink, "WorkshopProposal");
                    vm.showMessage('green', 'Workshop Proposal Request has been approved successfully !');
                }



                if (updatedata.Status == "SOICtoGMMarketing") {
                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [headChannelEngagementId], [], initiator, approverName, "WP-" + requestId, updatedata.Status, reviewLink, "", "WorkshopProposal");

                } else if (updatedata.Status == "GMMarketingToMarketingAccountant") {

                    $scope.updatePendingApprovallistWithLink("GMMarketingToMarketingAccountant", marketingAccountantId, $scope.requestCode, "WorkshopProposal", editLink);

                } else if (updatedata.Status == "ProposalApproved&ActualBillSubmissionRequest" || updatedata.Status == "AccountsConcernToUser") {

                    $scope.updatePendingApprovallistWithLink("ProposalApproved&ActualBillSubmissionRequest", $scope.requesterId, $scope.requestCode, "WorkshopProposal", generatedLink);

                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [marketingSupportExeId], [], initiator, marketingSupportExeName, "WP-" + requestId, $scope.status, reviewLink, "", "Workshop Proposal Workflow");

                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [accountsConcernId], [], initiator, marketingAccountantName, "WP-" + requestId, $scope.status, reviewLink, "", "Workshop Proposal Workflow");


                } else {
                    //vm.showMessage('red', 'E-mail Notification is not defined for this status.');
                    //return false;
                }

                //Hide action button After reimbursement is submitted
                if (updatedata.Status == "ReimbursementSubmitted") {
                    $("#divActionButtonPanel").hide();
                }

                $('#wait').show();
                vm.showMessage('green', 'Action has been proceeded successfully !');
                setTimeout(function () {
                    $window.parent.location.href = _spPageContextInfo.siteAbsoluteUrl + approveRedirectURL;
                    $('#wait').hide();
                }, 6000);
                return data.data.d;
            }
        }
        //Update status and next approver in SO Request -- End

        //=================update Master in change request start ===========
        //vm.updateWorkshopInfo = function(id, count) {
        vm.updateWorkshopDetails = function (action) {
            for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                //var rowID = $scope.rows[count].ID;
                if ($scope.workshopProposalRows[count].Title != undefined && $scope.workshopProposalRows[count].Id != undefined) {

                } else if ($scope.workshopProposalRows[count].Title == undefined && $scope.workshopProposalRows[count].Id == undefined) {
                    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalInfo + "')/items";
                    var assignedCarDriverData = {
                        'Title': 'WP-' + requestId,
                        // 'Month': $scope.workshopProposalRows[count].Month,
                        'ExpectedDate': $scope.workshopProposalRows[count].ExpectedDate,
                        'WorkshopLocation': $scope.workshopProposalRows[count].WorkshopLocation,
                        'ExpectedParticipant': $scope.workshopProposalRows[count].ExpectedParticipant,
                        'Purpose': $scope.workshopProposalRows[count].Purpose,
                        'GLCode': $scope.workshopProposalRows[count].GLCode,
                        'CostCenter': $scope.workshopProposalRows[count].CostCenter,
                        'IONumber': $scope.workshopProposalRows[count].IONumber,
                        'FoodCost': $scope.workshopProposalRows[count].FoodCost,
                        'HallOrVenueRent': $scope.workshopProposalRows[count].HallOrVenueRent,
                        'PromotionalItem': $scope.workshopProposalRows[count].PromotionalItem,
                        'TotalAmount': $scope.workshopProposalRows[count].TotalAmount,
                        'DecorationCost': $scope.workshopProposalRows[count].DecorationCost,
                        'OtherCost': $scope.workshopProposalRows[count].OtherCost,
                        'OtherGiftItems': $scope.workshopProposalRows[count].OtherGiftItems,
                        // 'BudgetedExpenditure': $scope.workshopProposalRows[count].BudgetedExpenditure,
                        '__metadata': {
                            "type": "SP.Data.WorkshopProposalInfoListItem"
                        },
                    }
                    // saveDisplayedLineItemToList(assignedCarDriverData);

                    return $http({
                        headers: {
                            "Accept": "application/json; odata=verbose",
                            "Content-Type": "application/json; odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val()
                        },
                        method: "POST",
                        url: url,
                        async: false,
                        data: assignedCarDriverData,
                    })
                        .then(successMsgWorkshopDetails)
                        .catch(function (message) {
                            $scope.insertLog(WorkshopProposalInfo, message, "Fail");
                        });

                    function successMsgWorkshopDetails(data, status, headers, config) {
                        setTimeout(function () {
                            $scope.updateRequest(action);
                        }, 2000);
                    }
                } else if ($scope.workshopProposalRows[count].Title == undefined && $scope.workshopProposalRows[count].Id != undefined) {
                    var rowID = $scope.workshopProposalRows[count].Id;
                    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalInfo + "')/items(" + rowID + ")";
                    var actualWorkshopInfo;
                    if ($scope.status == "ReimbursementSOICToUser" || $scope.status == "ReimbursementGMMarketingToUser") {
                        actualWorkshopInfo = {
                            'ActualDate': $scope.workshopProposalRows[count].ActualDate,
                            'ActualLocation': $scope.workshopProposalRows[count].ActualLocation,
                            'ActualParticipant': $scope.workshopProposalRows[count].ActualParticipant,
                            'ActualFoodCost': $scope.workshopProposalRows[count].ActualFoodCost,
                            'ActualDecorationCost': $scope.workshopProposalRows[count].ActualdecorationCost,
                            'ActualHallOrVenueRent': $scope.workshopProposalRows[count].ActualHallOrVenueRent,
                            'ActualPromotionalItem': $scope.workshopProposalRows[count].ActualPromotionalItem,
                            // 'ActualTotalAmount': $scope.workshopProposalRows[count].ActualTotalAmount,
                            'ActualDecorationCost': $scope.workshopProposalRows[count].ActualDecorationCost,
                            'ActualExpenditure': $scope.workshopProposalRows[count].ActualExpenditure,
                            'ActualOtherCost': $scope.workshopProposalRows[count].ActualOtherCost,
                            '__metadata': {
                                "type": "SP.Data.WorkshopProposalInfoListItem"
                            },
                        }
                    } else {
                        actualWorkshopInfo = {
                            'ExpectedDate': $scope.workshopProposalRows[count].ExpectedDate,
                            'WorkshopLocation': $scope.workshopProposalRows[count].WorkshopLocation,
                            'ExpectedParticipant': $scope.workshopProposalRows[count].ExpectedParticipant,
                            'Purpose': $scope.workshopProposalRows[count].Purpose,
                            'GLCode': $scope.workshopProposalRows[count].GLCode,
                            'CostCenter': $scope.workshopProposalRows[count].CostCenter,
                            'IONumber': $scope.workshopProposalRows[count].IONumber,
                            'FoodCost': $scope.workshopProposalRows[count].FoodCost,
                            'HallOrVenueRent': $scope.workshopProposalRows[count].HallOrVenueRent,
                            'PromotionalItem': $scope.workshopProposalRows[count].PromotionalItem,
                            'TotalAmount': $scope.workshopProposalRows[count].TotalAmount,
                            'DecorationCost': $scope.workshopProposalRows[count].DecorationCost,
                            'OtherCost': $scope.workshopProposalRows[count].OtherCost,
                            'OtherGiftItems': $scope.workshopProposalRows[count].OtherGiftItems,
                            // 'BudgetedExpenditure': $scope.workshopProposalRows[count].BudgetedExpenditure,
                            '__metadata': {
                                "type": "SP.Data.WorkshopProposalInfoListItem"
                            },
                        }
                    }

                    $http({
                        headers: {
                            "Accept": "application/json; odata=verbose",
                            "Content-Type": "application/json; odata=verbose",
                            "X-HTTP-Method": "MERGE",
                            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                            "Content-Length": actualWorkshopInfo.length,
                            'IF-MATCH': "*"
                        },
                        method: "POST",
                        async: false,
                        url: url,
                        data: actualWorkshopInfo
                    })
                        .then(updateRequestStatusSuccess)
                        .catch(function (message) {
                            $scope.insertLog(WorkshopProposalInfo, message, "Fail");
                        });
                    function updateRequestStatusSuccess(data, status, headers, config) {
                        //===updating Master List=====
                        //$scope.updateRequest(action);
                    }
                }
            }
        }
        //----------------------update WorkshopInfo with actual info-end------------------

        //----------------end --------------------


        //=========== saving data in Master start by MK==========
        vm.saveMarketingActivityMaster = function (action) {
            if ($scope.uniqueId == "") {
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityMaster + "')/items";
                var marketingActivityMasterData = {
                    'ProjectName': $scope.projectName,
                    'ServiceName': $scope.serviceName,
                    'ActivityName': $scope.selectedActivity,
                    'ActivityType': $scope.activityType,
                    'BudgetType': $scope.budgetType,
                    'CostHead': $scope.selectedCostHead,
                    'BrandDescription': $scope.brandDescription,
                    'CommitmentItem': $scope.commitmentItem,
                    'TotalExpectedExpense': $scope.totalExpectedExpense,
                    'ActivityStartDate': $scope.activityStartDate,
                    'ExpectedDeliveryDate': $scope.expectedDeliveryDate,
                    'ServiceReceivingDate': $scope.serviceReceivingDate,
                    'RequiredVendorQuotation': $scope.requiredVendorQuotation,
                    'SingleVendorJustification': $scope.singleVendorJustification,
                    'Status': "Submitted",

                    '__metadata': {
                        "type": "SP.Data.MarketingActivityMasterListItem"
                    },
                }
                return $http({
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "Content-Type": "application/json; odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                    method: "POST",
                    url: url,
                    async: false,
                    data: marketingActivityMasterData,
                })
                    .then(saveItems)
                    .catch(function (message) {
                        $scope.insertLog(MarketingActivityMaster, message, "Fail");
                    });

                function saveItems(data, status, headers, config) {
                    requestId = data.data.d.ID;
                    $scope.saveAllAttachments(requestId);
                    $scope.getUniqueId(requestId);
                    setTimeout(function () {
                        $scope.addAuditLog(requestId, "Submitted", $scope.actionComment);
                    }, 2000);
                }
            } else {
                $scope.updateWorkshopInfo();
                $scope.saveAllAttachments(requestId);
                $scope.getUniqueId(requestId);
                setTimeout(function () {
                    $scope.updateRequest(requestId);
                }, 2000);
            }
        }

        // ----------- saving Master end ----------------
        //----------Add Poolcarbookingstatus in a separate Poolcarbookingstatus Table and Show in DisplayCalender function -- Start	

        //----------Add Poolcarbookingstatus and Show in DisplayCalender function -- End

        //=======show-hide attachment div============
        vm.showHideAttachmentDiv = function (attachmentNo) {
            if (attachmentNo > 0) {
                $("#divAttachmentDisplayTbl").show();
                $scope.hideAttachmentDiv = "false";
            } else {
                $("#divAttachmentDisplayTbl").hide();
                $scope.hideAttachmentDiv = "true";
            }
        }
        //-------------end-------------

        //===================== Attachment Files function start here ============================
        // == Fetching attachments from SP List start ==       
        vm.getAllAttachments = function () {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityAttachment + "')/items?&$top=2000000&$select=ID,AttachmentFiles,Attachments,Created,Author/ID,Author/Title&$expand=AttachmentFiles,Author/ID&$filter=Title eq 'WP-" + requestId + "'";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                if (data.d.results.length > 0) {
                    $scope.receiptRows = data.d.results;
                    $scope.showHideAttachmentDiv(data.d.results.length);
                    $scope.showAttachmentDiv = true;

                } else {
                    $("#divAttachmentDisplayTbl").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.insertLog(MarketingActivityAttachment, message, "Fail");
            });
        }
        //  -- Fetching attachments from SP List -- End --

        vm.saveAllAttachments = function (requestId) {
            // requestId = data.data.d.ID;
            if ($("#attachFilesContainer input:file").val() != "") {
                $("#attachFilesContainer input:file").each(function () {
                    if ($(this)[0].files[0]) {
                        fileData.push($(this)[0].files[0]);
                    }
                });
                for (var start = 0; start < fileData.length; start++) {
                    (function (i) {
                        $("#wait").show();
                        setTimeout(function () {
                            AddReceiptIntial(fileData[i]);
                            if (i == (fileData.length - 1)) {
                                $("#wait").hide();

                            }
                        }, 2000);
                    })(start);
                }
            }
        }

        function AddReceiptIntial(file) {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityAttachment + "')/items";
            $http({
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                method: "POST",
                url: url,
                async: true,
                data: {
                    'MarketingActivityID': requestId,
                    '__metadata': {
                        "type": "SP.Data.MarketingActivityAttachmentListItem"
                    },
                }
            })
                .then(saveSuccess)
                .catch(function (message) {
                    $scope.insertLog(MarketingActivityAttachment, message, "Fail");
                });

            function saveSuccess(data, status, headers, config) {
                var currentItemIdAttachmentId = data.data.d.ID;
                uploadFileSP(currentItemIdAttachmentId, file.name, file, MarketingActivityAttachment);
            }
        }

        function uploadFileSP(id, fileName, file, listName) {
            var deferred = $.Deferred();
            getFileBuffer(file).then(
                function (buffer) {
                    var bytes = new Uint8Array(buffer);
                    var content = new SP.Base64EncodedByteArray();
                    var queryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + fileName + "')";
                    $.ajax({
                        url: queryUrl,
                        type: "POST",
                        processData: false,
                        async: false,
                        contentType: "application/json;odata=verbose",
                        data: buffer,
                        headers: {
                            "accept": "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                            "content-length": buffer.byteLength
                        },
                        success: onAttachmentSucess,
                        error: onAttachmentFailure
                    });
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise();
        }

        function onAttachmentSucess() {
            //alert("Successfully Saved Attachment");
        }

        function onAttachmentFailure(error) {
            alert("Attachment Failure:" + error.status + "," + error.statusText);
        }

        function getFileBuffer(file) {
            var deferred = $.Deferred();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            }
            reader.onerror = function (e) {
                deferred.reject(e.target.error);
            }
            reader.readAsArrayBuffer(file);
            return deferred.promise();
        }
        //---------- attachment function end ----------------------------------                            

        // ==== for Workshop Proposal by MK 18JUl ===========
        vm.updateRequest = function (requestId) {
            if ((uId == "" || typeof uId == undefined) && $scope.status == "") {
                updatedata = {
                    'Title': "WP-" + requestId,
                    'Status': "Submitted",
                    'PendingWithId': soicId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    },
                };
            } else if ($scope.status == "SOICtoUser") {
                updatedata = {
                    'WorkshopPurposeOrObjective': $scope.workshopProposalRows[0].Purpose,
                    //'Month': $scope.workshopProposalRows[0].Month,
                    'TotalEstimatedAmount': $scope.totalEstimatedAmount,
                    'Status': "UserToSOIC",
                    'PendingWithId': soicId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    },
                }
                $scope.saveAllAttachments($scope.requestId);
            } else if ($scope.status == "GMMarketingToUser") {
                updatedata = {
                    'WorkshopPurposeOrObjective': $scope.workshopProposalRows[0].Purpose,
                    //'Month': $scope.workshopProposalRows[0].Month,

                    'Status': "UserToGMMarketing",
                    'PendingWithId': gMMarketingId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    },
                }
            } else if ($scope.status == "ProposalApproved&ActualBillSubmissionRequest" || $scope.status == "AccountsConcernToUser" || $scope.status == "ReimbursementSOICtoUser") {
                var totalActualExpenditureToSave = '';
                if ($scope.totalActualExpenditure == '' || $scope.totalActualExpenditure == undefined) {
                    totalActualExpenditureToSave = $("#lblTotalActualExpenditure").text();
                } else {
                    totalActualExpenditureToSave = $scope.totalActualExpenditure
                }
                updatedata = {

                    'ActualDate': $scope.actualDate,
                    'ActualExpenditure': totalActualExpenditureToSave,
                    'Status': "ReimbursementSubmitted",
                    'PendingWithId': soicId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    },
                }
            } else if ($scope.status == "MarketingAccountantToUser") {
                //should implement properly 
                updatedata = {

                    'ActualDate': $scope.workshopProposalRows[0].ExpectedDate,
                    'ActualExpenditure': $scope.workshopProposalRows[0].ActualExpenditure,
                    'Status': "GMMarketingToMarketingAccountant",
                    'PendingWithId': marketingAccountantId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    }
                }
            }
            else if ($scope.status == "ReimbursementMarketingAccountanttoUser") {
                //should implement properly
                updatedata = {

                    'ActualDate': $scope.workshopProposalRows[0].ExpectedDate,
                    'ActualExpenditure': $scope.workshopProposalRows[0].ActualExpenditure,
                    'Status': "GMMarketingToMarketingAccountant",
                    'PendingWithId': marketingAccountantId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    }
                }
            }
            else if ($scope.status == "ReimbursementSOICToUser") {
                var totalActualExpenditureToSave = '';
                if ($scope.totalActualExpenditure == '' || $scope.totalActualExpenditure == undefined) {
                    totalActualExpenditureToSave = $("#lblTotalActualExpenditure").text();
                } else {
                    totalActualExpenditureToSave = $scope.totalActualExpenditure
                }
                updatedata = {

                    'ActualDate': $scope.actualDate,
                    'ActualExpenditure': totalActualExpenditureToSave,
                    'Status': "ReimbursementUserToSOIC",
                    'PendingWithId': soicId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    },
                }
            }
            else if ($scope.status == "ReimbursementGMMarketingToUser") {
                var totalActualExpenditureToSave = '';
                if ($scope.totalActualExpenditure == '' || $scope.totalActualExpenditure == undefined) {
                    totalActualExpenditureToSave = $("#lblTotalActualExpenditure").text();
                } else {
                    totalActualExpenditureToSave = $scope.totalActualExpenditure
                }
                updatedata = {
                    //'ActualDate': $scope.actualDate,
                    'ActualExpenditure': totalActualExpenditureToSave,
                    'Status': "ReimbursementUserToGMMarketing",
                    'PendingWithId': gMMarketingId,
                    '__metadata': {
                        'type': 'SP.Data.WorkshopProposalMasterListItem'
                    },
                }
            }
            else {
                vm.showMessage('red', 'Next Approver Info is not Defined.');
                return false;
            }

            $http({
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose",
                    "X-HTTP-Method": "MERGE",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "Content-Length": updatedata.length,
                    'IF-MATCH': "*"
                },
                method: "POST",
                async: false,
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalMaster + "')/items(" + requestId + ")",
                data: updatedata
            })
                .then(updateRequestSuccess)
                .catch(function (message) {
                    $scope.insertLog(WorkshopProposal, message, "Fail");
                });
            //function updateRequestSuccess() {
            function updateRequestSuccess(data, status, headers, config) {

                $scope.addAuditLog(requestId, updatedata.Status, $scope.actionComment);

                reviewLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId + "&mode=read";
                approvalLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId;
                editLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId + "&mode=e";

                if (updatedata.Status == "Submitted") {
                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [userId], [], initiator, soicName, "WP-" + requestId, $scope.status, reviewLink, "", "Workshop Proposal Workflow");
                    $scope.readNotificationListTemplate(ApproverTemplate, [soicId], [], initiator, soicName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                } else if (updatedata.Status == "ReimbursementSubmitted") {
                    $scope.readNotificationListTemplate(ApproverTemplate, [soicId], [], initiator, soicName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                } else if (updatedata.Status == "UserToSOIC") {
                    $scope.readNotificationListTemplate(ApproverTemplate, [soicId], [], initiator, soicName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                } else if (updatedata.Status == "UserToAccountsConcern") {
                    $scope.readNotificationListTemplate(ApproverTemplate, [accountsConcernId], [], initiator, accountsConcernName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                    $scope.readNotificationListTemplate(InitiatorRequesterTemplate, [marketingAccountantId], [], initiator, marketingAccountantName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                } else if (updatedata.Status == "UserToGMMarketing") {
                    $scope.readNotificationListTemplate(ApproverTemplate, [gMMarketingId], [], initiator, gMMarketingName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                } else if (updatedata.Status == "UserToMarketingAccountant") {
                    $scope.readNotificationListTemplate(ApproverTemplate, [marketingAccountantId], [], initiator, marketingAccountantName, "WP-" + requestId, $scope.status, "", approvalLink, "Workshop Proposal Workflow");
                } else {
                    vm.showMessage('red', 'E-mail notification is not defined for this unknown Workflow Status.');
                }
                vm.showMessage('green', 'Submitted Successfully !');
                setTimeout(function () {
                    $window.location.href = _spPageContextInfo.webAbsoluteUrl + submitRedirectURL;
                }, 6000);

                return data.data.d;
            }
            if (updatedata.Status != "Submitted") {
                getAndUpdateAtMyTask(updatedata.Status, updatedata.PendingWithId, "WP-" + vm.requestId, "WorkshopProposal");
            }
        }
        //Update Workshop Proposal Request ID-uniqueId-notification -- End

        vm.deleteExistingReceipts = function (action) {
            $scope.receiptRowsForDelete = [];
            $scope.receiptRowsForUpdate = [];
            //$scope.receiptRowsMaintain.push({Id:0, Status:New});
            for (var count1 = 0; count1 < $scope.receiptRowsMaintain.length; count1++) {
                if ($scope.receiptRowsMaintain[count1].Status == ReceiptFileUpdated || $scope.receiptRowsMaintain[count1].Status == Delete) {
                    $scope.receiptRowsForDelete.push({
                        Id: $scope.receiptRowsMaintain[count1].Id,
                        Status: $scope.receiptRowsMaintain[count1].Status
                    });
                    //$scope.deleteReceipt($scope.receiptRowsMaintain[count].Id);
                } else if ($scope.receiptRowsMaintain[count1].Status == ReceiptUpdated) {
                    $scope.receiptRowsForUpdate.push({
                        Id: $scope.receiptRowsMaintain[count1].Id,
                        Status: $scope.receiptRowsMaintain[count1].Status
                    });
                    //$scope.updateReceipt($scope.receiptRowsMaintain[count].Id, count);
                }
            }
            for (var count2 = 0; count2 < $scope.receiptRowsForDelete.length; count2++) {
                deleteReceiptFunc($scope.receiptRowsForDelete[count2].Id);
            }
            for (var count3 = 0; count3 < $scope.receiptRowsForUpdate.length; count3++) {
                for (var count4 = 0; count4 < $scope.receiptRows.length; count4++) {
                    if ($scope.receiptRowsForUpdate[count3].Id == $scope.receiptRows[count4].Id)
                        updateReceiptFunc($scope.receiptRowsForUpdate[count3].Id, $scope.receiptRows[count4]);
                }
            }
        }
        //Delete all existing receipts for a request -- End

        //=====================update WorkshopInfo with actual info=start==================   
        vm.updateWorkshopInfo = function () {
            for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                var requestId = $scope.workshopProposalRows[count].Id;
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalInfo + "')/items(" + requestId + ")";
                var actualWorkshopInfo = {
                    'ActualDate': $scope.workshopProposalRows[count].ActualDate,
                    'ActualLocation': $scope.workshopProposalRows[count].ActualLocation,
                    'ActualParticipant': $scope.workshopProposalRows[count].ActualParticipant,
                    'ActualFoodCost': $scope.workshopProposalRows[count].ActualFoodCost,
                    'ActualDecorationCost': $scope.workshopProposalRows[count].ActualdecorationCost,
                    'ActualHallOrVenueRent': $scope.workshopProposalRows[count].ActualHallOrVenueRent,
                    'ActualPromotionalItem': $scope.workshopProposalRows[count].ActualPromotionalItem,
                    // 'ActualTotalAmount': $scope.workshopProposalRows[count].ActualTotalAmount,
                    'ActualDecorationCost': $scope.workshopProposalRows[count].ActualDecorationCost,
                    'ActualExpenditure': $scope.workshopProposalRows[count].ActualExpenditure,
                    'ActualOtherCost': $scope.workshopProposalRows[count].ActualOtherCost,
                    '__metadata': {
                        "type": "SP.Data.WorkshopProposalInfoListItem"
                    },
                }
                $http({
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "Content-Type": "application/json; odata=verbose",
                        "X-HTTP-Method": "MERGE",
                        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                        "Content-Length": actualWorkshopInfo.length,
                        'IF-MATCH': "*"
                    },
                    method: "POST",
                    async: false,
                    url: url,
                    data: actualWorkshopInfo
                })
                    .then(updateRequestStatusSuccess)
                    .catch(function (message) {
                        $scope.insertLog(WorkshopProposalInfo, message, "Fail");
                    });
                function updateRequestStatusSuccess(data, status, headers, config) {
                    //alert("Updated one line item with actual info successfully");
                }
            }
        }
        //----------------------update WorkshopInfo with actual info-end------------------

        //=====================update GL code, Costcenter, IO no. info=start================== 
        vm.updateGlCcIoInfo = function () {
            for (var count = 0; count < $scope.workshopProposalRows.length; count++) {
                var requestId = $scope.workshopProposalRows[count].Id;
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalInfo + "')/items(" + requestId + ")";
                var actualWorkshopInfo = {
                    'Purpose': $scope.workshopProposalRows[count].Purpose.option,
                    'GLCode': $scope.workshopProposalRows[count].Purpose.value,
                    // 'CostCenter': $scope.workshopProposalRows[count].CostCenter,
                    'IONumber': $scope.workshopProposalRows[count].IONumber,
                    '__metadata': {
                        "type": "SP.Data.WorkshopProposalInfoListItem"
                    },
                }
                $http({
                    headers: {
                        "Accept": "application/json; odata=verbose",
                        "Content-Type": "application/json; odata=verbose",
                        "X-HTTP-Method": "MERGE",
                        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                        "Content-Length": actualWorkshopInfo.length,
                        'IF-MATCH': "*"
                    },
                    method: "POST",
                    async: false,
                    url: url,
                    data: actualWorkshopInfo
                })
                    .then(updateRequestStatusSuccess)
                    .catch(function (message) {
                        $scope.insertLog(WorkshopProposalInfo, message, "Fail");
                    });

                function updateRequestStatusSuccess(data, status, headers, config) {
                    vm.showMessage('green', 'Updated successfully with provided information !');
                    /* setTimeout(function() {
                         $window.parent.location.href = varSiteUrl + approveRedirectURL;
                         $('#wait').hide();
                     }, 3000); */
                }
            }

        }
        //----------------------update GL code, Costcenter, IO no. info-end------------------

        //Get uniqueId -- Start //== also used in Workshop by MK====
        vm.getUniqueId = function () {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityMaster + "')/items?&$top=2000000&$select=GUID&$filter=ID eq '" + requestId + "'";
            //var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + WorkshopProposalMaster + "')/items?&$top=2000000&$select=uniqueId&$filter=ID eq '" + requestId + "'";
            $http({
                method: "GET",
                url: url,
                async: false,
                headers: {
                    "accept": "application/json;odata=verbose"
                }
            }).success(function (data, status, headers, config) {
                vm.uniqueId = data.d.results[0].GUID;
                $scope.uniqueID = data.d.results[0].GUID;
                var generatedLink = _spPageContextInfo.webAbsoluteUrl + MarketingActivityURL + "?UniqueId=" + vm.uniqueId;

                saveAtMyTask(`MA-${requestId}`, "MarketingActivity", initiator, "Submitted", employeeId, empEmail, nextApprover, generatedLink);
                console.log("This is the reqid:  " + requestId)
            }).error(function (data, status, headers, config) {
                $scope.insertLog(MarketingActivityMaster + "7", "Error", "Fail");
            });
        }
        //Get uniqueId -- End

        //Add Audit Log function -- Start
        vm.addAuditLog = function (requestId, status, comment) {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + MarketingActivityLog + "')/items";
            $scope.addAuditLogFlag = true;
            return $http({
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                method: "POST",
                url: url,
                async: false,
                data: {
                    'MarketingActivityID': requestId,
                    'Status': status,
                    'Comment': comment,
                    '__metadata': {
                        "type": "SP.Data.MarketingActivityLogListItem"
                    },
                }
            })
                .then(auditLogAdded)
                .catch(function (message) {
                    $scope.insertLog(MarketingActivityLog, message, "Fail");
                    alert("Unable to add in MarketingActivityLog.");
                });
            function auditLogAdded(data, status, headers, config) {
                //alert("WorkshopProposalAuditLog added Successfully!");
                return data.data.d;
            }
        }
        //Add Audit Log function -- End

        //Create GUID Function -- Start
        vm.generateGuid = function () {
            var result, i, j;
            result = '';
            for (j = 0; j < 32; j++) {
                if (j == 8 || j == 12 || j == 16 || j == 20)
                    result = result + '-';
                i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
                result = result + i;
            }
            return result;
        }
        //Create GUID Function -- End

        //Insert log function -- Start
        vm.insertLog = function (listName, stackTrace, logType) {
            if (logType == "Fail") {
                //Guid generation
                guidNo = $scope.generateGuid();
                insertMessage = listName + ": An error occured";
                message = JSON.stringify(stackTrace); //stackTrace.data.error.message.value;
                if (message.indexOf("security validation") >= 0) {
                    vm.showMessage('red', guidNo + ": Session timeout occured. Please refresh the page and try again.");
                } else {
                    vm.showMessage('red', guidNo + ": An error occured. Please contact system admin.");
                }
            } else {
                guidNo = "";
                insertMessage = stackTrace;
                message = stackTrace;
            }
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('BergerPaintsLog')/items";
            return $http({
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                method: "POST",
                url: url,
                async: false,
                data: {
                    Title: "",
                    GUIDNo: guidNo,
                    Message: insertMessage,
                    StackTrace: message,
                    LogType: logType,
                    '__metadata': {
                        "type": "SP.Data.BergerPaintsLogListItem"
                    },
                }
            })
                .then(logAdded)
                .catch(function (message) {
                    console.log("insertLog() error: " + message);
                });
            function logAdded(data, status, headers, config) {
                //alert("Log Added Successfully");
                return data.data.d;
            }
        }
        //Insert log function -- End

        //Function readNotificationListTemplate --- Start//
        vm.readNotificationListTemplate = function (template, toList, ccList, initiator, approver, requestId, requestStatus, reviewLink, approvalLink, wfName) {
            var varUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + notificationTemplateList + "')/items?&$top=2000000&$select=Title,Body,BottomBodyText&$filter=ID eq '" + template + "'";
            $http(
                {
                    method: "GET",
                    url: varUrl,
                    async: false,
                    headers: { "accept": "application/json;odata=verbose" }
                }
            ).success(function (data, status, headers, config) {
                if (data.d.results.length > 0) {
                    var varSubject = data.d.results[0].Title;
                    var varBody = data.d.results[0].Body;
                    var varBodyBottomText = data.d.results[0].BottomBodyText;

                    if (varSubject.indexOf("[Workflow]") > -1)
                        varSubject = varSubject.replace(/\[Workflow\]/g, wfName);
                    if (varSubject.indexOf("[RequestId]") > -1)
                        varSubject = varSubject.replace(/\[RequestId\]/g, requestId);

                    if (varBody.indexOf("[Workflow]") > -1)
                        varBody = varBody.replace(/\[Workflow\]/g, wfName);
                    if (varBody.indexOf("[RequestId]") > -1)
                        varBody = varBody.replace(/\[RequestId\]/g, requestId);
                    if (varBody.indexOf("[Initiator]") > -1)
                        varBody = varBody.replace(/\[Initiator\]/g, initiator);
                    if (varBody.indexOf("[Approver]") > -1)
                        varBody = varBody.replace(/\[Approver\]/g, approver);
                    if (varBody.indexOf("[ApprovalStatus]") > -1)
                        varBody = varBody.replace(/\[ApprovalStatus\]/g, requestStatus);
                    //alert(varBody);

                    if (template != ApproverTemplate && template != ChangeRequestTemplate) {
                        approvalLink = "";
                    }

                    $scope.createNotificationItem(varSubject, varBody, toList, ccList, reviewLink, approvalLink, varBodyBottomText);
                }
            }).error(function (data, status, headers, config) {
                $scope.insertLog("ReadNotificatinList", "Error", "Fail");
            });
        }
        //Function readNotificationListTemplate --- End//

        //Create Notification Item --- Start//
        vm.createNotificationItem = function (subject, body, toList, ccList, reviewLink, approvalLink, varBodyBottomText) {
            var varUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('" + notificationList + "')/items";
            var varData =
            {
                __metadata: { "type": "SP.Data.NotificationListListItem" },
                Title: subject,
                Body: body,
                ToId: { results: toList },//jsonResponse.Designation[0].value//
                CCId: { results: ccList },//jsonResponse.Designation[1].value//
                ReviewLink: reviewLink,
                ApprovalLink: approvalLink,
                BodyBottomText: varBodyBottomText,
                Status: "Started"
            }
            return $http({
                headers: { "Accept": "application/json; odata=verbose", "Content-Type": "application/json; odata=verbose", "X-RequestDigest": $("#__REQUESTDIGEST").val() },
                method: "POST",
                url: varUrl,
                async: false,
                data: varData
            })
                .then(logAdded)
                .catch(function (message) {
                    $scope.insertLog(notificationList, message, "Fail");
                });
            function logAdded(data, status, headers, config) {
                //alert("Notification Added Successfully");
                return data.data.d;
            }
        }
        //Create Notification Item --- End//

        //Function for Print -- Start
        vm.printToCart = function (printSectionId) {
            var innerContents = document.getElementById(printSectionId).innerHTML;
            var popupWinindow = window.open('', '_blank', 'width=850,height=700,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../SiteAssets/MasterPage/bootstrap/css/bootstrap.css" /><link rel="stylesheet" type="text/css" href="../../Style Library/CSS/Print.css" /></head><body onload="window.print()">' + innerContents + '</html>');
            popupWinindow.document.close();
        }
        //Function for Print -- End
    })
    //Save Request Data in List -- End

    .controller("editItemsController", function ($scope, $http) {
        var vm = $scope;
        vm.editContact = function () {
            var data = {
                '__metadata': {
                    'type': 'SP.Data.ContactsListItem'
                },
                'Title': vm.lastName,
                'FirstName': vm.firstName
            };
            return $http({
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Content-Type": "application/json; odata=verbose",
                    "X-HTTP-Method": "MERGE",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "Content-Length": data.length,
                    'IF-MATCH': "*"
                },
                method: "POST",
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Contacts')/items(" + vm.itemId + ")",
                data: data
            })
                .then(saveContact)
                .catch(function (message) {
                    console.log("editContact() error: " + message);
                });
            function saveContact(data, status, headers, config) {
                //alert("Item Edited Successfully");
                return data.data.d;
            }
        }
    })

    //Directive for datePicker -- Start
    .directive("datepicker", function () {
        function link(scope, element, attrs) {
            // CALL THE "datepicker()" METHOD USING THE "element" OBJECT.
            element.datepicker({
                dateFormat: "M dd,yy"
            });
        }
        return {
            require: 'ngModel',
            link: link
        };
    })
    //Directive for datePicker -- End

    //Browse file directive -- Start
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    //Browse file directive -- End

    //Directive for numeric validation -- Start
    .directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
    //Directive for numeric validation -- End

    //Directive for numeric and decimal values -- Start
    .directive('validNumber', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }

                    var clean = val.replace(/[^-0-9\.]/g, '');
                    var negativeCheck = clean.split('-');
                    var decimalCheck = clean.split('.');
                    if (!angular.isUndefined(negativeCheck[1])) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }
                    }

                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    })
    //Directive for numeric and decimal values -- End

    .controller("delItemsController", function ($scope, $http) {
        var vm = $scope;
        vm.delContact = function () {
            return $http({
                headers: {
                    "X-HTTP-Method": "DELETE",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    'IF-MATCH': "*"
                },
                method: "POST",
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Contacts')/items(" + vm.itemId + ")"
            })
                .then(saveContact)
                .catch(function (message) {
                    console.log("delContact() error: " + message);
                });

            function saveContact(data, status, headers, config) {
                //alert("Item Deleted Successfully");
                return data.data.d;
            }
        }
    });


function onAttachmentSucess() {
    //alert("Successfully Saved Attachment");
}

function getFileBuffer(file) {
    var deferred = $.Deferred();
    var reader = new FileReader();
    reader.onload = function (e) {
        deferred.resolve(e.target.result);
    }
    reader.onerror = function (e) {
        deferred.reject(e.target.error);
    }
    reader.readAsArrayBuffer(file);
    return deferred.promise();
}
//Attach file to SO Request -- End

//Progress bar --- start
$(document).ajaxStart(function () {
    $('#wait').show();
});
$(document).ajaxStop(function () {
    $('#wait').hide();
});
$(document).ajaxError(function () {
    $('#wait').hide();
});
//Progress bar --- end

//Insert log function -- Start
function insertLog(listName, stackTrace, logType) {
    if (logType == "Fail") {
        //Guid generation
        guidNo = generateGuid();
        insertMessage = listName + ": An error occured";
        message = stackTrace;
        showMessage('red', guidNo + ": An error occured");
    } else {
        guidNo = "";
        insertMessage = stackTrace;
        message = stackTrace;
    }

    var postData = {
        Title: "",
        GUIDNo: guidNo,
        Message: insertMessage,
        StackTrace: message,
        LogType: logType,
        '__metadata': {
            "type": "SP.Data.BergerPaintsLogListItem"
        }
    };

    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('BergerPaintsLog')/items";
    $.ajax({
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        method: "POST",
        url: url,
        async: false,
        data: JSON.stringify(postData),
        success: function (json) {
            //console.log("Error Logged");
        },
        error: function (json) {
            console.log("Log error");
        }
    });
}
//Insert log function -- End

//Generate GUID -- Start
function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}
//Generate GUID -- End

function showMessage(txtColor, msg) {
    $("#divErrorPanel").show();
    //$scope.bold = 'bold';
    $("#status").val(msg);
}

//X-request digest value refresh -- Start
function refreshFormDigestValue() {
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            $('#__REQUESTDIGEST').val(data.d.GetContextWebInformation.FormDigestValue)
        },
        error: function (data, errorCode, errorMessage) {
            alert(errorMessage)
        }
    });
}
//X-request digest value refresh -- End