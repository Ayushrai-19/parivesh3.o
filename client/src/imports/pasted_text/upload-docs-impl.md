The Upload Documents section already exists in the Apply for Clearance page, but currently it is only UI and not functional. Implement the complete functionality for the existing upload components.

The frontend is built with React / Next.js and Tailwind CSS, and the backend uses Node.js + Express.

Do not redesign the UI.
Instead, connect functionality to the existing upload buttons and file inputs.

Functional Requirements
1. File Selection

When the user clicks Upload:

open file picker

allow selecting files

Accepted file types:

PDF
DOCX
PNG
JPG

Maximum file size:

20MB

If invalid:

Show error message.

Example:

Invalid file type
File size exceeds 20MB
2. Upload to Backend

When a file is selected:

Send it to the backend API.

Endpoint:

POST /api/documents/upload

Payload:

multipart/form-data
applicationId
documentType
file

Use axios or fetch.

Example:

const formData = new FormData();
formData.append("file", file);
formData.append("applicationId", applicationId);
formData.append("documentType", docType);

await axios.post("/api/documents/upload", formData);
3. Upload Progress

Show upload progress bar.

Example:

Uploading EIA_Report.pdf
█████████░░░ 70%

After upload:

✔ Uploaded Successfully
4. Update Document Status

After successful upload:

Change document status in UI:

Missing → Uploaded

Display badge:

Uploaded
5. Display Uploaded File

After upload:

Show file name.

Example:

EIA_Report.pdf

Provide options:

Preview
Download
Delete
6. Preview File

When user clicks Preview:

Open modal.

Behavior:

PDF → display using iframe or PDF viewer
Image → show image preview
DOCX → download or open viewer
7. Delete File

When user clicks Delete:

Show confirmation:

Delete this document?

Call API:

DELETE /api/documents/:documentId

After delete:

Status → Missing
8. Replace File

If file already exists and user uploads again:

Replace old file.

UI message:

Document replaced successfully
9. Load Existing Documents

When the Apply for Clearance page loads, fetch uploaded documents.

API:

GET /api/documents?applicationId=123

Populate UI with:

documentName
status
fileUrl
10. Enable Next Step Logic

Before allowing the user to proceed to Payment Step:

Check if all required documents are uploaded.

Logic:

if(allRequiredDocsUploaded)
   enable Next button
else
   show warning

Warning message:

Please upload all required documents before continuing.
11. Security

Ensure:

file type validation

file size validation

authenticated user upload

role-based access

Only Project Proponent can upload documents.

Expected Result

The Upload Documents section should now:

✔ allow file selection
✔ upload documents to backend
✔ show upload progress
✔ display uploaded files
✔ allow preview / download / delete
✔ update document status
✔ validate required documents