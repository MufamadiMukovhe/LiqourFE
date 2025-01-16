export class Auth {
    username!: string;;
    otp: any;
}

export class Message {
    success!: string;;
    message: any;
}

export class Add {
    postalCodePremise: any
    premiseDistrict: any
    premiseLocalMunicipality: any
    premiseTown: any
}

export class Area {
    id!: string;
    areaName!: string;
    parentAreaId!: string;
    postalCode!:string;
}

export class AddressDropdown {
    localMunicipalities!: Area[];
    districtMunicipalities!: Area[];;
    towns!: Area[];;
}

export class RegisterApplication {
    exisitingOutletEcp: any;
    domiciliumAddress!: string;
    inspectorComments!: string;
    companyName!: string;
    compRegistration!: string;
    outletname!: string;
    citizenship!: string;
    applicantType!: string;
    applicationPreparedByType!: string;
    fullName!: string;
    applicantFullName!: string;
    emai!: string;
    applicantEmail!: string;
    mobileNumbers!: string;
    applicantMobileNumbers!: string;
    prefferedNotificationMethod!: string;
    idnumber!: string;
    age: any;
    gender!: string;
    race!: string;
    residentialAddress!: string;
    businessAddress!: string;
    postalAddress!: string;
    postalCode!: string;
    telephoneNumber!: string;
    faxNumber!: string;
    proofOfPayment!: string;
    applicationForm!: string;
    planOfPremise!: string;
    floorLayoutPlan!: string;
    descriptionOrPhotos!: string;
    writtenRepresentation!: string;
    popia!: string;
    wardCommitee!: string;
    proofOfService!: string;
    religiousBodies!: string;
    publicSchool!: string;
    taxRegistrationStatus!: string;
    premisesPopulationCertificate!: string;
    municipalZoningLandConsent!: string;
    idDocument!: string;
    passportDocument!: string;
    registionDocumentIfJuristic!: string;

    refugeeStatusCopy!: string;
    refugeeIdentification!: string;
    trustees!: string;
    trustDeed!: string;
    depAgricultureLetter!: string;
    customsExciseCertificate!: string;
    riskCategorisationCertificate!: string;
    noisePollutionCertificate!: string;

    powerOfAttorney!: string;
    rightToOccupyPremise!: string;
    constitution!: string;
    appointmentLetter!: string;
    locationType!: string;
    erfNumber!: string;
    shopNumber!: string;
    buildingName!: string;
    streetNumber!: string;
    streetName!: string;
    addressLine1!: string;
    addressLine2!: string;
    postalCodePremise!: string;
    premiseDistrict!: string;
    premiseLocalMunicipality!: string;
    premiseWard!: string;
    premiseTown!: string;
    licenseType!: string;
    registrationType!: string;
    eventName!: string;
    eventStartDate!: Date;
    eventEndDate!: Date;

    financialInterestInLiquor: FinancialInterestInLiquorFormData[] = []
    financialInterestInBusiness: FinancialInterestFormData[] = []
}

export interface FileItem {
    label: string;
    key: string;
    file: File | null;
    fileName?: string; 
}

export interface Section54 {
    outletName: string;
    contactDetails: string;
    registeredOwner: string;
    referenceNumber: string;
    address?: string; 
}



