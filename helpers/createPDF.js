const { jsPDF } = require("jspdf");
const { uploadFileToS3 } = require("../aws/config");

const createPDF = async (body) => {
    const { employeeName, month, year, baseSallary, horasExtra, socialSecurity, pago } = body;
    const doc = new jsPDF();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const spanishMonth = monthNames[month - 1]; 

    // Set the font for the title and subtitles
    doc.setFontSize(24);
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `${employeeName} - ${spanishMonth} ${year}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20); // Center the title

    // Set the font for the body
    doc.setFontSize(12);
    doc.text(`Salario base: ${baseSallary.toFixed(2)} €`, 20, 50);
    doc.text(`Horas Extra: ${horasExtra} horas`, 20, 60);
    doc.text(`Seguridad Social: ${socialSecurity.toFixed(2)} €`, 20, 70);

    // Enlarge and center "Pago"
    doc.setFontSize(16);
    const pagoText = `Pago: ${pago.toFixed(2)} €`;
    const pagoWidth = doc.getTextWidth(pagoText);
    doc.text(pagoText, (pageWidth - pagoWidth) / 2, 90); // Center the "Pago" text

    const fileName = `${employeeName.replace(/\s+/g, '_')}_${spanishMonth}_${year}.pdf`;
    const pdfOutput = doc.output('arraybuffer');

    // Upload to S3
    try {
        await uploadFileToS3(fileName, Buffer.from(pdfOutput));

        return fileName;
    } catch (err) {
        return null;
    }
}

module.exports = {
    createPDF
}