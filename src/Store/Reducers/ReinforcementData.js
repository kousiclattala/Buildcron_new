import {REINFORCEMENTDATA} from '../Actions/SignUpAction';

const InitialState = {
  reinforcementData: [
    // {
    //   id: 'black-box',
    //   name: 'ReinforcementInspection',
    //   siteDetails: [],
    //   inspectionQuestions: [],
    //   scheduleDateTime: 'Sep 28, 2020',
    // },
  ],
};

const ReinforcementData = (state = InitialState, action) => {
  switch (action.type) {
    case REINFORCEMENTDATA:
      return {
        ...state,
        reinforcementData: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default ReinforcementData;
