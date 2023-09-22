//Constants -- Start
$("#header6").hide();
var setTimeoutLimit = 5000;
var submitMessage = "Submit operation completed successfully";
var approveMessage = "Approve operation completed successfully";
var rejectMessage = "Request has been rejected successfully";
var saveMessage = "Save operation completed successfully";
var submitRedirectURL = "/SitePages/MyWFRequest.aspx";
//var approveRedirectURL = "/SitePages/Process.aspx";
var approveRedirectURL = "/leaveauto/SitePages/pendingtasks.aspx";
//var approveRedirectURL = "/_layouts/15/PendingApproval/PendingApproval.aspx";
var reassignTaskPageURL = "/SitePages/ReassignTask.aspx";
var TRRequestPageURL = "/SitePages/TravelRequest.aspx";
var disposableGoodsDisplayFormURL = "/SitePages/disposableGoodsDisplayForm.aspx";
var damagedGoodsDashboardURL = "/SitePages/DamagedGoodsDashboard.aspx";
var mobileHandSetRequestURL = "/SitePages/MobileHandsetRequests.aspx";
var employeeAdvanceRequestURL = "/SitePages/EmployeeAdvanceRequest.aspx";
var freeFGRequestURL = "/SitePages/freeFGIssue.aspx";
var vendorComplaintRequestPageURL = "/SitePages/VendorComplaint.aspx";
var EmpReimbursePageURL = "/SitePages/EmployeeReimbursement.aspx";
var FundRequestFromFieldPageURL = "/SitePages/FundRequestFromField.aspx"; /*PageURL FundRequestFromField*/
var BOECheckPaymentProcessPageURL = "/SitePages/BOECheckPaymentProcess.aspx"; /*PageURL BOECheckPaymentProcess*/
var AssetDisposalProcessPageURL = "/SitePages/AssetDisposalProcess.aspx"; /*PageURL BOECheckPaymentProcess*/
var searchBillOfLadingPageURL = "/SitePages/SearchBillOfLading.aspx"; /*PageURL for BOE Bill Of Lading Search*/
var ProvisionForExpensesPageURL = "/SitePages/ProvisionForExpenses.aspx"; /*PageURL ProvisionForExpenses*/
var FixedAssetAcquisitionPageURL = "/SitePages/FixedAssetAcquisition.aspx"; /*PageURL FixedAssetAcquisition*/
var searchBillOfLadingPageURL = "/SitePages/SearchBillOfLading.aspx";
var ManpowerRequisitionPageURL = "/SitePages/ManpowerRequisition.aspx"; /*PageURL ManpowerRequisition*/
var FBPTrackerProcessPageURL = "/SitePages/FBPTrackerProcess.aspx"; /*PageURL FBPTrackerProcess*/
var AssetPurchaseRequestPageURL = "/SitePages/AssetPurchaseRequest.aspx"; /*PageURL AssetPurchaseRequest*/
var logmessage = "";
var BlockStockGoods = "1";
var SlowNonMovingGood = "2";
var Chittagong = "2";
var Dhaka = "1";
var ROH = 4;
var VERP = 3;
var HALB = 2;
var FERT = 1;
var existingProduct = "2";
var newProduct = "3";
var BulkMaterialUploadExcelDocLib = "BulkMaterialUploadExcel";
var readyForDisposal = "Disposal";
var readyForReprocessing = "Reprocessing";
var recanning = "Recanning";
var unrestricted = "Unrestricted";
var replacement = "Replacement";
var returnToVendor = "Return to Vendor";
var InitiatorRequesterTemplate = 1;
var ApproverTemplate = 2;
var ApprovalRejectionTemplate = 3;
var TravelAgentTemplate = 4;
var ChangeRequestTemplate = 5;
var ReimbursementTemplate = 6;
var AdjustmentTemplate = 7;
var CompletedAsTravelTemplate = 8;
var PickedTempate = 9;
var QueryTemplate = 10;
var AssignmentTemplate = 11;
var StatusTemplate = 12;
var OnbehalfInitiateTemplate = 13;
var OnbehalfProcessTemplate = 14;
var workFlowName = "Block Stock Management";
var dashboardPageURL = "/SitePages/Home.aspx";
var blockStockRequestPageURL = "/SitePages/BlockStockRequest.aspx";
var searchPageURL = "/SitePages/search.aspx";
var searchMaterialPageURL = "/SitePages/SearchMaterial.aspx";
var requestPrefix = "BS-";
var specialOrderRequestList = "SpecialOrderRequest";
var specialOrderMaterialsList = "SpecialOrderMaterials";
var divisionTypeList = "DivisionType";
var productRequestTypeList = "ProductRequestType";
var blockStockRequestTypeList = "BlockStockRequestType";
var soAuditLogList = "SpecialOrderAuditLog";
var travelRequestsList = "TravelRequests";
var ChangeManagementPageURL = "/SitePages/ChangeManagement.aspx";
var RnDServiceRequestPageURL = "/SitePages/RnDService.aspx";
var currencyCodeList = "CurrencyCode";
var travelRequestAuditLogList = "TravelRequestAuditLog";
var TravelRequestReimbursementReceiptList = "TravelRequestReimbursementReceipt";
var travelDestinationList = "TravelDestination";
var travelModeList = "TravelMode";
var TravelPolicyList = "TravelPolicy";
var TravelAgent = "TravelAgent";
var countriesAndCitiesList = "Country";
var TravelExpenseTypeList = "TravelExpenseType";
var TravelingActivityList = "TravelingActivity";
var TravelPurposeList = "TravelPurpose";
var tourType = "TourType";
var CountriesList = "CountriesListNew";
var SelectCountry = 1;
var Bangladesh = 8;
var DhakaCity = 5894;
var Local = 2;
var Select = 1;
var Air = 2;
var auditLogList = "AuditLog";
var auditLogListDamagedGoods = "DamagedGoodsAuditLog";
var movingTypeList = "MovingType";
var materialTypeList = "MaterialType";
var materialMasterDataList = "MaterialMaster";
var errorSuccessLogList = "BergerPaintsLog";
var blockStockItemList = "BlockStockItem";
var blockStockItemTypeList = "BlockStockItemType";
var factoryLocationList = "FactoryLocation";
var materialGroupList = "MaterialGroup";
var materialBrandMasterList = "MaterialBrandMaster";
var brandManagerMasterList = "BrandManagerMaster";
var notificationList = "NotificationList";
var notificationTemplateList = "NotificationListTemplate";
var productionUnitList = "ProductionUnit";
var qcApproverList = "QCApproverList";
var poApproverList = "POApproverList";
var workflowAprroverInforList = "Approver%20Info";
var sapResponseCodeList = "SAPResponseCode";
var taskDelegationList = "Task%20Delegation";
var bergerEmployeeInformationList = "BergerEmployeeInformation";
var blockStockStatusArray = ["Submitted", "WHApproved", "PMApproved", "RMApproved", "QCApproved", "GMRNDApproved", "FWDIApproved", "STPOEntered", "QCREPApproved", "GMRNDREPApproved", "QCSAPFRMLApproved", "VATApproved", "SNPApproved", "INCNRTRApproved", "PNPApproved", "HDPNPApproved", "CSDApproved", "MGRCNIMApproved", "GMSCApproved", "DRFCFOApproved", "DRApproved"];
var postSubmitBlockStockStatus = ["WHApproved", "PMApproved", "RMApproved", "QCApproved", "GMRNDApproved", "VATApproved"];
var slowNonMovingStatusArray = ["Submitted", "CSDApproved", "BRMgrApproved", "GMMRKTApproved", "SRGMSMApproved", "DRFCFOApproved", "DRApproved", "FWDIApproved", "STPOEntered", "QCREPApproved", "GMRNDREPApproved", "QCSAPFRMLApproved"];
var postSRGMApprovalStatusArray = ["SRGMSMApproved", "DRFCFOApproved", "DRApproved", "STPOEntered"];
var reprocessingStatus = ["FWDIApproved", "QCREPApproved", "GMRNDREPApproved", "QCSAPFRMLApproved", "Completed"];
var postGMRNDApprovalDamagedGoods = ["GMRNDApproved", "VATApproved", "SNPApproved", "INCNRTRApproved", "PNPApproved", "HDPNPApproved", "CSDApproved", "MGRCNIMApproved", "GMSCApproved", "DRFCFOApproved", "DRApproved"];
var postVATApprovalDamagedGoods = ["VATApproved", "INCNRTRApproved", "PNPApproved", "HDPNPApproved"];
var postINCNRTRApprovalDamagedGoods = ["INCNRTRApproved", "PNPApproved", "HDPNPApproved"];
var postDisposalMethodDecesionStatus = ["CSDApproved", "HDPNPApproved", "MGRCNIMApproved", "GMSCApproved", "DRFCFOApproved", "DRApproved"];
var nonQCRNDSAPReasonCode = ["903", "906", "907", "908", "909", "912", "913"];
var notClaimedSAPReasonCode = ["902", "904", "907", "909", "911", "913", "915"];