export class FormModel {
    inspectorComments!: string;
    registrationType!: string;
    nameChangeAsResultOfRemoval!: string;
    newOutletName!: string;
    eventEndDate!: any;
    eventName!: string;
    eventStartDate!: any;
    exisitingOutletEcp!: string;
    outletname!: string;
    citizenship!: string;
    applicantType!: string;
    applicationPreparedByType!: string;
    fullName!: string;
    applicantFullName!: string;
    email!: string;
    applicantEmail!: string;
    mobileNumbers!: string;
    applicantMobileNumbers!: string;
    prefferedNotificationMethod!: string;
    idnumber!: string;
    compRegistration!: string;
    companyName!: string;
    age: any;
    gender: any;
    race: any;
    residentialAddress!: string;
    businessAddress!: string;
    newBusinessAddress!: string;
    postalAddress!: string;
    postalCode!: string;
    telephoneNumber!: string;
    telephoneNumber1!: string;
    proofOfPayment!: string;
    applicationForm!: string;
    planOfPremise!: string;
    descriptionOrPhotos!: string;
    writtenRepresentation!: string;
    wardCommitee!: string;
    proofOfService!: string;
    idDocument!: string;
    passportDocument!: string;
    registionDocumentIfJuristic!: string;
    powerOfAttorney!: string;
    rightToOccupyPremise!: string;
    constitution!: string;
    appointmentLetter!: string;
    locationType!: string;
    erfNumber!: string;
    shopNumber!: string;
    buildingName!: string;
    streetNumber!: string;
    streetName!: string;
    addressLine1!: string;
    addressLine2!: string;
    postalCodePremise!: string;
    premiseDistrict!: string;
    premiseLocalMunicipality!: string;
    premiseWard!: string;
    premiseTown!: string;
    licenseType!: string;
    applicantRightToOccupy!: string;
    kindOfRightToOccupy!: string;
    portionOfSaleOfLiquor!: string;
    reason!: string;
    anticipatedDate: any;
    eractedAccordingToPlan!: string;
    temporaryJobs!: string;
    permanentJobs!: string;
    unrehabilitatedInsolvant!: string;
    isMinor!: string;
    isPartnerOfPerson!: string;
    hadLicenseRevoked!: string;
    hasControllingInterest!: string;
    details!: string;
    subParagraph!: string;
    companyWithShareHolders!: string;
    personHasFinancialInterest!: string;
    microManufacturer!: string;
    leaseExpiry: any;
    ifOther!: string;
    citizenship1!: string;
    applicantType1!: string;
    applicationPreparedByType1!: string;
    applicantFullName1!: string;
    applicantEmail1!: string;
    applicantMobileNumbers1!: string;
    idnumber1!: string;
    passport1!: string;
    compRegistration1!: string;
    companyName1!: string;
    age1!: string;
    gender1!: string;
    race1!: string;

    financialInterestInLiquor: FinancialInterestInLiquorFormData[] = []
    financialInterestInBusiness: FinancialInterestFormData[] = []
}

export class Checklist {
    [key: string]: string;
    applicationForm!: string;
    appointmentOf!: string;
    constitution!: string;
    educationBodies!: string;
    identityDocument!: string;
    lodgementFee!: string;
    passportDocument!: string;
    planOfPremise!: string;
    powerOfAttorney!: string;
    premisePhotos!: string;
    registrationDocuments!: string;
    religiousBodies!: string;
    publicSchool!: string;
    taxRegistrationStatus!: string;
    premisesPopulationCertificate!: string;
    municipalZoningLandConsent!: string;
    rightToOccupy!: string;
    wardCommittee!: string;
    writtenPresentations!: string;
    popia!: string;
}

export class Inbox {
    caseId: any;
    outletName!: string;
    ecpNumber!: string;
    caseName!: string;
    action!: string;
    assignDate: any;
    dueDate: any;
    status: any;
}

export class CaseWorkflow {
    status!: string;
    name!: string;
    assigned!: string;
    startedOn!: Date;
    completedBy!: string;
    completedOn!: Date;
    caseName!: string;
    caseDetailId!: string;
}

export class CaseDetails {
    caseWorkflow!: CaseWorkflow[];
    outletName!: string;
    ecpNumber!: string;
    startedOn!: any;
    completedOn!: Date;
    caseName!: string;
    caseStatus: any;
    hasCompleteReport: any
}

export class User {
    userId!: string;
    userName!: string;
    role: string[] = [];
    lastActivityDate!: string;
    suspended: any;
}

export class SuspendActivateAccount {
    userId: any;
    suspended!: boolean;
}

export class UpdateAssignedTask {
    caseId: any;
    username!: string;
    process!: string;
    casedetailId!: string;
}

export class Roles {
    roleId!: string;
    roleName!: string;
}

export class UserInformation {
    username!: string;
    roles!: Roles[];
}

