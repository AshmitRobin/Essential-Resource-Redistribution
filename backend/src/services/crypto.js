const crypto = require('crypto');
const key = () => crypto.createHash('sha256').update(process.env.JWT_SECRET).digest();
function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((v) => v.toString('base64')).join('.');
}
function decrypt(value) {
  const [iv, tag, encrypted] = value.split('.').map((v) => Buffer.from(v, 'base64'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8'));
}
module.exports = { encrypt, decrypt };