var mobileHandsetMasterList = "MobileHandsetMaster";
var mobileHandsetRequestsList = "MobileHandsetRequests";
var mobileHandsetRequestAuditLogList = "MobileHandsetRequestAuditLog";
var ReimbursmentMapperList = "ReimbursmentMapper";
var MobileHandsetRequestReimbursementReceiptList = "MobileHandsetRequestReimbursementReceipt";
var mobileItemName = "Mobile Phone Handset";

var workshopList = "workshopProposal";
var eventList = "EventProposal";
var travelList = "TravelRequests";
var employeeAdvanceRequestsList = "EmployeeAdvanceRequests";
var employeeAdvanceRequestAuditLogList = "EmployeeAdvanceRequestAuditLog";
var advanceExpenseApprovalList = "AdvanceToEmployeeApprovers";
var advaceAdjustmentReceiptsList = "AdvaceAdjustmentReceipts";

var customerInfoList = "CustomerInfo";
var FreeFGMaterialDetailsList = "FreeFGMaterialDetails";
var FreeFGRequestsList = "FreeFGRequests";
var FreeFGRequestAuditLogList = "FreeFGRequestAuditLog";
var MaterialCategoryMatrixList = "MaterialCategoryMatrix";
var BOMReceiptsList = "BOMReceipts";

