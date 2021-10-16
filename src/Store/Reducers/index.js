import {combineReducers} from 'redux';

import SignUpreducer from './SignUpreducer';
import ScheduleInspection from './ScheduleInspection';
import ReportReducer from './ReportInspection';
import ReinforcementData from './ReinforcementData';

const reducers = combineReducers({
  SignUp: SignUpreducer,
  ScheduleInspection: ScheduleInspection,
  ReportInspection: ReportReducer,
  ReinforcementData: ReinforcementData,
});

export default reducers;
