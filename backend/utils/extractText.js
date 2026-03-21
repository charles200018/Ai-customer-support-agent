const pdfParse = require('pdf-parse');

const SUPPORTED_MIME_TYPES = new Set(['application/pdf', 'text/plain']);

function isSupportedFile(file) {
  if (!file) return false;
  return SUPPORTED_MIME_TYPES.has(file.mimetype);
}

async function extractTextFromFile(file) {
  if (!file || !file.buffer) {
    throw new Error('File buffer is missing');
  }

  if (file.mimetype === 'text/plain') {
    return file.buffer.toString('utf-8').trim();
  }

  if (file.mimetype === 'application/pdf') {
    const result = await pdfParse(file.buffer);
    return (result.text || '').trim();
  }

  throw new Error('Unsupported file type');
}

module.exports = {
  isSupportedFile,
  extractTextFromFile
};
