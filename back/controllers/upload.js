const { uploadSelectedFile } = require('../aws/config')

const uploadFile = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file
    const myFile = req.files.file;
    const fileName = myFile.name;
    let fileUrl = '';

    // Upload to S3
    try {
        fileUrl = await uploadSelectedFile(fileName, myFile);
        console.log('File URL:', fileUrl);
    } catch (err) {
        console.error(err);
    }

    res.status(200).json({ fileName, fileUrl });
}

module.exports = {
    uploadFile
}