var ITServiceRequestTypeList = "ITServiceRequestType";
var SAPModuleMemberList = "SAPModuleMember";
var ITServiceRequestsList = "ITServiceRequests";
var ITServiceRequestAuditLogList = "ITServiceRequestAuditLog";
var ITServiceRequestPageURL = "/SitePages/ITServiceRequest.aspx";
var SAPModuleList = "SAPModule";
var ITServiceRequestAttachmentList = "ITServiceRequestAttachment";
var ITServiceRequestTimeLogList = "ITServiceRequestTimeLog";

var SystemItems = "SystemItems";
var ChangeDetailAuditLogList = "ChangeDetailAuditLogList";
var ChangeItems = "ChangeItems";
var ChangeManagementAttachments = "ChangeManagementAttachments";
var ChangeManagementPageURL = "/SitePages/ChangeManagement.aspx";


var SecurityIncidence = "SecurityIncidence";
var SecurityIncidencePageURL = "/SitePages/SecurityIncidence.aspx";
var SecurityIncidenceAuditLog = "SecurityIncidenceAuditLog";
var SecurityIncidenceAttachments = "SecurityIncidenceAttachments";
var SecurityIncidenceAssignedPeople = "SecurityIncidenceAssignedPeople";

var RnDServiceRequestTypeList = "RNDServiceList";
var RnDServiceRequestsList = "RnDService";
var RnDServiceRequestAuditLogList = "RnDServiceRequestAuditLog";
var RnDServiceRequestAttachmentList = "RnDServiceRequestAttachment";
var RNDServiceApproverList = "RNDServiceMatrix";
var RNDServicePageURL = "/SitePages/RnDServiceRequests.aspx";

var VendorInfoList = "VendorMaster";
var VendorComplainList = "VendorComplain";
var VendorMetarialDetailsList = "VendorMetarialDetails";
var VendorComplaintAuditLogList = "VendorComplaintAuditLog";
var searchVendorPageURL = "/SitePages/SearchVendor.aspx";
var VendorComplaintReceiptsList = "VendorComplaintReceipts";

var HRServicesList = "HRServices";
var HRServiceAttachment = "HRServiceAttachments";
var HRServiceAuditLog = "HRServicesAuditLog";
var HRServicePageURL = "/SitePages/HRServices.aspx";
var HREmployeeIdCardDetails = "EmployeeIdCardDetails";
var HRIDCardAdministrative = "IDAdminidtrative";
var HRStationaryInfo = "StationaryInfo";
var HRPersonalInfo = "PersonalInfo";
var HRVisaWithFamily = "VisaWithFamily";

var CRDISPageURL = "/SitePages/creditDiscountApproval.aspx";
var CRDDISList = "CreditDiscountApprovalMain";
var CreditDiscountApprovalMainList = "CreditDiscountApprovalMain";
var creditDiscountRequestPageURL = "/SitePages/CreditDiscountApproval.aspx";

