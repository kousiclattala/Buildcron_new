export const ACTIONSIGNUP = 'ACTIONSIGNUP';
export const SCHEDULEINSPECTION = 'SCHEDULEINSPECTION';
export const REPORTDATA = 'REPORTDATA';
export const REINFORCEMENTDATA = 'REINFORCEMENTDATA';

const getActionSignUp = (data) => {
  return {
    type: ACTIONSIGNUP,
    payload: data,
  };
};

export const ActionSignUp = (data) => {
  return (dispatch) => {
    dispatch(getActionSignUp(data));
  };
};

const getScheduleInspection = (data) => {
  return {
    type: SCHEDULEINSPECTION,
    payload: data,
  };
};

export const ScheduleInspection = (data) => {
  return (dispatch) => {
    dispatch(getScheduleInspection(data));
  };
};

const getReportData = (data) => {
  return {
    type: REPORTDATA,
    payload: data,
  };
};

export const ReportData = (data) => {
  return (dispatch) => {
    dispatch(getReportData(data));
  };
};

const getReinforcementData = (data) => {
  return {
    type: REINFORCEMENTDATA,
    payload: data,
  };
};

export const ReinforcementData = (data) => {
  return (dispatch) => {
    dispatch(getReinforcementData(data));
  };
};