export class AppealFile {
    confirmation!: string;
    commentsOrNotes!: string;
}

export class ConfirmProcess {
    confirmCapture!: string;
    additionalComments!: string;
    queryDetails!: string;
    period!: string;
}
export class UploadObjection {
    personObjecting!: string;
    email!: string;
    phoneNumber!: string;
    address!: string;
    comments!: string;
    caseId!: string
}
export class FileFile {
    fileName!: string;
    url!: string;
}

export class RecordAppeal {
    notes!: string;
    appealDecision!: string;
}

export class Gazette {
    confirmApplication: any;
    publicationDate!: Date;
}

export class PreInspection {
    scheduledInspectionDate!: Date;
    inspectionRecommendation!: string;
}

export class CompleteReportInspection {
    caseName:any;
    commentsByQualityCheck:any;
    sections: any[] = [];
    commentsByQa!: string;
    contactPerson!: string;
    inspectionDate: any;
    appointmentSet!: string;
    consultedOrFound!: string;
    applicantIndicatedPersonAtPremises!: string;
    canPersonBeFound!: string;
    interestInLiquorTrade!: string;
    issuedCompliance!: string;
    complaintsReceived!: string;
    complaintsReceivedMentioned!: string;
    rightToOccupy!: string;
    leaseAttached!: string;
    latitude: any;
    sections1!: any;
    longitude: any;
    situatedInRightAddress!: string;
    inLineWithSubmittedApplication!: string;
    premisesSuitable!: string;
    ablutionFacilityInOrder!: string;
    readyForBusiness!: string;
    formServedToCorrectWardCommittee!: string;
    confirmedByCouncillor!: string;
    wardCommiteeReport!: string;
    communityConsultation!: string;
    educationalInstitution!: string;
    formServedAtEducationInstitution!: string;
    placeOfWorship!: string;
    formServedAtPlaceOfWorship!: string;
    recommendation!: string;
    recommendation1!: string;
    futureInspectionDate: any;
    comments?: string;
    recommenedBy!: string;
    comments1!: string;
    formObjectionsInspection!: string;
    formObjectionsReceived!: string;
    formApplicantRespondedToObjections!: string;
    complianceSectionC!: string;
    complianceSectionB!: string;
    complianceSectionA!: string;
    ablutionFacilities!: string;
    storageRoom!: string;
    demarcatedDrinkingArea!: string;
    displayAreaShelves!: string;
    counterPointOfSake!: string;
    applicantB!: string;
    applicantC!: string;
    planOfPremisesAndDimensions!: string;
    listAllRecommendations!: string;
    buildingStructureAndMeansOfCommunication!: string;
    rightToOccupyPremises!: string;
    applicant!: string;
    schoolIn100m!: string;
    churchIn100m!: string;
    wardBoundriesIn100m!: string;
    /** Comments */
    formApplicantRespondedToObjectionsComment: string = '';
    formObjectionsReceivedComment: string = '';
    formObjectionsInspectionComment: string = '';
    formServedAtPlaceOfWorshipComment: string = '';
    placeOfWorshipComment: string = '';
    formServedAtEducationInstitutionComment: string = '';
    educationalInstitutionComment: string = '';
    communityConsultationComment: string = '';
    wardCommiteeReportComment: string = '';
    confirmedByCouncillorComment: string = '';
    formServedToCorrectWardCommitteeComment: string = '';
    readyForBusinessComment: string = '';
    ablutionFacilityInOrderComment: string = '';
    premisesSuitableComment: string = '';
    inLineWithSubmittedApplicationComment: string = '';
    situatedInRightAddressComment: string = '';
    leaseAttachedComment: string = '';
    rightToOccupyComment: string = '';
    complaintsReceivedComment: string = '';
    issuedComplienceComment: string = '';
    interestInLiquorTradeComment: string = '';
    canPersonBeFoundComment: string = '';
    applicantIndicatedPersonAtPremisesComment: string = '';
    consultedOrFoundComment: string = '';
    appointmentSetComment: string = '';
}


