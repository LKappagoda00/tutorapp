const express = require('express');
const { 
    addResource, 
    getResources, 
    viewResource, 
    deleteResource, 
    exportReport,
    exportExcelReport,
    updateResource 
} = require('../controllers/resourceController');
const upload = require('../utils/upload');

const router = express.Router();

// Resource management routes
router.post('/', upload.single('file'), addResource);  // Changed from '/add' to '/'
router.get('/', getResources);
router.get('/export/pdf', exportReport);
router.get('/export/excel', exportExcelReport);
router.get('/:id', viewResource);
router.put('/:id', upload.single('file'), updateResource);
router.delete('/:id', deleteResource);

module.exports = router;




//new
//------------------------------------------------------

// const express = require('express');
// const {
//   addResource,
//   getResources,
//   viewResource,
//   deleteResource,
//   exportReport,
//   updateResource,
//   serveProtectedFile,
//   serveRawFile,
//   downloadFile
// } = require('../controllers/resourceController');
// // const protect = require('../middleware/authMiddleware');
// const upload = require('../utils/upload');

// const router = express.Router();

// // Configure upload middleware for different file types
// // const resourceUpload = upload.fields([
// //   { name: 'file', maxCount: 1 }, // For PDF and virtual book files
// //   { name: 'pdf', maxCount: 1 }   // Backward compatibility
// // ]);

// router.post('/', upload.single('file'), addResource);

// // POST - Create new resource (PDF, Virtual Book, or Video)
// // router.post('/', protect, resourceUpload, addResource);
// router.post('/', resourceUpload, addResource);

// // GET - Get all resources with optional filtering
// // router.get('/', protect, getResources);
// router.get('/', getResources);

// // GET - Get specific resource by ID
// // router.get('/:id', protect, viewResource);
// router.get('/:id', viewResource);

// // DELETE - Delete resource by ID
// // router.delete('/:id', protect, deleteResource);
// router.delete('/:id', deleteResource);

// // GET - Export resources as PDF report
// // router.get('/export/pdf', protect, exportReport);
// router.get('/export/pdf', exportReport);

// // PUT - Update resource by ID
// // router.put('/:id', protect, updateResource);
// router.put('/:id', updateResource);

// // NEW ROUTES FOR VIRTUAL BOOK PROTECTION

// // GET - Serve protected file with security features
// // router.get('/file/:fileId', protect, serveProtectedFile);
// router.get('/file/:fileId', serveProtectedFile);

// // GET - Serve raw file with access key validation
// // router.get('/raw-file/:fileId', protect, serveRawFile);
// router.get('/raw-file/:fileId', serveRawFile);

// // GET - Download file with access control
// // router.get('/download/:fileId', protect, downloadFile);
// router.get('/download/:fileId', downloadFile);

// module.exports = router;