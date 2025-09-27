const multer = require('multer');
const path = require('path');


// store temporarily in memory or tmp — we'll use diskStorage to /tmp
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp'); // works on most environments; ensure /tmp exists on your system
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `product-${Date.now()}${ext}`);
    }
});


function fileFilter(req, file, cb) {
    // accept images only
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed!'), false);
    } else {
        cb(null, true);
    }
}


const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB


module.exports = upload;