export class LoginData {
    username: any
    password: any;
}

export class QualityAssuranceInspectionReport {
    recommendation!: string;
    futureInspectionDate!: Date;
    comments: any;
    queryTo: any
}

export class CommitteeRecommendation {
    recommendation!: string;
    sections: any[] = [];
    notice: any;
    notes: any;
    action: any;
}

export class SignOff {
    signOff!: string;
    comment!: string;
    role!: string;
}

export class ChangeOfPlan {
    inspectionDate!: string;
}

export class ApproveNameChange {
    approveNameChange!: string;
    comment!: string;
}

export class Outlets {
    id: any
    ecpNumber!: string;
    organisationName!: string;
    status!: string;
    licenseCategory!: string;
    frwkCreatedTimestamp!: Date;
}

export class Outlet {
    outletId!: string;
    outletName!: string;
}

export class Complaints {
    referenceNumber!: string;
    outletName!: string;
    addressOfOutlet!: string
    regionOfOutlet!: string;
    areaOfOutlet!: string;
    descriptionOfComplaint!: string;
    nameOfComplainant!: string;
    contactNumber!: string;
    dateComplaintLogged!: Date;
    assignedInspector!: string;
    inspectorReport!: string;
    dateReport!: Date;
    systemOutletName!: string;
}

export class EditComplain {
    referenceNumber!: string;
    offendingOutlet!: string;
    ecpNumber!: string;
    districtName!: string;
    localMunicipality!: string;
    town!: string;
    inspector!: string;
    comment!: string;
    status!: string;
    commentHistory!: string;
    comments!: string[];
}

export class Inspector {
    userId!: string;
    username!: string;
}

export class ComplainInformation {
    inspectors!: Inspector[]
    outlets!: Outlet[];
}

export class Address {
    ecpNumber: string = '';
    name: string = '';
    districtName: string = '';
    localMunicipality: string = '';
    town: string = '';
    address: string = '';
}

export class ChangeOfName {
    inspectionDate!: Date;
}

export class Deregistration {
    recommendation!: string;
    inspectionDate!: string;
    period!: string;
    boardRecommendation!: string;
    ecpNumber!: string;
    municipality!: string;
    outletName!: string;
    ward!: string;
    referenceNumber!: string;
    prefferedNotificationMethod!: string;
    applicationPreparedByType2!: string;
}

export class DescriptionOfPremises {
    constructionBuildingWalls!: string;
    constructionRoof!: string;
    constructionWindows!: string;
    constructionDoors!: string;
    constructionFloorCovering!: string;
    constructionAdequateAblutionFacilities!: string;
    
    fixturesBarCounter!: string;
    fixturesDisplayShelving!: string;
    fixturesBarStools!: string;
    fixturesTables!: string;
    fixturesChairs!: string;
    fixturesLightFittings!: string;

    finishingsRoof!: string;
    finishingsCeiling!: string;
    finishingsWindows!: string;
    finishingsDoors!: string;
    finishingsFloorCovering!: string;

    anyRelevantComment!: string;
    recommendation!: string;
}

export class MunicipalDecision {
    municipalDecision: any;
}

export class ChangeOfPlanInspection {
    inspectionDate!: Date;
    recommendation!: string;
}

export class ReusableRecommend {
    recommendation!: any;
    comments!: any; 
    step: any;
}

export class ComplianceInspection {
    recommendation!: any;
    comments!: any; 
    licenseType:any;
    suspensionPeriod:any;
}

export class Section54 {
    comments:any;
}


export class Approve {
    approve!: any;
    comments!: any
}

export class OutcomeVerification {
    recommendation!: string;
    outComeVerification!: string;
    additionalDetails!: string;
}

export class FinancialInterestInLiquourTrade {
    outletName!: string;
    ecpNumber!: string;
    address!: string;
    town!: string;
    province!: string;
}

export class FinancialInterestInBusiness {
    fullName!: string;
    idNumber!: string;
    residentialAddress!: string;
    natureOfFinancialInterest!: string;
    extendInSuchInterest!: string;
}