var TrainingItems = "TrainingItems";
var TrainingDetailList = "TrainingDetail";
var EmpTrainingList = "EmpTraining";

var ReimbursmentMapperList = "ReimbursmentMapper";
var ReimburseMasterList = "ReimburseMaster";
var ReimburseDetailsList = "ReimburseDetails";
var ReimburseAttachmentaList = "ReimburseAttachment";
var ReimburseAuditLogList = "ReimburseAuditLog";
var EmpCompanyCarList = "EmpCompanyCar";
var ReimbursmentHistoryList = "ReimbursmentHistory";

var PoolcarbookingstatusList = "Poolcarbookingstatus";
var PoolCarRequisitionAuditLog = "PoolCarRequisitionAuditLog";
var PoolCarRequisitionInfo = "PoolCarRequisitionInfo";
var PoolCarRequisitionPageURL = "/SitePages/PoolCarRequisition.aspx";

var EmployeeOffBoardMainList = "EmployeeOffBoardMain";
var EmpOffBoardPageURL = "/SitePages/EmployeeOffBoardingProcess.aspx";

var WorkshopProposalMaster = "WorkshopProposalMaster";
var WorkshopProposalInfo = "WorkshopProposalInfo";
var WorkshopProposalAuditLog = "WorkshopProposalAuditLog";
var WorkshopProposalMasterURL = "/SitePages/WorkshopProposalMaster.aspx";
var WorkshopProposalURL = "/SitePages/WorkshopProposal.aspx";
var WorkshopProposalAttachments = "WorkshopProposalAttachments";
var WorkshopPurposeGlCode = "WorkshopPurposeGlCode";


var MarketingActivityMaster = "MarketingActivityMaster";
var MarketingActivityLog = "MarketingActivityLog";
var MarketingActivityAttachment = "MarketingActivityAttachment";
var MarketingActivityMasterURL = "/SitePages/MarketingActivity.aspx";
var MarketingActivityURL = "/SitePages/MarketingActivity.aspx";


var ProvisionForExpensesInfoList = "ProvisionForExpensesInfoList";
var ProvisionForExpensesDetailList = "ProvisionForExpensesDetailList";
var ProvisionForExpensesAuditLogList = "ProvisionForExpensesAuditLogList";
var ProvisionForExpensesAccountsInfoList = "ProvisionForExpensesAccountsInfoList";
var ProvisionForExpensesAttachmentList = "ProvisionForExpensesAttachmentList";

var SupplementaryBudgetRequestApprovers = "SupplementaryBudgetRequestApprovers";
var SupplementaryBudgetRequest = "SupplementaryBudgetRequest";
var SupBudgetRequestDetails = "SupBudgetRequestDetails";
var BergerCostCenterMaster = "BergerCostCenterMaster";    // for geting autocomplete sugestion
var SupBudgetRequestAuditLog = "SupBudgetRequestAuditLog";
var SupBudgetRequestAttachments = "SupBudgetRequestAttachments";
var SupplementaryBudgetRequestURL = "/SitePages/SupplementaryBudgetRequest.aspx";
var GLMaster = "GLMaster";
var GLMasterURL = "/SitePages/GLMaster.aspx";
var SearchGLURL = "/SitePages/SearchGL.aspx";
var SearchMaterialSupplementaryBudgetURL = "/SitePages/SearchMaterialSupplementaryBudget.aspx";
var SupBudgetRequestApproversAttachments = "SupBudgetRequestApproversAttachments";

var FundRequestFromFieldInfoList = "FundRequestFromFieldInfoList";
var FundRequestFromFieldAuditLogList = "FundRequestFromFieldAuditLogList";
var FundRequestFromFieldDetailList = "FundRequestFromFieldDetailList";
var FundRequestAccountsInfoList = "FundRequestAccountsInfoList";
var GLMaster = "GLMaster";
var GLMasterURL = "/SitePages/GLMaster.aspx";
var SearchGLURL = "/SitePages/SearchGL.aspx";
var FundRequestFromFieldAttachmentList = "FundRequestFromFieldAttachment";

var FixedAssetAcquisitionInfoList = "FixedAssetAcquisitionInfo";
var FixedAssetAcquisitionDetailList = "FixedAssetAcquisitionDetail";
var FixedAssetAcquisitionAuditLogList = "FixedAssetAcquisitionAuditLog";
var FixedAssetInfoList = "FixedAssetInfo";

