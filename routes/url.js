const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortId = require('shortid');
const config = require('config');

const Url = require('../models/url');

router.post('/shorten', async(req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get('baseUrl');

  if(!validUrl.isUri(baseUrl)){
    return res.status(401).json('Invalid base url');
  }

  //create url code
  const urlCode = shortId.generate();

  //check long url
  if(validUrl.isUri(longUrl)){
    try{
      let url = await Url.findOne({ longUrl });
      if(url){
        res.send(url.shortUrl);
      }else{
        const shortUrl = baseUrl + '/' + urlCode;
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        });
        await url.save(() => {
          res.send(url.shortUrl);
        });
        console.log(url);
      }
    }catch(err){
      console.error(err);
      res.status(500).json('Server error');
    }
  }else{
    res.status(401).json('Invalid long url');
  }

});




module.exports = router;