export class ControllingInterest {
    step: any;
    // Application Prepared By Form Controls
    applicationPreparedByType: string = '1';
    preparedByPostalAddress!: string;
    preparedByFullName!: string;
    preparedByEmail!: string;
    preparedByTelephone!: string;
    preparedByMobileNumbers!: string;
    prefferedNotificationMethod!: string;

    // Holder Applicant Form Controls
    holderApplicantType!: string;
    holderFullName!: string;
    holderCitizenship!: string;
    holderIdNumber!: string;
    holderPassportNumber: string = '';
    holderAge!: number;
    holderRace!: string;
    holderGender!: string;
    holderCompanyReg: string = '';
    holderCompanyName: string = '';

    // Outlet Name
    outletName!: string;

    // Outlet Location
    locationType!: string;
    businessAddress!: string;
    erfNumber: string = '';
    shopNumber!: string;
    buildingName!: string;
    streetNumber!: string;
    streetName!: string;
    addressLine1!: string;
    addressLine2: string = '';
    postalCodePremise!: string;
    premiseDistrict!: string;
    premiseLocalMunicipality!: string;
    premiseWard!: string;
    premiseTown!: string;

    // Applicant Form Controls
    applicantApplicantType!: string;
    applicantFullName!: string;
    applicantCitizenship!: string;
    applicantIdNumber!: string;
    applicantPassportNumber: string = '';
    applicantAge!: number;
    applicantRace!: string;
    applicantGender!: string;
    applicantCompanyReg: string = '';
    applicantCompanyName: string = '';

    // Applicant Address
    applicantResidentialAddress!: string;
    applicantBusinessAddress!: string;
    applicantPostalAddress!: string;
    applicantPostalCode!: string;
    applicantEmail!: string;
    applicantHomeTelephone!: string;
    applicantBusinessTelephone!: string;
    applicantMobileNumber!: string;

    // Additional Fields
    isPartnerOfPerson!: string;
    isMinor!: string;
    isUnrehabilitatedInsolvant!: string;
    notNomiciledRepublic!: string;
    hasControllingInterestInSuchJuristic!: string;
    isBeneficiaryUnderSuchTrust!: string;
    isParterInSuchRelationship!: string;
    provideDetails!: string;
    percentage!: string;
    interestInBusines: FinancialInterestFormData[] = [];
    interestInLiquorTrade: FinancialInterestInLiquorFormData[] = []
}

export class FinancialInterestFormData {
    fullName!: string;
    idnumber!: string;
    residentialAddress!: string;
    natureOfFinancialInterest!: string;
    extendOfSuchInterest!: number;
}

export class UserDto {
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    jobTitle: string = '';
    position: string = '';
    unit: string = '';
    mobileNumbers: string = '';
    officeNumber: string = '';
    email: string = '';
    districtId: string = '';
    municipalId: string = '';
    operationTownId: string = '';
    operationalAreas: OperationalAreaDao[] = [];
    roles: Roles[] = [];
}

export class OperationalAreaDao {
    operationalAreaId:string ='';
    district: string = '';
    municipal: string = '';
    operationTown: string = '';
}

export class FinancialInterestInLiquorFormData {
    outletName!: string;
    reference!: string;
    address!: string;
    town!: string;
    province!: string;
    extendOfSuchInterest!: number;
}

export class A {
    reference!: any
}

export class LCSchedule1 {
    ecpNumber!: string;
    caseId!: any;
}

export class LCSchedule {
    ecpNumber!: string;
    lcDate!: Date;
}

export class SubmitToLc {
    lcDaos: LCSchedule1[] = []
    LcDate: any;
}

export class SpecialEvent {
    specialEvent!: SpecialEventData
    financialInterestInLiquor: FinancialInterestInLiquorFormData[] = []
    financialInterestInBusiness: FinancialInterestFormData[] = []
}

