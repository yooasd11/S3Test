const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ region: 'ap-northeast-2' });

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});


async function main() {

    const bucketsResult = await s3.listBuckets().promise();

    const firstBucket = bucketsResult.Buckets[0];
    // call S3 to retrieve upload file to specified bucket
    
    // Configure the file stream and obtain the upload parameters
    const filename = 'input.txt';
    const fileStream = fs.readFileSync(filename);

    const uploadParams = {
        Bucket: firstBucket.Name,
        Key: filename,
        Body: fileStream,
    };
    
    await s3.upload(uploadParams).promise();
}

main();