import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { marked } from 'marked';

// Export to PDF
export async function exportToPDF(content, fileName, fileType) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    try {
        if (fileType === 'md') {
            // Convert markdown to HTML then to PDF
            const html = await marked.parse(content);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const text = tempDiv.textContent || tempDiv.innerText;
            
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(text, maxWidth);
            let y = margin;
            
            lines.forEach(line => {
                if (y > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += 7;
            });
        } else if (fileType === 'csv') {
            // Parse CSV and create table
            const parsed = Papa.parse(content, { header: true });
            if (parsed.data && parsed.data.length > 0) {
                const headers = Object.keys(parsed.data[0]);
                const rows = parsed.data.map(row => headers.map(h => row[h] || ''));
                
                doc.autoTable({
                    head: [headers],
                    body: rows,
                    startY: margin,
                    margin: { left: margin, right: margin }
                });
            }
        } else {
            // Plain text export
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(content, maxWidth);
            let y = margin;
            
            lines.forEach(line => {
                if (y > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += 7;
            });
        }

        doc.save(`${fileName}.pdf`);
        return { success: true };
    } catch (error) {
        console.error('PDF export error:', error);
        return { success: false, error: error.message };
    }
}

// Export to Excel
export function exportToExcel(content, fileName, fileType) {
    try {
        let workbook;
        
        if (fileType === 'csv') {
            // Parse CSV and convert to Excel
            const parsed = Papa.parse(content, { header: true });
            const worksheet = XLSX.utils.json_to_sheet(parsed.data);
            workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        } else if (fileType === 'json') {
            // Parse JSON and convert to Excel
            const data = JSON.parse(content);
            const dataArray = Array.isArray(data) ? data : [data];
            const worksheet = XLSX.utils.json_to_sheet(dataArray);
            workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        } else {
            // Convert plain text to Excel (each line is a row)
            const lines = content.split('\n').map(line => [line]);
            const worksheet = XLSX.utils.aoa_to_sheet(lines);
            workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        }

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        return { success: true };
    } catch (error) {
        console.error('Excel export error:', error);
        return { success: false, error: error.message };
    }
}

// Export to CSV
export function exportToCSV(content, fileName, fileType) {
    try {
        let csvContent;
        
        if (fileType === 'json') {
            // Parse JSON and convert to CSV
            const data = JSON.parse(content);
            const dataArray = Array.isArray(data) ? data : [data];
            csvContent = Papa.unparse(dataArray);
        } else if (fileType === 'csv') {
            // Already CSV
            csvContent = content;
        } else {
            // Convert plain text to CSV (each line is a row with one column)
            const lines = content.split('\n');
            csvContent = Papa.unparse(lines.map(line => [line]));
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.csv`;
        link.click();
        
        return { success: true };
    } catch (error) {
        console.error('CSV export error:', error);
        return { success: false, error: error.message };
    }
}

// Export to DOCX (via backend)
export async function exportToDOCX(content, fileName) {
    try {
        const response = await fetch('/api/export/docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error('Export failed');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.docx`;
        link.click();
        
        return { success: true };
    } catch (error) {
        console.error('DOCX export error:', error);
        return { success: false, error: error.message };
    }
}

// Export as plain text
export function exportAsText(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.txt`;
    link.click();
    return { success: true };
}