export class SpecialEventData {
    eventName!: string;
    eventFrom!: any;
    eventTo!: any;
    applicantEmail!: string;
    applicantMobileNumbers!: string;
    categoryOfLicense!: string;
    beer!: string;
    wine!: string;
    spirits!: string;
    fruitBeverage!: string;
    fullName!: string;
    email!: string;
    mobileNumbers!: string;
    prefferedNotificationMethod!: string;
    applicationPreparedByType!: string;
    idnumber!: string;
    age!: string;
    gender!: string;
    race!: string;
    applicantFullName!: string;
    applicantType!: string;
    citizenship!: string;
    proofOfPayment!: string;
    applicationForm!: string;
    planOfPremise!: string;
    descriptionOrPhotos!: string;
    writtenRepresentation!: string;
    wardCommitee!: string;
    proofOfService!: string;
    idDocument!: string;
    passportDocument!: string;
    registionDocumentIfJuristic!: string;
    powerOfAttorney!: string;
    rightToOccupyPremise!: string;
    constitution!: string;
    appointmentLetter!: string;
    residentialAddress!: string;
    businessAddress!: string;
    postalAddress!: string;
    postalCode!: string;
    telephoneNumber!: string;
    faxNumber!: string;
    permanetJobs!: string;
    temporaryJobs!: string;
    unrehabilitatedInsolvant!: string;
    isMinor!: string;
    isPartnerOfPerson!: string;
    hadLicenseRevoked!: string;
    details!: string;
    hasControllingInterest!: string;
    microManufacturer!: string;
    personHasFinancialInterest!: string;
    companyWithShareHolders!: string;
    subParagraph!: string;
    locationType!: string;
    erfNumber!: string;
    shopNumber!: string;
    buildingName!: string;
    streetNumber!: string;
    streetName!: string;
    addressLine1!: string;
    addressLine2!: string;
    postalCodePremise!: string;
    premiseDistrict!: string;
    premiseLocalMunicipality!: string;
    premiseWard!: string;
    premiseTown!: string;
    applicantRightToOccupy!: string;
    kindOfRightToOccupy!: string;
    leaseExpiry!: string;
    ifOther!: string;
    portionOfSaleOfLiquor!: string;
    eractedAccordingToPlan!: string;
    eractedButRequireAdditions!: string;
    notErected!: string;
    anticipatedDate: any;
    completeness!: string;
}

export class CompleteReport {
    currentOutletName!: string;
    willNameChange!: string;
    personContacted!: string;
    inspectionDate: any;
    latitude: any;
    longitude: any;
    appointmentSet!: string;
    personConsulted!: string;
    indicatedParticularPerson!: string;
    personFoundConfirmed!: string;
    rightToOccupy!: string;
    premisesInIndicatedAddress!: string;
    premiseInLineWithPlan!: string;
    premisesSuitedForCategory!: string;
    abulutionFacilityWorking!: string;
    readyToCommenceWithBusiness!: string;
    formServedToWardCommittee!: string;
    formServedToWardCouncillor!: string;
    wardCommitteReport!: string;
    communityConsulted!: string;
    educationalInstitutionWithin100m!: string;
    formServedAtEducationalInstitution!: string;
    placeOfWorshipWithin100m!: string;
    formServedAtPlaceOfWorship!: string;
    recommendationForRegistration!: string;
    comments!: string;
    futurePreInspectionDate: any;
    lease!: string;
}

export class Cases {
    casedId!: string;
    caseName!: string;
    status!: string;
    startDate!: Date;
    endDate!: Date;
}

export class _Case {
    address!: Address;
    cases!: Cases[];
    balance: any;
}

export class UnallocatedPayment {
    transactionId: any
    transactionDate!: Date;
    referenceNumber!: string;
    amount!: string;
}

export class UnderOverPayment {
    outletName: any;
    caseName: any
    date!: any;
    ecpNumber!: string;
    amount!: any;
    underOver: any
}

export class AllocatePayment {
    transactionId: any
    amount: any;
    organisationId: any;
    ecpNumber: any
}

export class OrganisationlGLBalances {
    organisationGlAccountId!: string;
    amount!: any;
    transactionDate!: Date;
}

export class Transaction {
    accountName!: string;
}

