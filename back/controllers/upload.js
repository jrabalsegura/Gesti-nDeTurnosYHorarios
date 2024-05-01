const { uploadSelectedFile } = require('../aws/config')

const uploadFile = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file
    let fileContent;

    // Check if the data is already a Buffer or needs conversion from ArrayBuffer
    if (req.files.file.data instanceof Buffer) {
        fileContent = req.files.file.data;
    } else if (req.files.file.data instanceof ArrayBuffer) {
        // Convert ArrayBuffer to Buffer
        fileContent = Buffer.from(req.files.file.data);
    } else {
        // Handle other cases or throw an error
        return res.status(500).send({ msg: "The file data format is not supported" });
    }
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

