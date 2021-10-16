import React from 'react';
import { AsyncStorage, Platform, Alert, ToastAndroid } from 'react-native';
// import _ from 'underscore';
//import Config from '../Config';

var Utils = function () { };

const passwordLength = 8;

Utils.prototype.isValidNumber = function (value, type) {
    let response = {};
    if (value) {
        value = value.trim();
        if (/^[0-9]+(\.\d{0,2})*$/.test(Number(value))) {
            response.status = true;
            response.message = value.trim();
        } else {
            response.status = false;
            response.message = 'Please enter valid ' + type;
        }
    } else {
        response.status = false;
        response.message = 'Please enter ' + type;
    }
    return response;
}

Utils.prototype.isValidPincode = function (pincode) {
    let response = {};
    if (pincode) {
        pincode = pincode.trim();
        if (/^[0-9]*$/.test(Number(pincode)) && pincode.toString.length === 6) {
            response.status = true;
            response.message = pincode.trim();
        } else {
            response.status = false;
            response.message = 'Please enter valid pincode';
        }
    } else {
        response.status = false;
        response.message = 'Please enter pincode';
    }
    return response;
}

Utils.prototype.isValidEmail = function (email) {
    let response = {};
    if (email) {
        email = email.trim();
        if (/^\S+@\S+\.\S+/.test(email)) {
            response.status = true;
            response.message = email.toLowerCase().trim();
        } else {
            response.status = false;
            response.message = 'Please enter valid mail Id';
        }
    } else {
        response.status = false;
        response.message = 'Please enter mail Id';
    }
    return response;
};

// Utils.prototype.isValidIndianMobile = function (phoneNumber) {
//     let response = {};
//     if (phoneNumber) {
//         phoneNumber = phoneNumber.toString().trim();
//         if (/^[6-9][0-9]*$/.test(Number(phoneNumber))) {
//             if (phoneNumber.toString().length >= 10) {
//                 response.status = true;
//                 response.message = phoneNumber.trim();
//             } else {
//                 response.status = false;
//                 response.message = 'Please enter valid mobile number';
//             }
//         } else {
//             response.status = false;
//             response.message = 'Please enter valid mobile number';
//         }
//     } else {
//         response.status = false;
//         response.message = 'Please enter mobile number';
//     }
//     return response;
// }


Utils.prototype.isValidIndianMobile = function(phoneNumber) {
    let response = {};
    if (phoneNumber) {
        phoneNumber = phoneNumber.toString().trim();
        if (/^\+?([0-9]{1})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/.test(Number(phoneNumber))){
        
            if (phoneNumber.toString().length >= 10) {
                response.status = true;
                response.message = phoneNumber.trim();
            } else {
                response.status = false;
                response.message = 'Please enter valid mobile number';
            }
        } else {
            response.status = false;
            response.message = 'Please enter valid mobile number';
        }
    } else {
        response.status = false;
        response.message = 'Please enter mobile number';
    }
    return response;
}
Utils.prototype.isValidInternationalMobile = function (phoneNumber) {
    let response = {};
    if (phoneNumber) {
        phoneNumber = phoneNumber.trim();
        if (/^[1-9][0-9]*$/.test(Number(phoneNumber))) {
            if (phoneNumber.toString().length >= 10 && phoneNumber.toString().length <= 16) {
                response.status = true;
                response.message = phoneNumber.trim();
            } else {
                response.status = false;
                response.message = 'Please enter valid mobile number';
            }
        } else {
            response.status = false;
            response.message = 'Please enter valid mobile number';
        }
    } else {
        response.status = false;
        response.message ='Please enter mobile number';
    }
    return response;
}

Utils.prototype.isValidNoun = function (value, nounType) {
    let response = {};
    if (value && value.length) {
        value = value.trim();
        if (/^[A-Za-z ]+$/.test(value)) {
            response.status = true;
            response.message = value.charAt(0).toUpperCase() + value.substr(1).trim();
        } else {
            response.status = false;
            response.message = 'Please enter valid name';
        }
    } else {
        response.status = false;
        response.message = 'Please enter ' + nounType;
    }
    return response;
}

Utils.prototype.isValidWebsite = function (site) {
    let response = {};
    // http://www.fas.com  Example Site Link
    if (site) {
        site = site.trim();
        if (/(ftp|http|https|Https|Http):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(site)) {
            response.status = true;
            response.message = site.trim();
        } else {
            response.status = false;
            response.message = 'Please enter valid website';
        }
    } else {
        response.status = false;
        response.message = 'Please enter website';
    }
    return response;
}

Utils.prototype.isEmpty = function (value, dataName) {
    let response = {};
    if (value) {
        value = value.trim();
        response.status = true;
        response.message = value.trim();
    } else {
        response.status = false;
        response.message = 'Please enter ' + dataName;
    }
    return response;
}

