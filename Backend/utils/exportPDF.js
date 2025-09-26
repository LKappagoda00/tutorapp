const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Export a PDF document with the provided content
 * @param {Object} options - Options for PDF generation
 * @param {string} options.content - The content to include in the PDF
 * @param {string} options.title - The title of the PDF document
 * @param {string} options.filename - The name of the file to save
 * @param {string} options.outputPath - The path where to save the PDF
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function exportPDF({ content, title, filename, outputPath }) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const outputFilePath = `${outputPath}/${filename}`;
            const writeStream = fs.createWriteStream(outputFilePath);

            // Pipe PDF to writeStream
            doc.pipe(writeStream);

            // Add title
            doc.fontSize(18)
               .text(title, { align: 'center' })
               .moveDown();

            // Add content
            doc.fontSize(12)
               .text(content, {
                   align: 'left',
                   columns: 1
               });

            // Finalize the PDF
            doc.end();

            writeStream.on('finish', () => {
                resolve(outputFilePath);
            });

            writeStream.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = exportPDF;