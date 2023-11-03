/*const {PDFNet} = require("@pdftron/pdfnet-node")
const express = require('express')

const path = require('path')
const fs = require('fs')

const app = express()

app.get('/',( req,res)=>{
    console.log(req.query)
    res.status(200).json({status:'sucess',
data:'hello from server'})
})

// const convertToPDF = async ()=>{
//     const pdfdoc = await PDFNet.pdfdoc.create()
//     await pdfdoc.initSecurityHandler()
//     await PDFNet.Convert.toPdf(pdfdoc , inputPath)
// pdfdoc.save(output.SDFDoc.SaveOptions.e_linerized)

// }


// PDFNet.runWithCleanup(convertToPDF).then(()=>{
//     fs.readFile(outputPath, (err, data)=>{
//         if(err){
//             res.statusCode = 500;
//             res.end(err)
//         }
//         else{
//             res.setHeader('ContentType', 'application/pdf')
//             res.end(data)
//         }
//     })
// }).catch(err =>{
// res.statusCode = 500;
// res.end(err)

// }) 



app.get('/thumbnail',( req,res)=>{
const {filename} = req.query

const inputPath = path.resolve(__dirname, `./files/${filename}`)
const outputPath = path.resolve(__dirname, `./files/${filename}.pdf`)

const getThumbFromPDF = async ()=>{
const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath)
await doc.initSecurityHandler()
const pdfDrow = await PDFNet.pdfDrow.create(92)
const currPage = await doc.getPage(1)

await pdfDrow.export(currPage , outputPath, 'PNG')


}

PDFNet.runWithCleanup(getThumbFromPDF).then(()=>{
    fs.readFile(outputPath, (err, data)=>{
        if(err){
            res.statusCode = 500;
            res.end(err)
        }
        else{
            res.setHeader('ContentType', 'image/png')
            res.end(data)
        }
    })
}).catch(err =>{
res.statusCode = 500;
res.end(err)

})

})

app.listen(4000 ,()=>{
    console.log('App is running on port 4000')
}) 

*/


/// working but very less ////
/* 
const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Define the `compressFile` function
const compressFile = async (existingBytes, originalname) => {
    const pdfDoc = await PDFDocument.load(existingBytes);
    const compressedPdfBytes = await pdfDoc.save();
    console.log(compressedPdfBytes);
    fs.writeFileSync(`./uploads/compressed/${originalname}`, compressedPdfBytes);
};

// API endpoint for file upload
app.post('/file-upload', upload.single('pdf'), (req, res) => {
    if (req?.file) {
        const filePath = `./uploads/${req.file.originalname}`;
        const existingToBytes = fs.readFileSync(filePath);
        compressFile(existingToBytes, req.file.originalname);
        return res.status(200).json('File uploaded');
    } else {
        return res.status(400).json('File not uploaded');
    }
});

app.listen(4000, () => {
    console.log('App is running on port 4000');
});
 */




/* 
/// try faild


const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Define the `compressFile` function
const compressFile = async (existingBytes, originalname) => {
    const pdfDoc = await PDFDocument.load(existingBytes);

    // Set the compression level to 0 for maximum compression
    pdfDoc.setCompressionLevel(0);

    const compressedPdfBytes = await pdfDoc.save();
    console.log(compressedPdfBytes);
    fs.writeFileSync(`./uploads/compressed/${originalname}`, compressedPdfBytes);
};

// API endpoint for file upload
app.post('/file-upload', upload.single('pdf'), (req, res) => {
    if (req?.file) {
        const filePath = `./uploads/${req.file.originalname}`;
        const existingToBytes = fs.readFileSync(filePath);
        compressFile(existingToBytes, req.file.originalname);
        return res.status(200).json('File uploaded');
    } else {
        return res.status(400).json('File not uploaded');
    }
});

app.listen(4000, () => {
    console.log('App is running on port 4000');
});
 */




/// working for single page pdf file 

/* 
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

app.post('/file-upload', upload.single('pdf'), (req, res) => {
    if (req?.file) {
        const inputFile = `./uploads/${req.file.originalname}`;
        const outputFile = `./uploads/compressed/${req.file.originalname}`;

        // Use pdftk to compress the PDF

        const pdftkCommand = `pdftk ${inputFile} output ${outputFile} compress`;
        exec(pdftkCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return res.status(500).json('Error compressing the PDF');
            }
            return res.status(200).json('File uploaded and compressed');
        });
    } else {
        return res.status(400).json('File not uploaded');
    }
});

app.listen(4000, () => {
    console.log('App is running on port 4000');
});
  */


/* 

// this code can work if qpdf will install successfully 


const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

app.post('/file-upload', upload.single('pdf'), (req, res) => {
    if (req?.file) {
        const inputFile = `./uploads/${req.file.originalname}`;
        const outputFile = `./uploads/compressed/${req.file.originalname}`;

        // Use qpdf to compress the PDF
        const qpdfCommand = `qpdf --linearize --compress-streams=y ${inputFile} ${outputFile}`;
        exec(qpdfCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return res.status(500).json('Error compressing the PDF');
            }
            return res.status(200).json('File uploaded and compressed');
        });
    } else {
        return res.status(400).json('File not uploaded');
    }
});

app.listen(4000, () => {
    console.log('App is running on port 4000');
});

 */


///////////////////////////


// const express = require('express');
// const multer = require('multer');
// const { exec } = require('child_process');
// const app = express();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });
// const upload = multer({ storage });

// app.post('/file-upload', upload.single('pdf'), (req, res) => {
//     if (req?.file) {
//         const inputFile = `./uploads/${req.file.originalname}`;
//         const outputFile = `./uploads/compressed/${req.file.originalname}`;

//         // Use Ghostscript to compress the PDF
//         const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFile} ${inputFile}`;
//         exec(gsCommand, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error: ${error}`);
//                 return res.status(500).json('Error compressing the PDF');
//             }
//             return res.status(200).json('File uploaded and compressed');
//         });
//     } else {
//         return res.status(400).json('File not uploaded');
//     }
// });

// app.listen(4000, () => {
//     console.log('App is running on port 4000');
// });




//////////////////////////////////

/* 

/// this code is completely working but want set compress level according to that i want to compress pdf 

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();

// Create directories for file uploads and compressed files if they don't exist
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

// API endpoint for file upload and compression
app.post('/file-upload', upload.single('pdf'), (req, res) => {
    if (req?.file) {
        const inputFilePath = path.join(uploadDirectory, req.file.originalname);
        const outputFilePath = path.join(compressedDirectory, req.file.originalname);

        // Use the `exec` command to compress the PDF

        const cmd = 'gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=' + outputFilePath + ' ' + inputFilePath;

        console.log('Command:', cmd);

        exec(cmd, (error, stdout, stderr) => {
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            if (error) {
                console.error('Error compressing PDF:', error);
                return res.status(500).json('Error compressing PDF');
            } else {
                console.log('PDF compressed');
                return res.status(200).json('File uploaded and compressed');
            }
        });
    }
});

app.listen(4000, () => {
    console.log('App is running on port 4000');
});
 */

