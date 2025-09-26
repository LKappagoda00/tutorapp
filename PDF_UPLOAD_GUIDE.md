# 🔧 PDF Upload & Viewing - Setup & Troubleshooting Guide

## ✅ Fixed Issues

### Backend Issues Fixed:
1. **Added static file serving** - PDFs can now be accessed via HTTP
2. **Fixed port configuration** - Backend now defaults to port 5000
3. **Enhanced file upload validation** in resource controller
4. **Added proper error handling** for upload operations

### Frontend Issues Fixed:
1. **Improved file validation** - Better error messages for invalid files
2. **Enhanced UI feedback** - Shows file size and name when selected
3. **Added PDF viewer component** - Modal-based PDF viewing
4. **Better error handling** - More descriptive error messages
5. **Multiple viewing options** - View in modal or download directly

## 🚀 How to Start the Application

### 1. Start Backend Server
```bash
cd Backend
node app.js
```
Should show: `Server running on port 5000` and `MongoDB connected`

### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Should start on `http://localhost:5173`

### 3. Test Upload Functionality
- Open `test-upload.html` in browser for quick testing
- Or use the main app at `http://localhost:5173`

## 📋 Testing Checklist

### Upload Testing:
- [ ] PDF files upload successfully
- [ ] File size validation works (max 10MB)
- [ ] Only PDF files are accepted
- [ ] Success/error messages display correctly
- [ ] Video links save properly

### Viewing Testing:
- [ ] PDF files display in browser
- [ ] Download links work
- [ ] Modal PDF viewer opens
- [ ] Files are accessible via direct URLs

### Direct File Access:
- [ ] `http://localhost:5000/uploads/[filename]` works
- [ ] PDF files load in browser without download prompt

## 🔍 Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** Make sure backend is running on port 5000
```bash
cd Backend
node app.js
```

### Issue: "File upload failed" 
**Solutions:**
1. Check file is PDF format
2. Check file size < 10MB
3. Ensure uploads folder exists in Backend directory

### Issue: "PDF won't display"
**Solutions:**
1. Check backend static file serving: `http://localhost:5000/uploads/[filename]`
2. Verify CORS settings allow localhost:5173
3. Check browser console for errors

### Issue: "404 Not Found" for uploaded files
**Solutions:**
1. Verify uploads directory exists in Backend folder
2. Check static file middleware is configured
3. Ensure file was actually uploaded (check Backend/uploads folder)

## 📁 File Structure
```
Backend/
├── app.js (✅ Updated with static file serving)
├── controllers/resourceController.js (✅ Enhanced)
├── utils/upload.js (✅ Already configured)
└── uploads/ (✅ Auto-created, stores PDFs)

frontend/src/
├── pagers/library/
│   ├── UploadResource.jsx (✅ Enhanced validation)
│   └── libraryDashboad.jsx (✅ Added modal viewer)
└── components/
    └── PDFViewer.jsx (✅ New component)
```

## 🌟 New Features Added

1. **Enhanced Upload UI** - Better visual feedback and validation
2. **PDF Modal Viewer** - View PDFs without leaving the page
3. **Improved Error Handling** - Clear error messages for all scenarios
4. **File Size Display** - Shows selected file size in MB
5. **Multiple View Options** - Modal view + direct download
6. **Test Page** - Simple HTML page for testing uploads

## 🎯 Next Steps

1. Start both servers (Backend and Frontend)
2. Test with a small PDF file first
3. Verify files appear in library dashboard
4. Test both modal view and direct download
5. Check browser console for any errors

The PDF upload and viewing functionality should now work properly! 🎉