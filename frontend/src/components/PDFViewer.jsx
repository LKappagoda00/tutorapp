import { useState } from 'react';

const PDFViewer = ({ pdfUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading PDF...</span>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load PDF</h3>
          <p className="text-red-600 mb-4">Unable to display the PDF file.</p>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Download PDF
          </a>
        </div>
      )}
      
      <iframe
        src={pdfUrl}
        title={title}
        className={`w-full h-[600px] border rounded-lg ${loading ? 'hidden' : 'block'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      
      {!loading && !error && (
        <div className="mt-4 text-center">
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">📄</span>
            Open in New Tab
          </a>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;