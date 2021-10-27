const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");
const Files = require('./../models/files');

router.post('/', (req, res) => {

    var fileName = fileUrl.split('/')[3];

    var fileUrl;
    for(var myKey in req.body) {
        fileUrl=myKey;
     }

    let dpls3 = new AWS.S3({
        accessKeyId: process.env.AwsAccessKeyId,
        secretAccessKey: process.env.AwsSecretAccessKey,
        region: process.env.region
    });

    var func = {
        Bucket: process.env.bucketName,
        Delete: {
            Objects: [
              {
                Key: fileName 
              },
            ],
          }
    };

    dpls3.deleteObjects(func, function(err, data) {
        if (!err) {
            req.flash('success_msg','File has been Deleted');
            res.redirect('/admin');
            Files.deleteOne({ fileUrl: fileUrl }, function (err) {
                if (err) {
                    return err;
                }
                else{
                    console.log('File has been deleted from the storage');
                }
                
              });
        }
        else if(err) {
            res.status(500).json({error: true, Message: err});
            
        }      
    });
});

module.exports = router;