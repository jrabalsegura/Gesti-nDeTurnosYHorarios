const { uploadSelectedFile } = require('../aws/config')

const uploadFile = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file
    console.log(req.files.file)
    const name = req.files.file.name
    const fileContent = req.files.file.data

    let fileUrl = '';

    // Upload to S3
    try {
        fileUrl = await uploadSelectedFile(name, fileContent);
        console.log('File URL:', fileUrl);
    } catch (err) {
        console.error(err);
    }

    res.status(200).json({ fileUrl });
}

module.exports = {
    uploadFile
}

