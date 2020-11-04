const AWS = require('aws-sdk');
const fs = require('fs');

const sts = new AWS.STS({ region: 'ap-northeast-2', apiVersion: '2011-06-15' });

async function main() {
    const roleToAssume = {
        RoleArn: 'arn:aws:iam::214348340191:role/ec2_s3_full',
        RoleSessionName: 'session1',
        DurationSeconds: 900,
    };

    const roleResult = await sts.assumeRole(roleToAssume).promise();
    console.log('credential result : ', roleResult.Credentials);
    const { AccessKeyId, SecretAccessKey, SessionToken } = roleResult.Credentials;

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        region: 'ap-northeast-2',
        credentials: { 
            accessKeyId: AccessKeyId,
            secretAccessKey: SecretAccessKey,
            sessionToken: SessionToken,
        },
    });
    
    const bucketsResult = await s3.listBuckets().promise();
    const firstBucket = bucketsResult.Buckets[0];
    console.log('bucket : ', firstBucket);
    
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