const { jsPDF } = require("jspdf");
const { uploadFileToS3 } = require("../aws/config");

const createPDF = async (body) => {
	const doc = new jsPDF();

	doc.text("Hello world!!", 10, 10);

	const fileName = "hello.pdf"

	doc.save(fileName);

	//Upload to S3
	try {
		await uploadFileToS3(fileName, doc);
		console.log('File uploaded to S3: ', fileName);

		return fileName;
	} catch (err) {
		console.error(err);

		return null;
	}

	
}

module.exports = {
	createPDF
}

