import {combineReducers} from 'redux';

import ScheduleInspection from './ScheduleInspection';
import ReportReducer from './ReportInspection';
import ReinforcementData from './ReinforcementData';
import SignupReducer from './SignUpreducer';

const reducers = combineReducers({
  SignUp: SignupReducer,
  ScheduleInspection: ScheduleInspection,
  ReportInspection: ReportReducer,
  ReinforcementData: ReinforcementData,
});

export default reducers;
