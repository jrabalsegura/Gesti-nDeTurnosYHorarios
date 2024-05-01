const axios = require('axios');
const { temporalURL } = require('../aws/config');

const downloadFile = async (req, res) => {
  const fileName = req.body.name;
  const fileType = req.body.type;
  if (!fileUrl) {
      return res.status(400).send({ message: 'URL is required' });
  }

  try {
      const response = await axios({
          url: temporalURL(fileName),
          method: 'GET',
          responseType: 'stream' // This ensures that the response type is a stream
      });

      // Set the headers to suggest a file download to the browser
      res.setHeader('Content-Disposition', `attachment; ${fileName}`); // Modify the filename accordingly
      res.setHeader('Content-Type', `application/${fileType}`); // Modify the content type accordingly

      // Pipe the stream directly to the response
      response.data.pipe(res);
  } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send({ message: 'Failed to download file' });
  }
}

module.exports = {
  downloadFile
}