Utils.prototype.isValidPassword = function (value) {
    let response = {};
    if (value) {
        if (value.length >= passwordLength) {
            if (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$% ^&*]{8,30}$/.test(value)) {
                response.status = true;
                response.message = value;
            } else {
                response.status = false;
                response.message = 'Password should contain atleast one alphabet, numeric and one special character';
            }
        } else {
            response.status = false;
            response.message = 'Password should be minimum ' + passwordLength + ' characters';
        }
    } else {
        response.status = false;
        response.message = 'Please enter password';
    }
    return response;
}

Utils.prototype.isValidCPassword = function (pass1, pass2) {
    let response = {};
    if (pass1) {
        if (pass2) {
            if (pass2.length >= passwordLength) {
                if (pass1 === pass2) {
                    response.status = true;
                    response.message = pass1;
                } else {
                    response.status = false;
                    response.message = 'Password and confirm password mismatch';
                }
            } else {
                response.status = false;
                response.message = 'Confirm password should be minimum ' + passwordLength + ' characters';
            }
        } else {
            response.status = false;
            response.message = 'Please enter confirm password';
        }
    } else {
        response.status = false;
        response.message = 'Please enter password';
    }
    return response;
}

Utils.prototype.makeNown = function (noun) {
    if (noun) {
        return noun.charAt(0).toUpperCase() + noun.substr(1);
    }
}

Utils.prototype.getToken = function (key, callBack) {
    AsyncStorage.getItem('pay9$:' + key, (err, resp) => {
        if (err)
            callBack('Error fetching token', false);
        else
            callBack(JSON.parse(resp), true);
    });
};

Utils.prototype.setToken = function (key, value, callBack) {
    AsyncStorage.setItem('pay9$:' + key, JSON.stringify(value), (err) => {
        if (err)
            callBack('Error setting token', false);
        else
            callBack(null, true);
    });
};

// Pass '' if no need of ok click  and pass 'alert' if you need alert for Android also

Utils.prototype.dialogBox = function (msg, onOkClick) {
    if (onOkClick === '') {
        if (Platform.OS === 'ios') {
            return Alert.alert('',
                msg,
                [
                    {
                        text: 'OK',
                    },
                ],
                { cancelable: true }
            )
        } else {
            return ToastAndroid.showWithGravityAndOffset(
                msg,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    } else if (onOkClick === 'alert') {
        return Alert.alert('',
            msg,
            [{
                text: 'OK',
            },],
            { cancelable: false }
        )
    } else {
        return Alert.alert('',
            msg,
            [{
                text: 'OK', onPress: onOkClick
            },],
            { cancelable: false }
        )
    }
}

//Use this for rendering price which will add two digits after decimal and here if second param is true thenn will render symbol if not without symbol
Utils.prototype.renderPrice = function (price, symbolBool) {
    if (price) {
        price = price.toString();
        if (price.toString().length) {
            if (symbolBool) {
                return '₹ ' + Number(price).toFixed(2)
            } else {
                return Number(price).toFixed(2)
            }
        }
    } else {
        if (Number(price) === 0) {
            if (symbolBool) {
                return '₹ ' + Number(price).toFixed(2)
            } else {
                return Number(price).toFixed(2)
            }
        }
    }
}

// @author: A.Maneesh
// @date: 30/04/2019 07:16
// @Description: Used to render date as per provided format which is a string where format will have 3 params as dd,mm,yy,half,full
Utils.prototype.renderDateFormat = function (data, format) {
    var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let date = new Date(data)
    let d = date.getDate();
    d = d <= 9 ? '0' + d : d;
    let m = date.getMonth() + 1;
    m = m <= 9 ? '0' + m : m;
    let y = date.getFullYear();
    let result = format;
    result = result.split('dd').join(d)
    result = result.split('mm').join(m)
    result = result.split('half').join(mS[date.getMonth()])
    result = result.split('full').join(mL[date.getMonth()])
    result = result.split('yy').join(y)
    return result;
}

// @author: A.Maneesh
// @date: 16/05/2019 14:14
// @Description: Using to renderTime as of required format
//Caution:-- use this only when you have tz date format
//Params are hh,mm,ss,ampm,AMPM,AmPm
Utils.prototype.renderTimeFormat = function (date, format) {
    var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    var d = new Date(date);
    // d.setTime(d.getTime() - d.getTimezoneOffset() *  60 * 1000);
    // console.log(d,"    after   ")
    // // var nd = new Date(d + (3600000*indiaTime.toLocaleString()));
    // console.log(d,"    after  indianTime offset   ")
    // // var utc = d;
    // // let d = slotTime;
    // // d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000)
    // // var finalDate = new Date(d);
    var finalDate = d;
    var hours = finalDate.getHours();
    var minutes = finalDate.getMinutes();
    var seconds = finalDate.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    var AMPM = hours >= 12 ? 'PM' : 'AM';
    var AmPm = hours >= 12 ? 'Pm' : 'Am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    result = format;
    result = result.split('hh').join(hours)
    result = result.split('mm').join(minutes)
    result = result.split('ss').join(seconds)
    result = result.split('ampm').join(ampm)
    result = result.split('AMPM').join(AMPM)
    result = result.split('AmPm').join(AmPm)
    return result;
}

export default new Utils();