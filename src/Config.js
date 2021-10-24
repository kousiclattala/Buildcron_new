import {AsyncStorage} from 'react-native';

var routes = {
  // base: 'http://3.7.26.46:8000/',

  baseUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api',

  otpRequestUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api/request/otp',

  //TODO: Note: add mobilenumber at the end
  otpURL:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api/send',

  otpVerifyUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api/verify/otp',

  projectUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project',

  // TODO: Note: add project id at the end
  specificProject:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project/read',

  // TODO: Note: when using add checklist name at the end
  inspectionAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project/inspection',

  checkListUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project',

  faqAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/api/faq/list_or_create',

  siteObservationAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/site/observation/list_or_create',

  //TODO: add id at the end of url
  siteObservationPUTAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/site/observation/rud',

  NCReportAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/ncr/list_or_create',

  //TODO: add id at the end of url
  NCReportPUTAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/ncr/rud',

  approverGetAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/approver',

  // TODO: when using add id at the end
  approverPutAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/approver/rud',

  //php apis

  //  base :"https://taskanalogit.co/api/",
};

var Credencials = {
  // razorpayId : "rzp_test_p3tUYWP2p6iB0z"
};

export default {routes, Credencials};
