const express = require("express");
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const app = express();
const stpath = path.join(__dirname, "../public/");
// const port = process.env.PORT || 5000;
const { google } = require("googleapis");
const readline = require('readline');

const cors = require('cors');
app.use(cors());



const connectDB = require('./database');
const Certificate = require('./models/Certificate');
connectDB();




let fileLink = "https://drive.google.com/file/d/"



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(stpath));

app.get("/", (req, res) => {
  res.redirect("index.html");
});

const credentials = require('./credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

const oAuth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

function authorize(callback) {
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.log('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      callback(oAuth2Client);
    });
  });
}


async function addDetails(myPDF, text) {
  // console.log("Function is called");
  const certPDF = fs.readFileSync(myPDF);
  const pdfDoc = await PDFDocument.load(certPDF);
  const page = pdfDoc.getPages()[0];
  page.drawText(text, {
    x: 450,
    y: 350,
    size: 30,
    color: rgb(0, 0, 0),
  });
  const pdfBytes = await pdfDoc.save();

  const outputPath = path.join(__dirname, 'certs', `${text}.pdf`);
  fs.writeFileSync(outputPath, pdfBytes);
  return pdfBytes;
}

 function uploadFile(auth, filePath, fileName) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: fileName,
    parents: ['1ZNXHOZgBhS-i-W4y0jrjarT-438pPsz4']
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    async (err, file) => {
      if (err) {
        console.log('Error uploading file: ', err);
        return;
      }
      fileLink = fileLink + file.data.id;

      console.log('File uploaded successfully, file ID: ', fileLink);




 // Save data to MongoDB
    const certificate = new Certificate({
      "recipientName": fileName,
      "completionDate": Date.now(),
      "certificateLink": fileLink,
    });
console.log("Data saved:..................", certificate);
    const savedCertificate = await certificate.save();
    console.log('Data saved:', savedCertificate);



      makeFilePublic(auth, file.data.id);
      // return fileLink;
    }
  );
}

function makeFilePublic(auth, fileId) {
  const drive = google.drive({ version: 'v3', auth });
  const permission = {
    type: 'anyone',
    role: 'reader',
  };
  drive.permissions.create(
    {
      fileId: fileId,
      resource: permission,
    },
    (err, res) => {
      if (err) {
        console.log('Error setting file permissions: ', err);
        return;
      }
      // console.log('File is now publicly accessible!');
    }
  );
}
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.log('Error while trying to retrieve access token', err);
    oAuth2Client.setCredentials(token);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    res.send('Authentication successful! You can now upload the PDF.');
  });
});


app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post("/submit", async (req, res) => {


  const name = req.body.name || 'Blank';
  console.log(`This is the name: ${name}`);
  const myPDF = path.join(__dirname, "../public/img/certificate.pdf");
  const newPDF = await addDetails(myPDF, name);
  const filePath = path.join(__dirname, 'certs', `${name}.pdf`);
  const fileName = `${name}.pdf`;

  authorize((auth) => {
    uploadFile(auth, filePath, fileName);
  });
  res.send("Success");
  // res.json({ message: 'Certificate created cessfully!', fileLink });
});



const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Web service is running on port ${PORT}`);
});

// app.use(cors({ origin: 'http://localhost:3000' }));
