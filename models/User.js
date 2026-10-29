// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     trim: true,
//     lowercase: true 
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   publicKey: { 
//     type: String, 
//     required: true 
//   },
//   // Zero-Knowledge Encrypted Private Key (Safe for server to hold)
//   encryptedPrivateKey: {
//     type: String,
//     required: true
//   },
//   privateKeyIv: {
//     type: String,
//     required: true
//   },
//   keySalt: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');

const validPublicKey = (v) => {
  try {
    const k = JSON.parse(v);
    return k.kty === 'EC' && k.crv === 'P-256' &&
           typeof k.x === 'string' && typeof k.y === 'string' && v.length < 400;
  } catch { return false; }
};

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true, trim: true, lowercase: true,
    match: /^[a-z0-9_]{3,32}$/            // blocks odd characters / markup
  },
  password: { type: String, required: true, select: false },   // bcrypt(authSecret)
  publicKey: {
    type: String, required: true,
    immutable: true,                       // nobody can swap it after registration
    validate: validPublicKey
  },
  // Opaque vault blobs: hidden by default so they can't leak through a normal query
  encryptedPrivateKey: { type: String, required: true, select: false, maxlength: 2000 },
  privateKeyIv:        { type: String, required: true, select: false, maxlength: 64 },
  keySalt:             { type: String, required: true, select: false, maxlength: 64 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);