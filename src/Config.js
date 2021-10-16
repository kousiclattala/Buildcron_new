import {AsyncStorage} from 'react-native';

var routes = {
  // base: 'http://3.7.26.46:8000/',

  baseUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api',

  otpRequestUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api/request/otp',

  otpVerifyUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/accounts/api/verify/otp',

  projectUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project',

  checkListUrl:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project',

  faqAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/api/faq/list_or_create',

  siteObservationAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/site/observation/list_or_create',

  NCReportAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/ncr/list_or_create',

  // TODO: when using add checklist name at the end
  inspectionAPI:
    'http://ec2-52-66-198-112.ap-south-1.compute.amazonaws.com/buildcron/mob/api/project/inspection',

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
