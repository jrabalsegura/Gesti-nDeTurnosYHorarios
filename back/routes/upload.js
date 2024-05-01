const express = require('express');
const router = express.Router();
const {validateJWT} = require('../middlewares/validate-JWT');
const {uploadFile} = require('../controllers/upload');
const multer = require('multer');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(validateJWT);

router.post('/', (req, res, next) => {
  upload.single('file')(req, res, function(err) {
      if (err) {
          // Handle errors
          console.error('Upload Error:', err);
          return res.status(500).json({ error: err.message });
      }
      // Proceed if no errors
      uploadFile(req, res);
  });
});

module.exports = router;


