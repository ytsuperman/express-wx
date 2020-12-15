var fs = require('fs')
const { appID, appsecret } = require("../config");
const rp = require('request-promise-native');
const { resolve } = require('path');
class wechat {
  constructor() { }
  getAccessToken () {
    console.log(appID, appsecret);
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    //发送请求
    return new Promise((resolve, reject) => {
      rp({ method: 'GET', url, json: true }).then(res => {
        console.log(res);
        // 设置 access_token的过期时间
        res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
        console.log(res);
        resolve(res);
      }).catch(err => {
        console.log(err);
        reject(err);
      })
    })
  }
  saveAccessToken (access_token) {
    return new Promise((resolve, reject) => {
      access_token = JSON.stringify(access_token);
      fs.writeFile("./access_token.txt", access_token, err => {
        if (!err)
        {
          console.log("chenggong");
          resolve()
        } else
        {
          console.log("shibai");
          reject(err);
        }
      });
    });
  }
  readAccessToken () {
    return new Promise((resolve, reject) => {
      fs.readFile("./access_token.txt", (err, data) => {
        if (!err)
        {
          console.log("chenggong");
          data = JSON.parse(data);
          resolve(data)
        } else
        {
          console.log("shibai");
          reject(err);
        }
      });
    });
  }
  isValidAccessToken (data) {
    if (!access_token && !data.access_token && !data.expires_in)
    {
      return false
    }
    if (data.expires_in < Data.now())
    {
      return false
    } else
    {
      return true
    }
  }
  //获取没有国企的access_Token
  fetchAccessToken () {
    return new Promise((resolve, reject) => {
      wx.readAccessToken()
        .then(res => {

          if (wx.isValidAccessToken(res))
          {
            resolve(res)
          } else
          {
            wx.getAccessToken()
              .then(res => {
                wx.saveAccessToken(res)
                  .then(() => {
                    resolve(res)
                  })
              }).catch()
          }
        })
        .catch(err => {
          wx.getAccessToken()
            .then(res => {
              wx.saveAccessToken(res)
                .then(() => {
                  resolve(res)
                })
            }).catch()
        })
    }).then(res => {
      console.log(res);
    })
  }

}

const wx = new wechat();

new Promise((resolve, reject) => {
  wx.readAccessToken()
    .then(res => {

      if (wx.isValidAccessToken(res))
      {
        resolve(res)
      } else
      {
        wx.getAccessToken()
          .then(res => {
            wx.saveAccessToken(res)
              .then(() => {
                resolve(res)
              })
          }).catch()
      }
    })
    .catch(err => {
      wx.getAccessToken()
        .then(res => {
          wx.saveAccessToken(res)
            .then(() => {
              resolve(res)
            })
        }).catch()
    })
}).then(res => {
  console.log(res)
})


