const S3 = require('aws-sdk/clients/s3');

module.exports = async(bucket, filePath) => {
  const s3 = new S3();
  const rules = require(filePath);
  try {
    return await Promise.all(
      rules.map(rule => new Promise((resolve, reject) => {
        const params = {
          Bucket: bucket,
          Key: rule.key,
          WebsiteRedirectLocation: rule.to
        };
        s3.putObject(params, (err, data) => {
          if (err) reject(err);
          else     resolve(data);
        });
      }))
    );
  } catch (e) {
    process.exit(1);
  }
};