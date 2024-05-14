const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
// require("dotenv").config({ path: "../.env" });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file, fileName, fileType) {
  const params = {
    Bucket: "instant-messaging-academic",
    Key: fileName,
    Body: file,
    ContentType: fileType,
  };
  try {
    const data = await s3.send(new PutObjectCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
    return err;
  }
}
async function getSignedUrlForS3Object(fileName) {
  const signedUrl = getSignedUrl({
    url: `https://d3v97zzz1uf21c.cloudfront.net/${fileName}`,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000*24),
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
  });
  return signedUrl;
}

// const img = Buffer.from(
//   ",/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAyADIDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAgBAwQGBwUC/8QALxAAAgEDAwIEBQMFAAAAAAAAAQIDAAQRBRIhBjEHIkFREzJSYZEUQnEzQ4GSsf/EABkBAAIDAQAAAAAAAAAAAAAAAAADAQIEBv/EAC0RAAEDAgQFAAsAAAAAAAAAAAEAAhEDIQQTMUEFEiJR8AYyYXFygZGSobHB/9oADAMBAAIRAxEAPwCUNCQASeAKo7BVLMQFAySfQVzfxJ6pttGDXN7cbbSJN0cSyECTP9wlecc4AGSTwKQTCfSp5hMmAFu17r+mWZxNdrv+iNWkb8KCas2fU2k3coijuikh7LNE8Wf9gKj+vVXXPUEEM2g2FvY6bMcxz3UyxjZ9fwkO7b7ckmrra14j6FeyF4bXVrONAzyWkhDA/SEkJy3GQB+aL7kT70h3EeGsdluf1fEP1H9UkYpUlQNE6uvuDX3XGOjvEtNY06SbSI3mnUlGgQBF34PLA/IR3xk5Hy5xW/eH9/q+pabNc61JA5Zx8IQx4VRzkBv388ZwMEGpaHR1WKms5tOo1gkh0wdrbH2raaUpUqVhaxIUsnAC+fy8+2CT/wAqIviTeXPUHWy20Vs89ja3EKSRRSKmZHy/K9yBGp9gCx9+ZY9U24uNHm+bMZD5V2UgA88gg9s1EDWba80vxGnW006S8vZyhTEmMxCPY65PruQHcT6fem4emOfMcbDwrPiajzTdRoiXkWHc3iPOy6rpt3GsNrBBA7Sxx7WhChVQAYXAHYAY+1ela3jQ5jVlluHORGuHVSMncccEjnA9PWuMaz1ld3ty9re3GoaeyMIfhuTkOvGW28EDgY9O4zV/UeoV6Y1ueK3vru4lhZS0ZZmVVK/Lk/u55PYcDnmm1KNIvDBqbjtFt/n5aeKHotisg4sOAgwQfWm9ojUxrMX2h0X9bvn6c8T7G8tLFbOwvSiMyIoSZ2IDnA9jsOPu31HMrelLyO50qBUCqRGGCIm1VGcYGOPx71DTU9WvOrtY0aKO3lt7WG7XZvOS7ZVn7ccIM/ipfeH1h+j0KF3VhI6jJaRnyO/qTjn0HtVa1PkAXXcIqVRg2UsSOuO86W/IiVs9KUrOt6s3tut3aT27llWVChZe4yO4+9R96u6c1B76eS6eO11OxmSOKWMf1Ek8qsBzlGxjJx5vLjKjdImvL17Q7HXLYRX0bblDBJYztkjyMHB9iO4OQfUVZrosdFXlhwqNs4aHf6qJU+jQ3moR2lyoF6txI13cy8NKCVwArAEEbSBwO9ZHVuirJql1PG7iK7QGSJCM5GO6+o8qn+RXaNU8Mb34kn6K40+6iY7hHdw9uCMchsenylfl7cmj+Gl5c3MuxdO0q2d2OLYlpAhAwu4KDhSMjDA881cvdmtqNMACIiy0gYU4J2Ge15c4yXcwmft01tB1N5XNdD0JrTXBefpEudVuSiQwQxbETKgjcvBUkYxxzwSNuSZI9PWEmm6RBbzuJJwC0rL2LE5IH2HYfYVgdMdJ6doAMkAae8ZdrXEvLY9lHZR/H+Sa2CoqVC9Y6dFrL7990pSlLTVWlKUIVKUpQhKUpQhVpSlCF//Z",
//   "base64"
// );
// // console.log(S3Client);
// console.log(uploadToS3(img, "test.jpg"));


// getSignedUrlForS3Object("5ad97e94-a3d8-4a6f-8fb4-f7e660695457_ESG.jpeg").then(
//   (data) => console.log(data)
// );

module.exports = { uploadToS3, getSignedUrlForS3Object };