var BOECheckPaymentProcessInfoList = "BOECheckPaymentProcessInfo";
var BOECheckPaymentProcessDetailList = "BOECheckPaymentProcessDetail";
var BOECheckPaymentDetailAttachmentList = "BOECheckPaymentDetailAttachment";
var BOECheckPaymentProcessAuditLogList = "BOECheckPaymentProcessAuditLog";
var BOEBillOfLadingList = "BOEBillOfLading";
var searchCnFPageURL = "/SitePages/SearchCnF.aspx";
var CnFAgentInfoList = "CnFAgentInfo";


var AssetDisposalInfoList = "AssetDisposalInfo";
var AssetDisposalDetailsList = "AssetDisposalDetails";
var AssetDisposalAuditLogList = "AssetDisposalAuditLog";
var AssetDisposalAttachmentList = "AssetDisposalAttachment";

var EmployeePaintDiscountMaterialDetailsList = "EmployeePaintDiscountMaterialDetails";
var EmployeePaintDiscountRequestsList = "EmployeePaintDiscountRequests";
var EmployeePaintDiscountRequestAuditLogList = "EmployeePaintDiscountRequestAuditLog";
var SearchMaterialForEmpPaintDiscountPageURL = "/SitePages/SearchMaterialForEmpPaintDiscount.aspx";
var EmployeePaintDiscountRequestURL = "/SitePages/EmployeePaintDiscount.aspx";
var EmpPaintDiscountRequest = "EmpPaintDiscountRequest";

var AuctionBiddingMaterials = "AuctionBiddingMaterials";
var AuctionProposalMaster = "AuctionProposalMaster";
var AuctionProposalDetails = "AuctionProposalDetails";
var AuctionProposalURL = "/SitePages/AuctionProposal.aspx";

var ManpowerRequisitionInfoList = "ManpowerRequisitionInfo";
var ManpowerRequisitionDetailList = "ManpowerRequisitionDetail";
var ManpowerRequisitionAuditLogList = "ManpowerRequisitionAuditLog";

var SupplementaryBudgetExpense = "SupplementaryBudgetExpense";
var SupBudgetExpenseDetails = "SupBudgetExpenseDetails";
var SupBudgetExpenseAttachments = "SupBudgetExpenseAttachments";
var SupBudgetExpenseAuditLog = "SupBudgetExpenseAuditLog";
var SupplementaryBudgetExpenseURL = "/SitePages/SupplementaryBudgetExpense.aspx";
var CommitmentItemsOfSupBudgetExpense = "CommitmentItemsOfSupBudgetExpense";

var FBPTrackerInfoList = "FBPTrackerInfo";
var FBPTrackerDetailsList = "FBPTrackerDetails";
var FBPTrackerAuditLogList = "FBPTrackerAuditLog";
var FBPTrackerDetailsAttachmentList = "FBPTrackerDetailsAttachment";
var FBPAreaList = "FBPArea";
var FBPFunctionList = "FBPFunction";
var FBPObjectiveTypeList = "FBPObjectiveType";
var FBPLocationList = "FBPLocation";
var FBPKPIList = "FBPKPI";
var FBPTransactionTypeLOneList = "FBPTransactionTypeLOne";
var FBPTransactionTypeLTwoList = "FBPTransactionTypeLTwo";
var FBPProductMaterialHierarchyList = "FBPProductMaterialHierarchy";
var FBPAnalysisTypeList = "FBPAnalysisType";
var FBPActivityLOneList = "FBPActivityLOne";
var FBPActivityLTwoList = "FBPActivityLTwo";
var FBPPartnerObjectiveList = "FBPPartnerObjective";

var FBPKPIAreasList = "FBPKPIAreas";
var FBPKPIAreaTransactionTypeList = "FBPKPIAreaTransactionType";
var FBPKPIObjectiveTypeList = "FBPKPIObjectiveType";
var FBPAssessmentKPIList = "FBPAssessmentKPI";
var FBPAssessmentTransactionTypeList = "FBPAssessmentTransactionType";

var AssetPurchaseRequestInfo = "AssetPurchaseRequestInfo";
var AssetPurchaseRequestAttachment = "AssetPurchaseRequestAttachment";
var AssetPurchaseRequestAuditLog = "AssetPurchaseRequestAuditLog";

