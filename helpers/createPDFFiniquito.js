const { jsPDF } = require("jspdf");
const { uploadFileToS3 } = require("../aws/config");

const createPDFFiniquito = async (body) => {
  const {employeeName, months, baseSallary, totalVacation, pago} = body;

  const doc = new jsPDF();

  // Set the font for the title and subtitles
  doc.setFontSize(24);
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = `Finiquito de ${employeeName}`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 20);

  // Set the font for the body
  doc.setFontSize(12);
  doc.text(`Base: ${baseSallary.toFixed(2)} €`, 20, 50);
  doc.text(`Meses trabajados: ${months} meses`, 20, 60);
  doc.text(`Vacaciones adeudadas: ${totalVacation.toFixed(2)} €`, 20, 70);

  // Enlarge and center "Pago"
  doc.setFontSize(16);
  const pagoText = `Pago: ${pago.toFixed(2)} €`;
  const pagoWidth = doc.getTextWidth(pagoText);
  doc.text(pagoText, (pageWidth - pagoWidth) / 2, 90);

  const fileName = `${employeeName.replace(/\s+/g, '_')}_Finiquito.pdf`;
  const pdfOutput = doc.output('arraybuffer');

  // Upload to S3
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
  createPDFFiniquito
}