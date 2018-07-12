
const HOST = 'https://tdemconnect-dev.tdem.toyota-asia.com'
// const HOST ='http://192.168.2.189:8080'
const VERSION = 'v1'

export default {
    TOKEN: 'Bearer MS4xLjlhNzBiZTI3NjY2MjJhMDRiZjk3NWVjZWM4MWRhMWIzMTlhMTY0NGJmODQ0MTc0YzhlMzU4OWYwNDQwM2Y3YWI4ZjI3Nzc2MWE4NGQ2MDI4ZGNmNjgxMjMyYTEyOTY3Y2YzY2M5MzcwMzkzNTNjOWFiNDlkYmI3ZTk4MjE1NmQz',
    INITIAL_MASTER_API: HOST + '/api/' + VERSION + '/initmaster/',
    ANNOUNCEMENT_ASC_API: HOST + '/api/' + VERSION + '/announcement?sort=%2Bcreate_date',
    ANNOUNCEMENT_DSC_API: HOST + '/api/' + VERSION + '/announcement?sort=-create_date',
    ANNOUNCEMENT_DETAIL_API: HOST + '/api/' + VERSION + '/announcement/',
    PAYSLIP_LIST_API: HOST + '/api/' + VERSION + '/payslip/summary',
    PAYSLIP_DETAIL_API: HOST + 'api/' + VERSION + '/payslip/',
    OTSUMMARY_DETAIL: HOST + '/api/' + VERSION + '/ot/summary?',
    HANDBOOK_LIST: 'https://randomuser.me/api/?results=2',
    // HANDBOOK_LIST: HOST + '/api/' + VERSION + '/handbooks',
    LEAVE_QUOTA_API: HOST + '/api/' + VERSION + '/leavequota/summary',
    NONPAYROLL_SUMMARY_API: HOST + '/api/' + VERSION + '/nonpayroll/summary',
    CALENDER_YEAR_API: HOST + '/api/' + VERSION + '/calendar?year=',

    NON_PAYROLL_DETAIL_API: HOST + '/api/' + VERSION + '/nonpayroll?month=',

    CLOCK_IN_OUT_API: HOST + '/api/' + VERSION + '/clockinout?empcode=',
    CALENDAR_PDF_YEAR_API: HOST + '/api/' + VERSION + '/calendar/file?year=',
    CALENDAR_NAME: 'Toyota',
    REGISTER_API: HOST + '/api/' + VERSION + '/auth',
    SET_PIN_API: HOST + '/api/' + VERSION + '/pin',

    CLOCK_IN_OUT_MANAGER_API: HOST + '/api/' + VERSION + '/clockinout?empcode=',
    EMP_INFO_CAREERPATH_API: HOST + '/api/' + VERSION + '/employee/',
    EMP_INFO_MANAGER_API: HOST + '/api/' + VERSION + '/employee/',
    ORGANIZ_STRUCTURE_API: HOST + '/api/' + VERSION + '/organization?type=CE&org_code=',
    APPLICATION_INFO_API: HOST + '/api/' + VERSION + '/appinfo',


    OTSUMMARY_LINE_CHART: HOST + '/api/' + VERSION + '/ot/history?org_code=',
    OTSUMMARY_BAR_CHART: HOST + '/api/' + VERSION + '/ot/average?org_code=',

    ORGANIZ_STRUCTURE_API: HOST + '/api/' + VERSION + '/organization?type=CE&org_code=',
    ORGANIZ_STRUCTURE_OT_API: HOST + '/api/' + VERSION + '/organization?type=E&org_code=',

    // 
    profileObject: {},
    initmaster: {},

    NOTIFICATION_CATEGORY: [],
    READ_TYPE: [],
    COMPANY_LOCATION: [],
    TB_M_LEAVETYPE: [],
    company: 'TMAP-EM'
}

