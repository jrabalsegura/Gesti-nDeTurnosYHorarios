const AWS = require('aws-sdk');


// Configure AWS to use your credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadFileToS3 = async (fileName, content) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: content
    };

    try {
        const stored = await s3.upload(params).promise();
        console.log('File uploaded successfully at', stored.Location);
        return stored.Location;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
};

const uploadSelectedFile = async (fileName, file) => {

  const params = {
      Bucket: process.env.S3_BUCKET_NAME, // Your S3 Bucket name
      Key: `${Date.now()}_${fileName}`, // File name you want to save as in S3
      Body: file.buffer,
      ContentType: file.mimetype
  };

  try {
    const stored = await s3.upload(params).promise();
    return stored.Location;
  } catch(err) {
    console.error('Error uploading file:', err);
    throw err;
  }
  
}

module.exports = {
  uploadSelectedFile,
  uploadFileToS3
}