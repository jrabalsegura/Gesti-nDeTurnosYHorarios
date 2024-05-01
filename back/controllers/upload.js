const { uploadSelectedFile } = require('../aws/config')

const uploadFile = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file
    console.log(req.files.file)
    let fileContent = req.files.fileContent

    let fileUrl = '';

    // Upload to S3
    try {
        fileUrl = await uploadSelectedFile(fileContent);
        console.log('File URL:', fileUrl);
    } catch (err) {
        console.error(err);
    }

    res.status(200).json({ fileUrl });
}

module.exports = {
    uploadFile
}

