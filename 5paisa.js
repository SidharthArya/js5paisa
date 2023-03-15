const crypto = require('crypto');
const { Market } = require('./market.js');
const credentials = require('./credentials.js');
const urlconst = require('./urlconst.js');
const consts = require('./consts.js');

const iv = Buffer.from([83, 71, 26, 58, 54, 35, 22, 11,
                         83, 71, 26, 58, 54, 35, 22, 11]);


class p5 {
  constructor(creds) {
    this.creds = creds;
    this.logged_in = false;
    this.enc_key = this.creds["encryptionKey"];
    this.email = this.creds['email'];
    this.passwd = this.creds['pass'];
    this.dob = this.creds['dob'];
    this.client_code = ""
    this.Jwt_token = ""
    this.Aspx_auth = undefined
    this.web_url= undefined
    this.market_depth_url= undefined
    this.Res_Data= undefined
    this.ws= undefined; 
    this.headers = {'Content-Type': 'application/json'};
    this.access_token= ""
    this.APP_SOURCE=this.creds["appSource"];
    this.APP_NAME=this.creds["appName"];
    this.USER_ID=this.creds["userId"];
    this.PASSWORD=this.creds["password"];
    this.USER_KEY=this.creds["userKey"];
    this.payload = consts.GENERIC_PAYLOAD;
    this.login_payload = consts.LOGIN_PAYLOAD;
    }
  padAndConvertToBytes = async (text) => Buffer.from(text+String.fromCharCode(16-text.length % 16).repeat(16-text.length % 16), 'utf8');

  encrypt = async (text) => {
    const paddedText = this.padAndConvertToBytes(text);
    const aesiv = crypto.pbkdf2Sync(this.enc_key, iv, 1000, 16, "sha1")
    const aeskey = crypto.pbkdf2Sync(this.enc_key, iv, 1000, 64, "sha1").slice(16, 48)
    const algorithm = "aes-256-cbc";
    const cipher = crypto.createCipheriv(algorithm, aeskey, aesiv);
    let encryptedData = cipher.update(text, "utf-8", "base64");
    encryptedData += cipher.final("base64");
    return encryptedData;
  };

  login = async () => {
    const secret_email = await this.encrypt(this.email);
    let secret_passwd = await this.encrypt(this.passwd)
    let secret_dob = await this.encrypt(this.dob)
    this.login_payload["body"]["Email_id"] = secret_email
    this.login_payload["body"]["Password"] = secret_passwd
    this.login_payload["body"]["My2PIN"] = secret_dob
    this.login_payload["head"]["requestCode"] = "5PLoginV4"
    this.login_payload["head"]["appName"] = this.APP_NAME
    this.login_payload["head"]["key"] = this.USER_KEY
    this.login_payload["head"]["userId"] = this.USER_ID
    this.login_payload["head"]["password"] = this.PASSWORD  
    let result = await fetch("https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V4/LoginRequestMobileNewbyEmail", 
	{
	    method: "POST", 
	    headers: this.headers,
	    body: JSON.stringify(this.login_payload)

	});
    let data = await result.json();
    this.Jwt_token = data.body.JWTToken;
    this.access_token = this.Jwt_token;
    if (!data.body.message)
      this.logged_in = true;
    this.client_code = data.body.ClientCode;
    console.log(this.client_code);
    return result.body.stream;
    };

  async _user_info_request(data_type){
    let payload = consts.GENERIC_PAYLOAD
    payload["body"]["ClientCode"] = this.client_code
    payload["head"]["key"] = this.USER_KEY
    this.headers["Authorization"] = 'Bearer ' + this.access_token
    let return_type = "";
    let url = "";
    if (data_type == "MARGIN") {
        url = urlconst.MARGIN_ROUTE
        return_type = "EquityMargin"
    }
    else if (data_type == "ORDER_BOOK") {
        url = urlconst.ORDER_BOOK_ROUTE
        return_type = "OrderBookDetail"
    }
    else if (data_type == "HOLDINGS") {
        url = urlconst.HOLDINGS_ROUTE
        return_type = "Data"
    }
    else if (data_type == "POSITIONS") {
        url = urlconst.POSITIONS_ROUTE
        return_type = "NetPositionDetail"
    }
    else if (data_type == "IB") {
        url = urlconst.IDEAS_ROUTE
        return_type = "Data"
    }
    else if (data_type == "IT") {
        url = urlconst.IDEAS_ROUTE
        return_type = "Data"
    }
    let response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload)
    });
    let d = await response.json();
    console.log(d.body.EquityMargin);
    data = response["body"][return_type]
    return data
  }

  async fetch_market_feed(req_list) {
	this.payload["body"]["MarketFeedData"] = req_list
	let date = (new Date()).toString().slice(0, 10)
        this.payload["body"]["ClientLoginType"] = 0
        this.payload["body"]["LastRequestTime"] = "/Date(" + date + ")/"
        this.payload["body"]["RefreshRate"] = "H"
	this.payload["head"]["requestCode"] = "5PMF"
        this.payload["body"]["COUNT"]=this.client_code
	this.payload["body"]["ClientCode"] = this.client_code
        this.payload["head"]["key"] = this.USER_KEY
	this.headers["Authorization"] = 'Bearer ' + this.access_token
	this.payload["body"]["MarketFeedData"] = req_list
        this.payload["body"]["ClientLoginType"] = 0
        this.payload["body"]["LastRequestTime"] = "/Date(" + date + ")/"
        this.payload["body"]["RefreshRate"] = "H"
	let url = urlconst.MARKET_FEED_ROUTE;
	let res = await fetch(url, {
	    method: "POST",
	    headers: this.headers,
	    body: JSON.stringify(this.payload)
	});
	console.log(await res.text());
    }
}

// const main = async () => {
//   const creds = await credentials.getCreds();
//   const c = new p5(creds);
//   await c.login();
//   req_list= []
//   await c._user_info_request("MARGIN");
//   // await c.fetch_market_feed(req_list);
// }
// 
// function main_p() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(main());
//         }, 1000);
//     });
// }
// main_p()
