const { jsPDF } = require("jspdf");
const { uploadFileToS3 } = require("../aws/config");

const createPDF = async (body) => {
	const doc = new jsPDF();

	doc.text("Hello world!!", 10, 10);

	const fileName = "hello.pdf"
	const pdfOutput = doc.output('arraybuffer');

	//Upload to S3
	try {
		await uploadFileToS3(fileName, Buffer.from(pdfOutput));
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

