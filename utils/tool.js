const { parseString } = require("xml2js");
module.exports = {
  getUserDATA (req) {
    return new Promise((resolve, reject) => {
      let xmldata = '';
      req.on('data', data => {
        console.log(data);
        xmldata += data
      }).on('end', () => {
        resolve(xmldata);
      })
    })

  },
  parsexmlasync (xmldata) {
    return new Promise((resolve, reject) => {
      parseString(xmldata, { trim: true }, (err, data) => {
        if (!err)
        {
          resolve(data);
        } else
        {
          reject("解析异常" + err)
        }
      });
    });

  }

}