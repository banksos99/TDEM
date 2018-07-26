
const HOST = 'https://tdemconnect-dev.tdem.toyota-asia.com'
// const HOST = 'http://192.168.2.189:8080'
const VERSION = 'v1'

export default {
    HOST: HOST,
    TOKEN: '',

    INITIAL_MASTER_API: HOST + '/api/' + VERSION + '/initmaster/',
    APPLICATION_INFO_API: HOST + '/api/' + VERSION + '/appinfo',
    PULL_NOTIFICATION_API: HOST + '/api/' + VERSION + '/pullnotification?latest_date=',
    ANNOUNCEMENT_ASC_API: HOST + '/api/' + VERSION + '/announcement?sort=%2Bcreate_date',
    ANNOUNCEMENT_DSC_API: HOST + '/api/' + VERSION + '/announcement?sort=-create_date',
    ANNOUNCEMENT_DETAIL_API: HOST + '/api/' + VERSION + '/announcement/',

    PAYSLIP_LIST_API: HOST + '/api/' + VERSION + '/payslip/summary',
    PAYSLIP_DETAIL_API: HOST + '/api/' + VERSION + '/payslip/',
    PAYSLIP_DOWNLOAD_API: HOST + '/api/' + VERSION + '/payslip/file/',

    OTSUMMARY_DETAIL: HOST + '/api/' + VERSION + '/ot/summary?',
    // HANDBOOK_LIST: 'https://randomuser.me/api/?results=2',

    HANDBOOK_LIST: HOST + '/api/' + VERSION + '/handbooks',

    LEAVE_QUOTA_API: HOST + '/api/' + VERSION + '/leavequota/summary',
    NONPAYROLL_SUMMARY_API: HOST + '/api/' + VERSION + '/nonpayroll/summary',
    CALENDER_YEAR_API: HOST + '/api/' + VERSION + '/calendar?year=',
    CALENDER_YEAR_PDF_API: HOST + '/api/' + VERSION + '/calendar/file?year=',

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


    OTSUMMARY_LINE_CHART: HOST + '/api/' + VERSION + '/ot/history?org_code=',
    OTSUMMARY_BAR_CHART: HOST + '/api/' + VERSION + '/ot/average?org_code=',

    ORGANIZ_STRUCTURE_API: HOST + '/api/' + VERSION + '/organization?type=CE&org_code=',
    ORGANIZ_STRUCTURE_OT_API: HOST + '/api/' + VERSION + '/organization?type=E&org_code=',

    profileObject: {},
    initmaster: {},

    NOTIFICATION_CATEGORY: [],
    READ_TYPE: [],
    COMPANY_LOCATION: [],
    TB_M_LEAVETYPE: [],
    company: 'TMAP-EM',
    deviceInfo: {},
    calendarAutoSync: true,
    // MANAGER_STATUS:true,
    notipayslipID: 0,
    notipayAnnounceMentID: 0,

    FUNCTIONID_SPLASH: 'HF0111',
    FUNCTIONID_REGISTER: 'HF0121',
    FUNCTIONID_PIN: 'HF0131',
    FUNCTIONID_MAIN: 'HF0141',
    FUNCTIONID_SETTING: 'HF0151',
    FUNCTIONID_ANNOUCEMENT: 'HF0201',
    FUNCTIONID_WORKING_CALENDAR: 'HF0311',
    FUNCTIONID_CALENDAR_EVENT: 'HF0321',
    FUNCTIONID_EMPLOYEE_INFORMATION: 'HF0401',
    FUNCTIONID_PAYSLIP: 'HF0501',
    FUNCTIONID_NON_PAYROLL: 'HF0601',
    FUNCTIONID_CLOCK_IN_OUT: 'HF0701',
    FUNCTIONID_OT_SUMMARY: 'HF0801',
    FUNCTIONID_LEAVE_QUOTA: 'HF0901',
    FUNCTIONID_HANDBOOK: 'HF0A01',
    FUNCTIONID_GENERAL_INFORMATION_SHARING: 'HF0B01',
    FUNCTIONID_ORGANIZ_STRUCTURE: 'HF0C01',
    FUNCTIONID_PUSH_NOTIFICATION: 'HF0C01'


}

