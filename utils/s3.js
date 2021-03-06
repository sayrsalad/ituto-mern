require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const ErrorResponse = require('../utils/errorResponse');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3
function uploadFile(file, dir) {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: dir + file.filename
    }

    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

// delete a file to s3
function deleteFile(file) {
    var params = {
        Bucket: bucketName,
        Key: file
    };
    
    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);  // error
        else return true;                 // deleted
    });

}
exports.deleteFile = deleteFile


// downloads a file from s3
async function getFileStream(dir, fileKey, next) {
    try {
        console.log(dir + fileKey);
        const downloadParams = {
            Key: dir + fileKey,
            Bucket: bucketName
        }

        file = s3.getObject(downloadParams).createReadStream()
            .on('error', (err) => {
                next(new ErrorResponse('File not found', 404));
            });

        return file;
    } catch (error) {

    }
}
exports.getFileStream = getFileStream

function download(dir, filename) {
    // const file = s3.getObject({ Bucket: bucketName, Key: dir + filename });

    // console.log(file);

    return s3.getObject({ Bucket: bucketName, Key: dir + filename }).promise();
}
exports.download = download