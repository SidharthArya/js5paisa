module.exports.HEADERS = {'Content-Type': 'application/json'}

module.exports.GENERIC_PAYLOAD = {
    "head": {
        "key": "",
    },
    "body": {
        "ClientCode": ""
    }
}

module.exports.LOGIN_PAYLOAD = {"head": {
    "appName": "",
    "appVer": "1.0",
    "key": "",
    "osName": "WEB",
    "requestCode": "5PLoginV2",
    "userId": "",
    "password": ""
},
    "body":
    {
    "Email_id": "",
    "Password": "",
    "LocalIP": "192.168.10.10",
    "PublicIP": "192.168.10.10",
    "HDSerailNumber": "",
    "MACAddress": "",
    "MachineID": "039377",
    "VersionNo": "1.7",
    "RequestNo": "1",
    "My2PIN": "",
    "ConnectionType": "1"
    }
}

module.exports.LOGIN_CHECK_PAYLOAD={
    "head" : {
        "requestCode":"5PLoginCheck",
        "key":"",
        "appVer":"1.0",
        "appName":"",
        "osName":"WEB",
        "LoginId":""
        },
    "body":{
        "RegistrationID":""
        }
    }

module.exports.WS_PAYLOAD={"Method":"",
            "Operation":"",
            "ClientCode":"",
            "MarketFeedData":""}

module.exports.JWT_HEADERS={
    'Ocp-Apim-Subscription-Key': 'c89fab8d895a426d9e00db380b433027',
    'x-clientcode':"",
    'x-auth-token':""
    }

module.exports.JWT_PAYLOAD={
    "ClientCode":"",
    "JWTToken":""
    }
module.exports.SOCKET_DEPTH_PAYLOAD={
            "operation":"",
            "method":"",
            "instruments":""}

module.exports.SUBSCRIPTION_KEY="c89fab8d895a426d9e00db380b433027"
module.exports.today = new Date()
module.exports.TODAY_TIMESTAMP = (module.exports.today).toString().slice(0, 10)
module.exports.next_date = module.exports.today;
module.exports.next_date.setDate(module.exports.next_date.getDate() + 1);

module.exports.NEXT_DAY_TIMESTAMP = module.exports.next_date.toString().slice(0, 10)
