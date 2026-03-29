const { Document, Packer, Paragraph, TextRun } = require("docx");
const ExcelJS = require('exceljs');

async function exportToDocx(content) {
    const paragraphs = content.split('\n').map(line => 
        new Paragraph({
            children: [new TextRun(line)]
        })
    );
    
    const doc = new Document({
        sections: [{ children: paragraphs }]
    });
    
    return await Packer.toBuffer(doc);
}

async function exportToExcel(jsonData) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data');
    
    if (Array.isArray(jsonData) && jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]);
        sheet.addRow(headers);
        
        jsonData.forEach(row => {
            const values = headers.map(header => row[header]);
            sheet.addRow(values);
        });
    }
    
    return await workbook.xlsx.writeBuffer();
}

module.exports = { exportToDocx, exportToExcel };
