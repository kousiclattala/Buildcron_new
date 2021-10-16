import {SCHEDULEINSPECTION} from '../Actions/SignUpAction';

const InitialState = {
  reScheduledInspectionData: [
    // {
    //   id: 'black-box',
    //   name: 'ReinforcementInspection',
    //   siteDetails: [],
    //   inspectionQuestions: [],
    //   scheduleDateTime: 'Sep 28, 2020',
    // },
  ],
};

const ScheduleInspection = (state = InitialState, action) => {
  switch (action.type) {
    case SCHEDULEINSPECTION:
      return {
        ...state,
        reScheduledInspectionData: [
          ...state.reScheduledInspectionData,
          action.payload,
        ],
      };
    default:
      return {
        ...state,
      };
  }
};

export default ScheduleInspection;