var StorageLocationList = "StorageLocation"; // newly created list
var WorkCenterList = "WorkCenter"; // newly created list
var PlantAddressList = "PlantAddress"; // old list

var BOQApprovalProcessPageURL = "/SitePages/BOQApprovalProcess.aspx";
var BOQApprovalProcessInfo = "BOQApprovalProcessInfo";
var BOQApprovalProcessAttachment = "BOQApprovalProcessAttachment";
var BOQApprovalProcessAuditLog = "BOQApprovalProcessAuditLog";
var CostingEstimationApprovalProcessPageURL = "/SitePages/CostingEstimationApprovalProcess.aspx";
var CostingEstimationApprovalProcessInfo = "CostingEstimationApprovalProcessInfo";
var CostingEstimationApprovalProcessAttachment = "CostingEstimationApprovalProcessAttachment";
var CostingEstimationApprovalProcessAuditLog = "CostingEstimationApprovalProcessAuditLog";


// FBP Tracking List of Values
var FBPTrackingAdministrators = [441]

var businessEntitys = [{ entity: 'Plant' },
{ entity: 'Cost Center' },
{ entity: 'Work Center' },
{ entity: 'Storage Location' },
{ entity: 'All' }];

var transactionEntitys = [{ entity: 'Cost Element' },
{ entity: 'GL' },
{ entity: 'Commitment Item' },
{ entity: 'Internal Order' },
{ entity: 'All' }];

var transactionAccounts = [{ title: 'Sales' },
{ title: 'Purchase' }];

var bpcAbss = [{ title: 'Strategy' },
{ title: 'Activity' }];

var reviewRoutines = [{ title: 'Monthly' },
{ title: 'Quarterly' },
{ title: 'Half Yearly' },
{ title: 'Yearly' }];
// FBP Tracking List of Values



var SAPDevelopers = [366, 35];
var SPDevelopers = [578, 366, 35];
var BasisDevelopers = [34, 381];
var InfraDevelopers = [381, 382];

var SapDev = [[366, "Approver1"], [35, "Approver2"]];
var SPDev = [[366, "Approver1"], [35, "Approver2"], [578, "Maksud Saifullah Pulak"]];
var BasisDev = [[34, "Supervisor"], [381, "opm1"]];
var ITInfra = [[381, "opm1"], [382, "opm2"]];


// var SAPDevelopers = [27,29,25];
// var SPDevelopers = [21,1480,1026,207,194];
// var PPDevelopers = [27,654];
// //var PPDevelopers = [654];
// var BasisDevelopers = [28,325];
// var InfraDevelopers = [21,47,450,447,222,207,194,1667,1480,1797,1869];

// var SapDev = [ [27, "SHEIKH MOHAMMED JAMAL"], [29, "S. M. TAMJEED HASAN"], [25, "MD. MAHBUBUL HAQ"]];
// var SPDev = [[21, "SHOAB MAHMOOD AL NAOSHAD"],[654, "MAKSUD SAIFULLAH PULAK"],[1026, "MOSTAFA KAMAL"],[207, "MD IQBAL"],[194, "NAWSHAR AHAMMED"],[1480, "MD KHALID SHIFULLAH"] ];
// var PPDev = [[27, "SHEIKH MOHAMMED JAMAL"]];
// //var PPDev = [[654, "MAKSUD SAIFULLAH PULAK"]];
// var BasisDev = [[28, "MD. RAZIBUR RAHMAN"], [325, "ATA ULLAH HASAN MAHMUD"]];
// var ITInfra = [[21, "SHOAB MAHMOOD AL NAOSHAD"], [47, "MD. ARIFUR RAHMAN TALUKDER"], [450, "TANVIR AHMED"], [447, "MD SAKIBUR RAHMAN"],[222, "HASIM UDDIN"],[207, "MD IQBAL"],[194, "NAWSHAR AHAMMED"],[1667, "NUR HOSSAIN"],[1797, "SAZID AKRAM BIN REZWAN"],[1869, "MD MONIRUZZAMAN"]];