export class NewApplicationReport {
    lastUpdatedDate!: Date;
    lastUpdatedUser!: string;
    outletName!: string;
    discriminator!: string;
}

export class AuditReport {
    outletName!: string;
    ecpNumber!: string;
    date!: Date;
    action!: string;
    userAction!: string;
}

export class BankTransactions {
    date!: Date;
    description!: string;
    amount!: number
}

export class ComplaintsReport {
    outletName!: string;
    ecpNumber!: string;
    date!: Date;
    inspectorName!: string;
    description!: string;
}

export class GLReport {
    outletName!: string;
    ecpNumber!: string;
    transactionDate!: Date;
    description!: string;
    amount!: string;
    partyId!: string;
}

export class GISReport {
    outletId: any;
    longitude: any;
    latitude: any;
}

export class PrepareLC {
    ecpNumber: any;
    businessName!: string;
    kindOfRegistration!: string;
    typeOfApplication!: string;
    caseHistory: any;
    recommendation: any;
    lcDate!: Date;
    qaComments!: any;
    qualityCheckComments!: any;
    inspectorComments!: any;
    expanded!:boolean;
}

export class LcRecommendation {
    ecpNumber!: string;
    businessName!: string;
    applicationType!: string;
    lcDate!: any;
    caseId!: string;
}

export class ScheduleDate {
    date: any;
    confirmCapture: any;
    vanue:any;
    address:any;
    suburb:any;
    town:any
}

export class AppealForm {
    appealPeriod!: string;
    applicantName!: string;
    appealLodgeDate!: string;
    appealInformation!: string;
    email!: string;
    mobileNumbers!: string;
    telephone!: string;
    faxNumber!: string;
    address!: string;
    appellantType!:string;
    files: string[] = [];
    caseIdForAppReg:any
}


export class ManagerAppointment {
    /*fullName!: string;
    citizenship!: string;
    idNumber!: string;
    age: any
    gender!: string;
    unrehabilitatedInsolvent!: string;
    isMinor!: string;
    isParterToBusiness!: string;
    currentlyResideInRepublic!: string;
    contractLength!: string;
    race!: string;
    effectiveDate!: Date;
    recommendation: any*/
    citizenship:any;
    gender:any;
    appointeeAge:any;
    appointeeIdnumber!:string;
    appointeefullname!:string
    appointmentDate!:Date 
    domiciled!:string 
    fullname!:string 
    idnumber!:string 
    isMinor!:string 
    validity!:string;
    municipality!:string 
    outletName!:string;
    relationship!:string; 
    subparagraph!:string ;
    terminationDate!:Date ;
    unrehabilitatedInsolvent!:string ;
    ward!:string;
    contactDetails!:string;
    ecpNumber!:string;
}

export class CompleteGISReport {
    latitude: any;
    longitude: any;
    schoolIn100m!: string;
    churchIn100m!: string;
    wardBoundriesIn100m!: string;
    councilorContacted!: string;
}

export class AllocatedPayments {
    date: any;
    ecpnumber: any;
    outlet: any;
    amount: any;
    allocationType: any;
    allocationBy: any;
    kindOfRegistration: any
}

export class Accounts {
    description!: string;
    account: any;
    totalAmount: any;
}

export class ControllingInterestInformation {
    interestInBusines: FinancialInterestFormData[] = [];
    interestInLiquorTrade: FinancialInterestInLiquorFormData[] = [];
}

