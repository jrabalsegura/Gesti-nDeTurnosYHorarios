const { uploadSelectedFile } = require('../aws/config')

const uploadFile = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file
    console.log(req.files.file)
    const name = req.files.file.name
    const fileContent = req.files.file.data
    const mimeType = req.files.file.mimeType

    let fileName = '';

    // Upload to S3
    try {
        fileName = await uploadSelectedFile(name, fileContent, mimeType);
        console.log('File URL:', fileName);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Failed to upload file', error: err });
    }

    res.status(200).json({ fileName });
}

module.exports = {
    uploadFile
}

