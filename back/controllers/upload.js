const { uploadSelectedFile } = require('../aws/config')

const uploadFile = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    
    // accessing the file
    console.log(req.files.file)
    const name = req.files.file.name
    const fileContent = req.files.file.data

    console.log('Original data type:', fileContent.constructor.name); // Log the original data type

    const buffer = Buffer.from(fileContent); // Convert to Buffer
    console.log('Converted data type:', buffer.constructor.name); 

    let fileUrl = '';

    // Upload to S3
    try {
        fileUrl = await uploadSelectedFile(name, buffer);
        console.log('File URL:', fileUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Failed to upload file', error: err });
    }

    res.status(200).json({ fileUrl });
}

module.exports = {
    uploadFile
}