export class TransferLicense {
    currentOutletName!: string;
    newOutletName!: string;
    reason!: string;
    nameChangeAsResultOfTransfer!: string;
    applicantEmail!: string;
    applicantMobileNumbers!: string;
    fullName!: string;
    email!: string;
    mobileNumbers!: string;
    prefferedNotificationMethod!: string;
    applicationPreparedByType!: string;
    idnumber!: string;
    age!: string;
    gender!: string;
    race!: string;
    applicantFullName!: string;
    applicantType!: string;
    citizenship!: string;
    proofOfPayment!: string;
    applicationForm!: string;
    planOfPremise!: string;
    descriptionOrPhotos!: string;
    writtenRepresentation!: string;
    wardCommitee!: string;
    proofOfService!: string;
    idDocument!: string;
    passportDocument!: string;
    registionDocumentIfJuristic!: string;
    powerOfAttorney!: string;
    rightToOccupyPremise!: string;
    constitution!: string;
    appointmentLetter!: string;
    residentialAddress!: string;
    businessAddress!: string;
    postalAddress!: string;
    postalCode!: string;
    telephoneNumber!: string;
    permanetJobs!: string;
    temporaryJobs!: string;
    unrehabilitatedInsolvant!: string;
    isMinor!: string;
    isPartnerOfPerson!: string;
    hadLicenseRevoked!: string;
    details!: string;
    hasControllingInterest!: string;
    microManufacturer!: string;
    personHasFinancialInterest!: string;
    companyWithShareHolders!: string;
    subParagraph!: string;
    applicantRightToOccupy!: string;
    kindOfRightToOccupy!: string;
    leaseExpiry: any
    ifOther!: string;
    portionOfSaleOfLiquor!: string;
    eractedAccordingToPlan!: string;
    eractedButRequireAdditions!: string;
    notErected!: string;
    anticipatedDate: any;
}

export class TransferLicenseData {
    transferData!: TransferLicense;
    financialInterestInLiquor: FinancialInterestInLiquorFormData[] = [];
    financialInterestInBusiness: FinancialInterestFormData[] = [];
}

export class TransferOfLicenseD {
    outletName!: string;
    interestInBusines: FinancialInterestFormData[] = [];
    interestInLiquorTrade: FinancialInterestInLiquorFormData[] = []
}

export class RemovalForm {
    currentOutletName!: string;
    newOutletName!: string;
    nameChangeAsResultOfRemoval!: string;
    applicationPreparedByType!: string;
    applicationPreparedByFullname!: string;
    applicationPreparedByEmail!: string;
    applicationPreparedByMobilenumbers!: string;
    applicationPreparedByPreferredNotification!: string;
    applicantType!: string;
    applicantFullname!: string;
    citizenship!: string;
    idnumber!: string;
    age!: string;
    gender!: string;
    race!: string;
    applicantEmail!: string;
    applicantMobilenumber!: string;
    proofOfPayment!: string;
    applicationForm!: string;
    planOfPremise!: string;
    descriptionOrPhotos!: string;
    writtenRepresentation!: string;
    wardCommitee!: string;
    proofOfService!: string;
    idDocument!: string;
    passportDocument!: string;
    registionDocumentIfJuristic!: string;
    powerOfAttorney!: string;
    rightToOccupyPremise!: string;
    constitution!: string;
    appointmentLetter!: string;
    residentialAddress!: string;
    businessAddress!: string;
    postalAddress!: string;
    postalCode!: string;
    telephoneNumber!: string;
    faxNumber!: string;
    permanentJobs!: number;
    temporaryJobs!: number;
    locationType!: string;
    erfNumber!: string;
    shopNumber!: string;
    buildingName!: string;
    streetNumber!: string;
    streetName!: string;
    addressLine1!: string;
    addressLine2!: string;
    postalCodePremise!: string;
    premiseDistrict!: string;
    premiseLocalMunicipality!: string;
    premiseWard!: string;
    premiseTown!: string;
    applicantRightToOccupy!: string;
    kindOfRightToOccupy!: string;
    leaseExpiry!: any;
    ifOther!: string;
    portionOfSaleOfLiquor!: string;
    eractedAccordingToPlan!: string;
    anticipatedDate!: any;
}

export class DeregisterOutlet {
    submissionTitle!: string;
    Discussion!: string;
    Recommendation!: string;
    Background!: string;
    Purpose!: string;
}

export class GazzetteObject {
    ecpNumber!: string;
    lodgementDate!: string;
    outletName!: string;
    licenseType!: string;
    districtMunicipality!: string;
    localMunicipality!: string;
    town!: string;
    ward!: string;
}

export class CIPCDao {
    token!: string;
    enterpriceNumber!: string;
}