var notificationReceiverJSON = {
	Designation: [
		{ key: 'GMManager', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // GM-Manager
		{ key: 'GMT', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // GM-T
		{ key: 'GSMPPHD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // GSM-PPHD
		{ key: 'GMIMSC', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // GM-IM&SC
		{ key: 'GMSC', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // GM-SC
		{ key: 'SRGM', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Sr. GM
		{ key: 'CSD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // CSD
		{ key: 'WHD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Warehouse Incharge Dhaka
		{ key: 'WHC', value: 0, name: '', delegateeId: 0, delegateeName: '' },  // Warehouse Incharge Chittagong
		{ key: 'BRManager', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Brand Manager Representative
		{ key: 'GMRND', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // GM-R&D
		{ key: 'GMMRKT', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //GM-Marketing
		{ key: 'SRGMSM', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Sr. GM-SM
		{ key: 'DRFCFO', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Director – Finance & CFO
		{ key: 'MNGDR', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Managing Director
		{ key: 'FWDID', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // FWDI Dhaka
		{ key: 'FWDIC', value: 0, name: '', delegateeId: 0, delegateeName: '' },  // FWDI Chittagong
		{ key: 'VATINC', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // VAT Incharge Chittagong
		{ key: 'VATIND', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //VAT Incharge Dhaka
		{ key: 'INCNRTR', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //Incenarator Person
		{ key: 'RMPNPC', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //RM P&P Officer Chittagong
		{ key: 'RMPNPD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //RM P&P Officer Dhaka
		{ key: 'SNP', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //S&P Officer
		{ key: 'HDPNP', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //Head P&P
		{ key: 'MGRCNIM', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Manager C&IM
		{ key: 'MGRBNFA', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Manager B&FA
		{ key: 'MGRDNSP', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Manager D&SP
		{ key: 'FICSOICC', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Manager FIC/SOIC Chittagong
		{ key: 'FICSOICD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, // Manager FIC/SOIC Dhaka
		{ key: 'PMPNPC', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //PM P&P Officer Chittagong
		{ key: 'PMPNPD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //PM P&P Officer Dhaka
		{ key: 'OVD', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //Officer vendor Development
		{ key: 'MPS', value: 0, name: '', delegateeId: 0, delegateeName: '' }, //Manager MPS
	]
};

var CareCardSubmissionProcessInfo = "CareCardSubmissionProcessInfo";
var CareCardSubmissionProcessAttachment = "CareCardSubmissionProcessAttachment";
var CareCardSubmissionProcessAuditLog = "CareCardSubmissionProcessAuditLog";


//Constants -- End


function saveAtMyTask(title, processName, requestedByName, status, employeeID, requestedByEmail, pendingWith, requestLink) {
	var results = null;
	if (pendingWith.length > 1) {
		results = pendingWith;
	}
	else {
		if (pendingWith == 0) {
			results = [];
		}
		else {
			results = [pendingWith];
		}
	}
	$.ajax
		({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('PendingApproval')/items",
			type: "POST",
			data: JSON.stringify
				({
					__metadata:
					{
						type: "SP.Data.PendingApprovalListItem"
					},
					'Title': title,
					'ProcessName': processName,
					'RequestedByName': requestedByName,
					'Status': status,
					'EmployeeID': employeeID,
					'RequestedByEmail': requestedByEmail,
					'PendingWithId': { 'results': results },
					'RequestLink': requestLink,

				}),
			headers:
			{
				"Accept": "application/json;odata=verbose",
				"Content-Type": "application/json;odata=verbose",
				"X-RequestDigest": $("#__REQUESTDIGEST").val(),
				"X-HTTP-Method": "POST"
			},
			success: function (data, status, xhr) {
				console.log("success" + data + status + xhr);
			},
			error: function (xhr, status, error) {
				console.log("err", error, xhr);
			}
		});
}
function getAndUpdateAtMyTask(sta, pen, tit, proName) {
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
}
function updateAtMyTask(uId, status, pendingWith) {
	var results = null;
	if (pendingWith.length > 1) {
		results = pendingWith;
	}
	else {
		if (pendingWith == 0) {
			results = [];
		}
		else {
			results = [pendingWith];
		}
	}
	$.ajax({
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('PendingApproval')/items(" + uId + ")",
		method: "POST",
		data: JSON.stringify({
			'__metadata': {
				'type': 'SP.Data.PendingApprovalListItem'
			},
			'Status': status,
			'PendingWithId': { 'results': results },
		}),
		headers: {
			"accept": "application/json;odata=verbose",
			"content-type": "application/json;odata=verbose",
			"X-RequestDigest": $("#__REQUESTDIGEST").val(),
			"IF-MATCH": "*",
			"X-HTTP-Method": "MERGE"
		},
		success: function (data) {
		},
		error: function (error) {
			console.log(JSON.stringify(error));
		}
	})
}