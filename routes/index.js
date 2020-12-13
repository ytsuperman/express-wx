const express = require("express");
const router = express.Router();
const jsSHA = require("jssha");
/**
 * 授权验证
 */
router.get("/", function (req, res, next) {
  console.log(req);
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
  console.log(signature, scyptoString)
  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (signature === scyptoString)
  {
    console.log("验证成功");
    console.log(echostr);
    res.send(echostr);
    console.log("yanzhengchengg ");
  } else
  {
    console.log("test");
    console.log("验证失败");
    res.send("验证失败");
  }
});
module.exports = router;