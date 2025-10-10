const PDFDocument = require('pdfkit');

/**
 * Export resources data to PDF format with beautiful table design
 * @param {Array} resources - Array of resource objects
 * @param {Object} res - Express response object
 */
function exportPDF(resources, res) {
  try {
    // Validate input
    if (!Array.isArray(resources)) {
      throw new Error('Resources must be an array');
    }

    // Create a new PDF document with custom page size
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4',
      layout: 'portrait',
      bufferPages: true
    });
    
    // Set headers for file download
    const fileName = `library_resources_report_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add beautiful header background
    doc.rect(0, 0, 595, 120)
       .fill('#667eea');
    
    // Add company logo placeholder circle
    doc.circle(70, 50, 25)
       .fill('#ffffff');
    
    // Logo icon (using text as emoji might not render properly in PDFs)
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#667eea')
       .text('LIB', 52, 40);
    
    // Main title with modern styling
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#ffffff')
       .text('LIBRARY ', 120, 35);
    
    doc.fontSize(18)
       .font('Helvetica')
       .fillColor('#f0f4ff')
       .text('Comprehensive Report', 120, 65);
    
    // Add date and time in top right
    const currentDate = new Date();
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#ffffff')
       .text(`Generated: ${currentDate.toLocaleDateString()}`, 420, 35, { width: 135 })
       .text(`Time: ${currentDate.toLocaleTimeString()}`, 420, 50, { width: 135 });
    
    // Move down after header
    doc.y = 140;
    
    // Add statistics cards
    const cardY = doc.y;
    const cardWidth = 120;
    const cardHeight = 80;
    const cardSpacing = 15;
    
    // Calculate statistics safely
    const totalViews = resources.reduce((sum, r) => {
      const views = parseInt(r.views) || 0;
      return sum + views;
    }, 0);
    
    const pdfCount = resources.filter(r => 
      r.type && r.type.toLowerCase() === 'pdf'
    ).length;
    
    const videoCount = resources.filter(r => 
      r.type && r.type.toLowerCase() === 'video'
    ).length;
    
    const stats = [
      { 
        label: 'Total Resources', 
        value: resources.length, 
        color: '#3B82F6',
        lightColor: '#EBF4FF',
        symbol: 'TOTAL'
      },
      { 
        label: 'Total Views', 
        value: totalViews,
        color: '#10B981',
        lightColor: '#ECFDF5',
        symbol: 'VIEWS'
      },
      { 
        label: 'PDF Files', 
        value: pdfCount,
        color: '#F59E0B',
        lightColor: '#FFFBEB',
        symbol: 'PDF'
      },
      { 
        label: 'Videos', 
        value: videoCount,
        color: '#8B5CF6',
        lightColor: '#F5F3FF',
        symbol: 'VIDEOS'
      }
    ];
    
    let currentX = 40;
    stats.forEach((stat) => {
      // Card shadow
      doc.rect(currentX + 2, cardY + 2, cardWidth, cardHeight)
         .fillOpacity(0.1)
         .fill('#000000');
      
      // Main card
      doc.fillOpacity(1)
         .rect(currentX, cardY, cardWidth, cardHeight)
         .lineWidth(2)
         .fillAndStroke(stat.lightColor, stat.color);
      
      // Icon background circle
      doc.circle(currentX + 30, cardY + 25, 18)
         .fill(stat.color);
      
      // Symbol text
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#ffffff')
         .text(stat.symbol, currentX + 14, cardY + 20);
      
      // Value
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor(stat.color)
         .text(stat.value.toString(), currentX + 60, cardY + 15, {
           width: 55,
           align: 'left'
         });
      
      // Label
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#374151')
         .text(stat.label, currentX + 5, cardY + 50, {
           width: cardWidth - 10,
           align: 'center'
         });
      
      currentX += cardWidth + cardSpacing;
    });
    
    // Move down after stats cards
    doc.y = cardY + cardHeight + 30;
    
    // Add decorative separator line
    const lineY = doc.y;
    doc.rect(40, lineY, 515, 2)
       .fill('#667eea');
    
    doc.y = lineY + 20;
    
    // Table header
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1F2937')
       .text('RESOURCES TABLE', 40, doc.y, { align: 'left' })
       .moveDown(1);
    
    // Table configuration
    const tableTop = doc.y;
    const tableLeft = 40;
    const columnWidths = [35, 170, 65, 90, 50, 105]; // No, Title, Type, Tag, Views, Date
    const rowHeight = 35;
    const headerHeight = 40;
    
    // Table header background
    doc.rect(tableLeft, tableTop, columnWidths.reduce((a, b) => a + b, 0), headerHeight)
       .fill('#667eea');
    
    // Header text
    const headers = ['#', 'TITLE', 'TYPE', 'TAG', 'VIEWS', 'DATE'];
    
    currentX = tableLeft;
    headers.forEach((header, i) => {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#ffffff')
         .text(header, currentX + 5, tableTop + 14, {
           width: columnWidths[i] - 10,
           align: i === 0 || i === 4 ? 'center' : 'left'
         });
      currentX += columnWidths[i];
    });
    
    // Add table rows
    let currentY = tableTop + headerHeight;
    let pageNumber = 1;
    
    resources.forEach((resource, index) => {
      // Check if we need a new page
      if (currentY > 720) {
        doc.addPage();
        currentY = 50;
        pageNumber++;
        
        // Redraw header on new page
        doc.rect(tableLeft, currentY, columnWidths.reduce((a, b) => a + b, 0), headerHeight)
           .fill('#667eea');
        
        currentX = tableLeft;
        headers.forEach((header, i) => {
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .fillColor('#ffffff')
             .text(header, currentX + 5, currentY + 14, {
               width: columnWidths[i] - 10,
               align: i === 0 || i === 4 ? 'center' : 'left'
             });
          currentX += columnWidths[i];
        });
        
        currentY += headerHeight;
      }
      
      // Alternating row colors
      const bgColor = index % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(tableLeft, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight)
         .fillAndStroke(bgColor, '#E2E8F0');
      
      // Get type styling
      const getTypeInfo = (type) => {
        const typeStr = (type || '').toLowerCase();
        switch (typeStr) {
          case 'pdf': return { label: 'PDF', color: '#DC2626' };
          case 'video': return { label: 'VIDEO', color: '#7C3AED' };
          default: return { label: 'OTHER', color: '#6B7280' };
        }
      };
      
      const typeInfo = getTypeInfo(resource.type);
      
      // Safely format date
      let dateStr = 'N/A';
      if (resource.createdAt) {
        try {
          dateStr = new Date(resource.createdAt).toLocaleDateString();
        } catch (e) {
          dateStr = 'Invalid Date';
        }
      }
      
      // Truncate text safely
      const truncate = (str, maxLen) => {
        const text = String(str || 'N/A');
        return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
      };
      
      // Row data
      const rowData = [
        { text: (index + 1).toString(), align: 'center', font: 'Helvetica-Bold', color: '#374151' },
        { text: truncate(resource.title, 30), align: 'left', font: 'Helvetica-Bold', color: '#1F2937' },
        { text: typeInfo.label, align: 'left', font: 'Helvetica', color: typeInfo.color },
        { text: truncate(resource.tag, 18), align: 'left', font: 'Helvetica', color: '#4B5563' },
        { text: (parseInt(resource.views) || 0).toString(), align: 'center', font: 'Helvetica-Bold', color: '#059669' },
        { text: dateStr, align: 'left', font: 'Helvetica', color: '#6B7280' }
      ];
      
      // Add text to each cell
      currentX = tableLeft;
      rowData.forEach((data, i) => {
        doc.fontSize(9)
           .font(data.font)
           .fillColor(data.color)
           .text(data.text, currentX + 5, currentY + 12, {
             width: columnWidths[i] - 10,
             align: data.align
           });
        currentX += columnWidths[i];
      });
      
      currentY += rowHeight;
    });
    
    // Add footer on the last page
    const totalPages = pageNumber;
    const range = doc.bufferedPageRange();
    
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      
      // Footer background
      doc.rect(0, 750, 595, 92)
         .fill('#F8FAFC');
      
      // Footer content
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('#374151')
         .text('Library Management System', 40, 765);
      
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text('Designed for efficient resource management', 40, 785)
         .text(`Page ${i + 1} of ${totalPages} • Generated on ${currentDate.toLocaleDateString()}`, 40, 800);
      
      // Decorative circle
      doc.circle(520, 785, 20)
         .fillOpacity(0.2)
         .fill('#667eea');
    }
    
    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error('PDF export error:', error);
    
    // Make sure response hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Error generating PDF report', 
        error: error.message 
      });
    }
  }
}

module.exports = exportPDF;