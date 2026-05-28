// release.js - Runs in GitHub actions to publish the update
const path = require('path');
const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const pkg = require('../package.json');

async function publishUpdate() {
  console.log(`Starting automated release for version ${pkg.version}...`);

  // 1. Authenticate with Firebase using Github Secret
  const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountStr) {
    console.error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
    process.exit(1);
  }
  
  const serviceAccount = JSON.parse(Buffer.from(serviceAccountStr, 'base64').toString('ascii'));
  
  initializeApp({
    credential: cert(serviceAccount),
    // You must add your storage bucket name here (can also be an env var)
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '<YOUR_PROJECT_ID>.appspot.com' 
  });

  const db = getFirestore();
  const bucket = getStorage().bucket();

  // 2. Find the built .exe file
  const releaseDir = path.join(__dirname, '..', 'release');
  const files = fs.readdirSync(releaseDir);
  const exeFile = files.find(f => f.endsWith('.exe') && !f.includes('blockmap'));
  
  if (!exeFile) {
    console.error("Could not find the compiled .exe file in the release directory.");
    process.exit(1);
  }

  const exePath = path.join(releaseDir, exeFile);
  const destinationPath = `updates/${pkg.version}/${exeFile}`;

  console.log(`Uploading ${exeFile} to Firebase Storage...`);
  
  // 3. Upload to Firebase Storage
  await bucket.upload(exePath, {
    destination: destinationPath,
    metadata: {
      contentType: 'application/x-msdownload',
    }
  });

  // 4. Make it public and get the URL
  const fileRef = bucket.file(destinationPath);
  await fileRef.makePublic();
  const url = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;

  // 5. Update Firestore 'updates/latest'
  console.log(`Updating Firestore with new version URL: ${url}`);
  await db.collection('updates').doc('latest').set({
    version: pkg.version,
    url: url,
    releaseNotes: `Automated release of version ${pkg.version}`,
    createdAt: Date.now()
  });

  console.log("Release successfully pushed to Firebase!");
}

publishUpdate().catch(console.error);

