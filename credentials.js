const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

class Credentials {
  constructor() {
    this.creds = {
    "pass": "",
    "email": "",
    "pin": "",
    "appName": "",
    "appSource": "",
    "userId": "",
    "password": "",
    "userKey": "",
    "encryptionKey": "",
    "dob": ""
    }
  }
  
  async getCreds() {
    if (process.platform == 'darwin' && fs.existsSync("/opt/homebrew/bin/pass")) {
      await this.getCredsFromPass();
      }
    }
  

  async getCredsFromPass() {
    const { stdout, stderr } = await exec("pass " + process.env.PASS_KEY);
    for (const line of stdout.split("\n")) {
      if (line == '---') continue;
      const parts = line.split(":");
      if (parts.length > 1)
	this.creds[parts[0].trim()] = parts[1].trim();
      else
	this.creds["pass"] = line.trim();
    }
  }
}


const getCreds = async () => {
  const creds = new Credentials();
  await creds.getCreds();
  return creds.creds;
}

module.exports = { getCreds }
