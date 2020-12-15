const express = require("express");
const router = express.Router();
const jsSHA = require("jssha");
const { getUserDATA, parsexmlasync } = require('../utils/tool');
module.exports = () => {
  return async (req, res, next) => {
    console.log(req.query);
    const token =
      "miaoxiaomenghetuxiaoji";
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    let signature = req.query.signature, //微信加密签名
      timestamp = req.query.timestamp, //时间戳
      nonce = req.query.nonce, //随机数
      echostr = req.query.echostr; //随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    let array = [token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    let tempStr = array.join("");
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(tempStr);
    let scyptoString = shaObj.getHash("HEX");
    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    // if (signature === scyptoString)
    // {
    //   res.send(echostr);
    // } else
    // {
    //   console.log("验证失败");
    //   res.send("验证失败");
    // }
    if (req.method === 'GET')
    {
      if (signature === scyptoString)
      {
        res.send(echostr);
      } else
      {
        console.log("验证失败");
        res.end("验证失败");
      }
    } else if (req.method === 'POST')
    {
      //验证消息来自于微信服务器
      if (signature !== scyptoString)
      {
        res.end("error");
      } else
      {
        console.log(req.query);
      }
      const xmldata = await getUserDATA(req);
      console.log(xmldata);
      const jsondata = await parsexmlasync(xmldata);
      console.log(jsondata);
      console.log(jsondata.xml.Content[0]);
      let content = "";
      if (jsondata.xml.MsgType[0] == "text")
        console.log("11");
      {
        if (jsondata.xml.Content[0] == "1")
        {
          console.log("12");
          content = "大吉大利，今晚吃鸡";
        } else if (jsondata.xml.Content[0] == "2")
        {
          content = "落地成核";
        } else if (jsondata.xml.Content[0].match("爱"))
        {
          content = "我爱你，兔小鸡"
        } else
        {
          content = "你在说什么呀，难为小鸡我了"
        }
      }
      let replay = `<xml>
      <ToUserName><![CDATA[${jsondata.xml.FromUserName[0]}]]></ToUserName>
      <FromUserName><![CDATA[${jsondata.xml.ToUserName[0]}]]></FromUserName><CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${content}]]></Content></xml>`;
      res.send(replay);
      res.end('');
    } else
    {
      res.end("error");
    }
  }
}