const { jsPDF } = require("jspdf");
const { uploadFileToS3 } = require("../aws/config");

const createPDF = async (body) => {
	const { employeeName, month, year, baseSallary, horasExtra, socialSecurity, pago } = body;
    const doc = new jsPDF();

	console.log("Creating pdf");
	console.log("Body");

    // Set the font for the title and subtitles
    doc.setFontSize(18);
    doc.text(employeeName, 20, 20);
    doc.setFontSize(14);
    doc.text(`${month} ${year}`, 20, 30);

	console.log("title created");

    // Set the font for the body
    doc.setFontSize(12);
    doc.text(`Salario base: ${baseSallary.toFixed(2)} €`, 20, 50);
    doc.text(`Horas Extra: ${horasExtra} horas`, 20, 60);
    doc.text(`Seguridad Social: ${socialSecurity.toFixed(2)} €`, 20, 70);
    doc.text(`Pago: ${pago.toFixed(2)} €`, 20, 80);

	console.log("body created");

    const fileName = `${employeeName.replace(/\s+/g, '_')}_${month}_${year}.pdf`;
    const pdfOutput = doc.output('arraybuffer');

	console.log("pdf created");

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

