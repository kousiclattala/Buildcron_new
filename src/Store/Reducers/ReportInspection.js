import {REPORTDATA} from '../Actions/SignUpAction';

const InitialState = {
  reportData: [],
};

const ReportReducer = (state = InitialState, action) => {
  switch (action.type) {
    case REPORTDATA:
      return Object.assign({}, state, action.payload);

    default:
      return {
        ...state,
      };
  }
};

export default ReportReducer;
