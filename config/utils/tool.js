module.exports = {
  getUserDATA (req) {
    return new Promise((resolve, reject) => {
      let xmldata = '';
      req.on('data', data => {
        console.log(data);
        xmldata += data.toString();
      }).on('end', () => {
        resolve(xmldata);
      })
    })

  }

}