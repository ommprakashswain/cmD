// release.js - Runs in GitHub actions to publish the update
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const pkg = require('../package.json');

async function publishUpdate() {
  console.log(`Starting automated release for version ${pkg.version}...`);

  // 1. Authenticate with Supabase using Env Vars
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

  console.log(`Uploading ${exeFile} to Supabase Storage...`);
  
  // 3. Upload to Supabase Storage
  const fileBuffer = fs.readFileSync(exePath);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('updates')
    .upload(destinationPath, fileBuffer, {
      contentType: 'application/x-msdownload',
      upsert: true
    });

  if (uploadError) {
    console.error("Failed to upload to Supabase Storage:", uploadError);
    process.exit(1);
  }

  // 4. Construct the Supabase Storage public URL
  const { data: { publicUrl } } = supabase.storage
    .from('updates')
    .getPublicUrl(destinationPath);

  // 5. Update Supabase 'updates' table
  console.log(`Updating Supabase with new version URL: ${publicUrl}`);
  const { error: dbError } = await supabase
    .from('updates')
    .insert([
      {
        version: pkg.version,
        url: publicUrl,
        releaseNotes: `Automated release of version ${pkg.version}`
      }
    ]);

  if (dbError) {
    console.error("Failed to update database record:", dbError);
    process.exit(1);
  }

  console.log("Release successfully pushed to Supabase!");
}

publishUpdate().catch(console.error);
