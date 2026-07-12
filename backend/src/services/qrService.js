const QRCode = require('qrcode');

const generateQRCodeDataURL = async (text) => {
  return await QRCode.toDataURL(text);
};

const generateQRCodeBuffer = async (text) => {
  return await QRCode.toBuffer(text, { type: 'png' });
};

module.exports = { generateQRCodeDataURL, generateQRCodeBuffer };
