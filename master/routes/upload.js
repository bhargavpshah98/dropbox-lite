const multer = require("multer");
const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");
const Files = require('./../models/files');

 const repo = multer.memoryStorage();
 const upload = multer({storage: repo, limits: {fileSize: 10 * 1024 * 1024}}).single('Img');

router.post('/', (req, res) => {

  upload(req, res, (err) => {
      
    const moment = require('moment');    
    var startDate = new Date();
  
    const useremail = req.user.email;
    const username = req.user.name;

    const file = req.file;

    if(file){
      const s3link = process.env.s3Url;
      console.log("Checking the url of s3 storage in aws ",s3link);

      let dpls3 = new AWS.S3({
          accessKeyId: process.env.AwsAccessKeyId,
          secretAccessKey: process.env.AwsSecretAccessKey,
          region: process.env.region
      });

     

      var func = {
          Bucket: process.env.bucketName,
          Key: file.fieldname+('-')+Date.now(),
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read"
      };

      dpls3.upload(func, function (err, data) {
        var cnt = "";

        if (err) {
            res.status(500).json({error: true, Message: err});
        } else {

            req.flash('success_msg','File is successfully Uploaded!');
            res.redirect('/admin');
      
            var endDate   = new Date();
            
            const newFile = new Files({
              user : username,
              email : useremail,
              fileUrl:data.Location,
              fileName: file.originalname,
              fileDesc: file.originalname,
              uploadTime: ((endDate - startDate) / 1000),
              modifiedDate: ((endDate - startDate) / 1000)
          });            
            Files.findOne({ fileName:file.originalname })
            .then( (fileName) => {

                newFile.save()
                .then(file => {
                  console.log('File Uploaded');
              })
              .catch(err=>console.log(err));
            });

        }
    });
    }
    else if(!file){
      req.flash('error_msg','Please select a file');
      res.redirect('/admin');
    }  
  });
});

module.exports = router;