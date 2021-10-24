import {ACTIONSIGNUP} from '../Actions/SignUpAction';

const InitialState = {
  PhoneNumber: '',
  otp: '',
  //OTP Screen
  otp1: '',
  otp2: '',
  otp3: '',
  otp4: '',
  otp5: '',
  otp6: '',

  mobileno: '',

  fromScreen: '',
  spinnerBool: false,

  ReinforcementData: [],

  QualityInspectionData: [
    {id: 1, name: 'Site Survey Checklist (QIS-1)'},
    {id: 2, name: 'Pre-Exavaction Checklist (QIS-2)'},
    {id: 3, name: 'Earthwork pre-filling Checklist (QIS-3)'},
    {id: 4, name: 'Earth-Filling & Compaction Checklist (QIS-4)'},
    {id: 5, name: 'Reinforcement Checklist (QIS-5)'},
    {id: 6, name: 'Formwork Checklist (QIS-6)'},
    {id: 7, name: 'Concrete Pour Card (QIS-7)'},
    {id: 8, name: 'Formwork Checklist (QIS-8)'},
    {id: 9, name: 'Water Proofing Checklist (QIS-9)'},
  ],
  contractorModal: false,

  //Reinforcemment Inspection
  compiled: false,
  notcompiled: false,

  //preview inspection
  successModal: false,
  InspectionIncompleteModal: false,
  ScheduleInspectionModal: false,

  //Directory
  SelectedOption: 'Employee',

  MyDocsData: [
    {id: 1, name: 'Quality Inspections'},
    {id: 2, name: 'Safety Inspections'},
    {id: 3, name: 'Site Instructions'},
    {id: 4, name: 'Daily Reports'},
    {id: 5, name: 'Site NC Reports'},
  ],

  sitepics: '',

  //
  image: '',
  images: [],
  base64Images: [],

  //reinforcement checklist
  selectMaterialModal: false,
  severityModal: false,
  categoryModal: false,

  checklistAddress: '',
  inspectionQuantity: '',
  UOM: '',
  contractor: '',
  materialData: {},

  //signup
  fullname: '',
  emailid: '',
  signupmobileno: '',
  //  password:'',
  confirmpassword: '',

  //quality checklist

  checklist_id: '',
  checklistName: '',
  validate: false,
  projects: [],
  selectedProject: [],
  checklistQuestions: [],
  checklists: [],
  selectedChecklist: [],
  selectedSafetyChecklist: [],

  scheduledDateTime: '',
  sucessInspectionData: [],
  materialData: [],
  contractorData: [],
  siteDetails: [],

  // Daily Report data
  dailyReportData: {},

  // All Reports
  reports: {},

  // faq data
  faqData: [],

  // site observation data
  areaInspected: '',
  contractorData: {},
  contractorResponsible: '',
  category: '',
  severityLevel: '',
  addObservations: '',
  siteObservationData: {},
  siteObservationChecklist: '',
  siteObservationNote: '',
  siteObservationSuccessData: [],

  // site NCR data
  rootCause: '',
  contractClauseNo: '',
  recommendedCorrectiveAction: '',
  siteNCRChecklist: '',
  siteNCRChecklistNote: '',
  NCReportData: [],
  NCReportSuccessData: [],
  siteNCRChecklistStage2: '',
  siteNCRChecklistNoteStage2: '',

  // pics path
  picturePath: '',

  // category data in site observation and NCR
  otherCategory: '',
  siteCategory: [
    {
      id: 1,
      name: 'Quality',
    },
    {
      id: 2,
      name: 'Safety',
    },
    {
      id: 3,
      name: 'House Keeping',
    },
    {
      id: 4,
      name: 'Other',
    },
  ],
  // severity level in site observation and NCR
  severityLevelData: [
    {
      id: 1,
      level: 'High',
    },
    {
      id: 2,
      level: 'Medium',
    },
    {
      id: 3,
      level: 'Low',
    },
  ],

  projectName: '',
  projectLocation: '',
  inspectionType: '',

  // notification data
  Notifications: [],
  notificationData: {},

  //weather data
  deviceLocation: {},
  weatherEffected: '',
};

function SignupReducer(state = InitialState, action) {
  switch (action.type) {
    case ACTIONSIGNUP:
      return Object.assign({}, state, action.payload);
    default:
      return {
        ...state,
      };
  }
}

export default SignupReducer;
