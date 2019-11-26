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

  //creating unique url code
  const urlCode = shortId.generate();

  //checking if longUrl is valid                                                                                                                       l
  if(validUrl.isUri(longUrl)){
    try{
      let url = await Url.findOne({ longUrl }); // doing findOne for longUrl because it's the first entry to DB
      // if there is a url obj send the shortUrl
      if(url){
        res.send(url.shortUrl);
      // if not create a new data entry
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
