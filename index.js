

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();

const uploadDirectory = path.join(__dirname, 'uploads');
const compressedDirectory = path.join(__dirname, 'uploads', 'compressed');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

if (!fs.existsSync(compressedDirectory)) {
    fs.mkdirSync(compressedDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json()); // Parse JSON request bodies



app.get("/", async (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});
  
app.post('/file-upload', upload.single('pdf'), (req, res) => {
    if (req?.file) {
        const inputFilePath = path.join(uploadDirectory, req.file.originalname);
        const outputFilePath = path.join(compressedDirectory, req.file.originalname);

        // Determine the compression level from the request body
        const compressionLevel = req.body.compressionLevel; // This should be 'high', 'medium', or 'lessCompress'

        // Set Ghostscript parameters based on the compression level
        let pdfSettings = '';
        if (compressionLevel === 'high') {
            pdfSettings = '/printer';
        } else if (compressionLevel === 'medium') {
            pdfSettings = '/ebook';
        } else if (compressionLevel === 'lessCompress') {
            pdfSettings = '/screen';
        } else {
            return res.status(400).json('Invalid compression level');
        }

        const cmd = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${pdfSettings} -dNOPAUSE -dBATCH -sOutputFile=${outputFilePath} ${inputFilePath}`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error compressing PDF:', error);
                if (error.message.includes('Unrecoverable error')) {
                    return res.status(500).json('Error compressing PDF: Unrecoverable error occurred');
                } else {
                    return res.status(500).json('Error compressing PDF: An error occurred during compression');
                }
            } else {
                console.log('PDF compressed');
                // Use res.download to send the compressed PDF for download
                res.download(outputFilePath, req.file.originalname, (downloadError) => {
                    if (downloadError) {
                        console.error('Error downloading the file:', downloadError);
                        res.status(500).json('Error downloading the file');
                    }
                });
            }
        });
    } else {
        res.status(400).json('No file uploaded');
    }
});


app.listen(4000, () => {
    console.log('App is running on port 4000');
});


