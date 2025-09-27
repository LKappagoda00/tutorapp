const XLSX = require('xlsx');

/**
 * Export resources data to Excel format
 * @param {Array} resources - Array of resource objects
 * @param {Object} res - Express response object
 */
function exportExcel(resources, res) {
  try {
    // Prepare data for Excel export
    const excelData = resources.map((resource, index) => ({
      'No.': index + 1,
      'Title': resource.title || 'N/A',
      'Description': resource.description || 'N/A',
      'Type': resource.type || 'N/A',
      'Tag': resource.tag || 'N/A',
      'Views': resource.views || 0,
      'Drive Link': resource.driveLink || 'N/A',
      'File URL': resource.fileUrl || 'N/A',
      'Upload Date': resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'N/A',
      'Tutor ID': resource.tutorId || 'N/A'
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths for better readability
    const columnWidths = [
      { wch: 5 },   // No.
      { wch: 30 },  // Title
      { wch: 40 },  // Description
      { wch: 15 },  // Type
      { wch: 15 },  // Tag
      { wch: 8 },   // Views
      { wch: 40 },  // Drive Link
      { wch: 40 },  // File URL
      { wch: 15 },  // Upload Date
      { wch: 15 }   // Tutor ID
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resources');
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'buffer' 
    });
    
    // Set headers for file download
    const fileName = `resources_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    // Send the Excel file
    res.send(excelBuffer);
    
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ 
      message: 'Error generating Excel report', 
      error: error.message 
    });
  }
}

module.exports = exportExcel;