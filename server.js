// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);

// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { Server } = require('socket.io');
// const path = require("path");

// const User = require('./models/User');
// const Message = require('./models/Message');

// const app = express();
// const server = http.createServer(app);

// // Middleware
// app.use(express.static(path.join(__dirname, "dist")));
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// app.use(express.json());

// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected Successfully'))
//   .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// // JWT Authentication Middleware
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized: Token missing' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: 'Forbidden: Invalid token' });
//   }
// };

// // ================= REST API ROUTES ================= //

// app.get("/{*path}", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "dist/index.html")
//   );
// });

// // 1. Register User & Store Public Key
// // app.post('/api/auth/register', async (req, res) => {
// //   try {
// //     const { username, password, publicKey } = req.body;
// //     if (!username || !password || !publicKey) {
// //       return res.status(400).json({ error: 'All fields including PublicKey are required' });
// //     }

// //     const existingUser = await User.findOne({ username: username.toLowerCase() });
// //     if (existingUser) {
// //       return res.status(409).json({ error: 'Username already exists' });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 12);
// //     const newUser = await User.create({
// //       username: username.toLowerCase(),
// //       password: hashedPassword,
// //       publicKey
// //     });

// //     const token = jwt.sign(
// //       { id: newUser._id, username: newUser.username },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '7d' }
// //     );

// //     res.status(201).json({
// //       token,
// //       user: {
// //         _id: newUser._id,
// //         username: newUser.username,
// //         publicKey: newUser.publicKey
// //       }
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Server error during registration' });
// //   }
// // });

// // Register Route
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, password, publicKey, encryptedPrivateKey, privateKeyIv, keySalt } = req.body;

//     if (!username || !password || !publicKey || !encryptedPrivateKey || !privateKeyIv || !keySalt) {
//       return res.status(400).json({ error: 'Missing required cryptographic fields' });
//     }

//     const existingUser = await User.findOne({ username: username.toLowerCase() });
//     if (existingUser) {
//       return res.status(409).json({ error: 'Username already taken' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newUser = await User.create({
//       username: username.toLowerCase(),
//       password: hashedPassword,
//       publicKey,
//       encryptedPrivateKey,
//       privateKeyIv,
//       keySalt
//     });

//     const token = jwt.sign(
//       { id: newUser._id, username: newUser.username },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         _id: newUser._id,
//         username: newUser.username,
//         publicKey: newUser.publicKey,
//         encryptedPrivateKey: newUser.encryptedPrivateKey,
//         privateKeyIv: newUser.privateKeyIv,
//         keySalt: newUser.keySalt
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Registration failed' });
//   }
// });

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username: username.toLowerCase() });
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         username: user.username,
//         publicKey: user.publicKey,
//         encryptedPrivateKey: user.encryptedPrivateKey,
//         privateKeyIv: user.privateKeyIv,
//         keySalt: user.keySalt
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });

// // 2. Login User & Synchronize Public Key
// // app.post('/api/auth/login', async (req, res) => {
// //   try {
// //     const { username, password, publicKey } = req.body;
// //     const user = await User.findOne({ username: username.toLowerCase() });
// //     if (!user) return res.status(404).json({ error: 'Invalid credentials' });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

// //     // Update public key if user logged in from a device with a newly generated keypair
// //     if (publicKey && user.publicKey !== publicKey) {
// //       user.publicKey = publicKey;
// //       await user.save();
// //     }

// //     const token = jwt.sign(
// //       { id: user._id, username: user.username },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '7d' }
// //     );

// //     res.json({
// //       token,
// //       user: {
// //         _id: user._id,
// //         username: user.username,
// //         publicKey: user.publicKey
// //       }
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Server error during login' });
// //   }
// // });


// // backend/server.js -> /api/auth/login
// // app.post('/api/auth/login', async (req, res) => {
// //   try {
// //     const { username, password } = req.body;
// //     const user = await User.findOne({ username: username.toLowerCase() });
// //     if (!user) return res.status(404).json({ error: 'Invalid credentials' });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

// //     const token = jwt.sign(
// //       { id: user._id, username: user.username },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '7d' }
// //     );

// //     res.json({
// //       token,
// //       user: {
// //         _id: user._id,
// //         username: user.username,
// //         publicKey: user.publicKey
// //       }
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: 'Server error during login' });
// //   }
// // });

// // 3. Get All Contacts (along with their Public Keys)
// app.get('/api/users', authenticate, async (req, res) => {
//   try {
//     const users = await User.find({ _id: { $ne: req.user.id } })
//       .select('_id username publicKey createdAt')
//       .sort({ username: 1 });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch contacts' });
//   }
// });


// // Add this route right below app.get('/api/users')
// // Fetch total unread messages grouped by sender for current logged-in user
// app.get('/api/messages/unread-counts', authenticate, async (req, res) => {
//   try {
//     const unread = await Message.aggregate([
//       { $match: { receiver: new mongoose.Types.ObjectId(req.user.id), read: false } },
//       { $group: { _id: '$sender', count: { $sum: 1 } } }
//     ]);

//     // Format as { [senderId]: count }
//     const counts = {};
//     unread.forEach((item) => {
//       counts[item._id.toString()] = item.count;
//     });

//     res.json(counts);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch unread counts' });
//   }
// });


// // 4. Fetch Encrypted Conversation History
// app.get('/api/messages/:contactId', authenticate, async (req, res) => {
//   try {
//     const { contactId } = req.params;
//     const myId = req.user.id;

//     const messages = await Message.find({
//       $or: [
//         { sender: myId, receiver: contactId },
//         { sender: contactId, receiver: myId }
//       ]
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// });

// // ================= SOCKET.IO REAL-TIME RELAY ================= //

// const io = new Server(server, {
//   cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
// });

// // Map of userId -> socketId
// const onlineUsers = new Map();

// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) return next(new Error('Authentication error'));
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = decoded;
//     next();
//   } catch (err) {
//     next(new Error('Authentication error'));
//   }
// });

// // io.on('connection', (socket) => {
// //   const userId = socket.user.id;
// //   onlineUsers.set(userId, socket.id);

// //   // Broadcast online user IDs to everyone
// //   io.emit('online_users', Array.from(onlineUsers.keys()));

// //   // Handle Encrypted Message Transmission
// //   socket.on('send_message', async ({ receiverId, ciphertext, iv }, callback) => {
// //     try {
// //       const savedMessage = await Message.create({
// //         sender: userId,
// //         receiver: receiverId,
// //         ciphertext,
// //         iv
// //       });

// //       // Emit to receiver if online
// //       const receiverSocketId = onlineUsers.get(receiverId);
// //       if (receiverSocketId) {
// //         io.to(receiverSocketId).emit('receive_message', savedMessage);
// //       }

// //       // Acknowledge back to sender
// //       if (callback) callback({ status: 'ok', message: savedMessage });
// //     } catch (error) {
// //       if (callback) callback({ status: 'error', error: 'Failed to relay message' });
// //     }
// //   });

// //   // Handle Typing Indicator
// //   socket.on('typing', ({ receiverId, isTyping }) => {
// //     const receiverSocketId = onlineUsers.get(receiverId);
// //     if (receiverSocketId) {
// //       io.to(receiverSocketId).emit('user_typing', { senderId: userId, isTyping });
// //     }
// //   });

// //   socket.on('disconnect', () => {
// //     onlineUsers.delete(userId);
// //     io.emit('online_users', Array.from(onlineUsers.keys()));
// //   });
// // });

// // backend/server.js -> inside io.on('connection', (socket) => { ... })

// io.on('connection', (socket) => {
//   const userId = socket.user.id;
//   onlineUsers.set(userId, socket.id);

//   // Broadcast updated active list
//   io.emit('online_users', Array.from(onlineUsers.keys()));

//   // 1. Explicit Logout Event from Client
//   socket.on('logout', () => {
//     onlineUsers.delete(userId);
//     io.emit('online_users', Array.from(onlineUsers.keys()));
//     socket.disconnect(true);
//   });

//   // Handle Relay Messages
//   socket.on('send_message', async ({ receiverId, ciphertext, iv }, callback) => {
//     try {
//       const savedMessage = await Message.create({
//         sender: userId,
//         receiver: receiverId,
//         ciphertext,
//         iv
//       });

//       const receiverSocketId = onlineUsers.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit('receive_message', savedMessage);
//       }

//       if (callback) callback({ status: 'ok', message: savedMessage });
//     } catch (error) {
//       if (callback) callback({ status: 'error', error: 'Failed to relay message' });
//     }
//   });

//   // Handle Typing
//   socket.on('typing', ({ receiverId, isTyping }) => {
//     const receiverSocketId = onlineUsers.get(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('user_typing', { senderId: userId, isTyping });
//     }
//   });

//   // 2. Disconnect Handler
//   socket.on('disconnect', () => {
//     onlineUsers.delete(userId);
//     io.emit('online_users', Array.from(onlineUsers.keys()));
//   });

//   // Handle Mark Messages as Read
//   socket.on('mark_as_read', async ({ senderId }) => {
//     try {
//       // Mark all messages from senderId sent to this user as read
//       await Message.updateMany(
//         { sender: senderId, receiver: userId, read: false },
//         { $set: { read: true } }
//       );

//       // Notify the sender that their messages were read in real-time
//       const senderSocketId = onlineUsers.get(senderId);
//       if (senderSocketId) {
//         io.to(senderSocketId).emit('messages_read_by_peer', { readBy: userId });
//       }
//     } catch (err) {
//       console.error('Error marking messages read:', err);
//     }
//   });

// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 E2EE Chat Server running on port ${PORT}`));























// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);

// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { Server } = require('socket.io');
// const path = require('path');

// const User = require('./models/User');
// const Message = require('./models/Message');

// const app = express();
// const server = http.createServer(app);

// // If deployed behind a proxy/load balancer (Render, Nginx, etc.), uncomment so
// // rate limiting sees the real client IP:
// // app.set('trust proxy', 1);

// // ---------- Config ----------
// // CLIENT_URLS=http://localhost:5173,http://localhost:5174,https://chat.example.com
// const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
//   .split(',')
//   .map((s) => s.trim())
//   .filter(Boolean);

// const JWT_EXPIRY = '8h'; // matches the 8h key-cache TTL in the client
// const isProd = process.env.NODE_ENV === 'production';

// const corsOptions = {
//   origin: (origin, cb) =>
//     !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Origin not allowed')),
//   credentials: true
// };

// // ---------- Security middleware ----------
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind + inline animation-delay
//         imgSrc: ["'self'", 'data:'],
//         connectSrc: ["'self'", ...allowedOrigins, ...allowedOrigins.map((o) => o.replace(/^http/, 'ws'))],
//         objectSrc: ["'none'"],
//         baseUri: ["'none'"],
//         formAction: ["'self'"],
//         frameAncestors: ["'none'"],
//         upgradeInsecureRequests: isProd ? [] : null
//       }
//     }
//   })
// );
// app.use(cors(corsOptions));
// app.use(express.json({ limit: '50kb' }));
// app.use(express.static(path.join(__dirname, 'dist')));

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 30,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { error: 'Too many attempts. Try again later.' }
// });

// // ---------- Database ----------
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected Successfully'))
//   .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// // ---------- Helpers ----------
// const B64 = /^[A-Za-z0-9+/]+={0,2}$/;
// const isStr = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max;
// const isObjectId = (v) => typeof v === 'string' && mongoose.isValidObjectId(v);
// const USERNAME_RE = /^[a-z0-9_]{3,32}$/;

// const validPublicKey = (v) => {
//   try {
//     const k = JSON.parse(v);
//     return (
//       v.length < 400 && k.kty === 'EC' && k.crv === 'P-256' &&
//       typeof k.x === 'string' && typeof k.y === 'string'
//     );
//   } catch {
//     return false;
//   }
// };

// const signToken = (user) =>
//   jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
//     algorithm: 'HS256',
//     expiresIn: JWT_EXPIRY
//   });

// const verifyToken = (token) =>
//   jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

// // Used so login takes the same time whether or not the username exists.
// const DUMMY_HASH = bcrypt.hashSync('cipherchat-dummy', 12);

// // ---------- JWT middleware ----------
// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized: Token missing' });
//   try {
//     req.user = verifyToken(token);
//     next();
//   } catch {
//     // 401 (not 403) so the client knows to sign in again
//     return res.status(401).json({ error: 'Session expired or invalid' });
//   }
// };

// // ================= REST API ROUTES ================= //

// // Register. `password` is the client-derived auth secret (never the real password).
// app.post('/api/auth/register', authLimiter, async (req, res) => {
//   try {
//     const { username, password, publicKey, encryptedPrivateKey, privateKeyIv, keySalt } = req.body;

//     if (
//       !isStr(username, 32) || !isStr(password, 64) || !isStr(publicKey, 400) ||
//       !isStr(encryptedPrivateKey, 2000) || !isStr(privateKeyIv, 64) || !isStr(keySalt, 64)
//     ) {
//       return res.status(400).json({ error: 'Missing or invalid fields' });
//     }

//     const cleanUsername = username.trim().toLowerCase();
//     if (!USERNAME_RE.test(cleanUsername)) {
//       return res.status(400).json({ error: 'Username must be 3-32 chars: a-z, 0-9, underscore' });
//     }
//     if (password.length !== 44 || !B64.test(password)) {
//       return res.status(400).json({ error: 'Invalid credential format' });
//     }
//     if (!validPublicKey(publicKey)) {
//       return res.status(400).json({ error: 'Invalid public key' });
//     }
//     if (![encryptedPrivateKey, privateKeyIv, keySalt].every((v) => B64.test(v))) {
//       return res.status(400).json({ error: 'Invalid vault encoding' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     let newUser;
//     try {
//       newUser = await User.create({
//         username: cleanUsername,
//         password: hashedPassword,
//         publicKey,
//         encryptedPrivateKey,
//         privateKeyIv,
//         keySalt
//       });
//     } catch (err) {
//       if (err.code === 11000) return res.status(409).json({ error: 'Username already taken' });
//       throw err;
//     }

//     res.status(201).json({
//       token: signToken(newUser),
//       // The client already holds its key; no need to send the vault back.
//       user: { _id: newUser._id, username: newUser.username, publicKey: newUser.publicKey }
//     });
//   } catch (err) {
//     console.error('Register error:', err.message);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// });

// // Login. The vault is only returned AFTER the auth secret is verified.
// app.post('/api/auth/login', authLimiter, async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!isStr(username, 32) || !isStr(password, 64)) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const user = await User.findOne({ username: username.trim().toLowerCase() }).select(
//       '+password +encryptedPrivateKey +privateKeyIv +keySalt'
//     );

//     const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
//     if (!user || !isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//     res.json({
//       token: signToken(user),
//       user: {
//         _id: user._id,
//         username: user.username,
//         publicKey: user.publicKey,
//         encryptedPrivateKey: user.encryptedPrivateKey,
//         privateKeyIv: user.privateKeyIv,
//         keySalt: user.keySalt
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).json({ error: 'Login failed' });
//   }
// });

// // Contacts (public keys only, never vault data)
// app.get('/api/users', authenticate, async (req, res) => {
//   try {
//     const users = await User.find({ _id: { $ne: req.user.id } })
//       .select('_id username publicKey createdAt')
//       .sort({ username: 1 });
//     res.json(users);
//   } catch {
//     res.status(500).json({ error: 'Failed to fetch contacts' });
//   }
// });

// // Unread counts grouped by sender. Must be declared BEFORE '/api/messages/:contactId'.
// app.get('/api/messages/unread-counts', authenticate, async (req, res) => {
//   try {
//     const unread = await Message.aggregate([
//       { $match: { receiver: new mongoose.Types.ObjectId(req.user.id), read: false } },
//       { $group: { _id: '$sender', count: { $sum: 1 } } }
//     ]);
//     const counts = {};
//     unread.forEach((item) => {
//       counts[item._id.toString()] = item.count;
//     });
//     res.json(counts);
//   } catch {
//     res.status(500).json({ error: 'Failed to fetch unread counts' });
//   }
// });

// // Encrypted conversation history
// app.get('/api/messages/:contactId', authenticate, async (req, res) => {
//   try {
//     const { contactId } = req.params;
//     if (!isObjectId(contactId)) return res.status(400).json({ error: 'Invalid contact id' });
//     const myId = req.user.id;

//     const messages = await Message.find({
//       $or: [
//         { sender: myId, receiver: contactId },
//         { sender: contactId, receiver: myId }
//       ]
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch {
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// });

// // Unknown API routes -> JSON 404 (never the SPA's index.html)
// app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// // SPA fallback: MUST be last, otherwise it swallows every GET API route above.
// app.get('/{*path}', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// // ================= SOCKET.IO REAL-TIME RELAY ================= //

// const io = new Server(server, {
//   cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true }
// });

// // userId -> number of open sockets (tabs/devices)
// const connections = new Map();
// const broadcastOnline = () => io.emit('online_users', Array.from(connections.keys()));

// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;
//   if (!token) return next(new Error('Authentication error'));
//   try {
//     socket.user = verifyToken(token);
//     next();
//   } catch {
//     next(new Error('Authentication error'));
//   }
// });

// io.on('connection', (socket) => {
//   const userId = String(socket.user.id);

//   // One room per user: every tab/device of that user receives events, and a
//   // refresh (old socket disconnecting after the new one connects) cannot
//   // knock the user offline or drop messages.
//   socket.join(userId);
//   connections.set(userId, (connections.get(userId) || 0) + 1);
//   broadcastOnline();

//   socket.on('logout', () => socket.disconnect(true));

//   socket.on('send_message', async (payload, callback) => {
//     const ack = typeof callback === 'function' ? callback : () => {};
//     try {
//       const { receiverId, ciphertext, iv } = payload || {};
//       if (
//         !isObjectId(receiverId) ||
//         !isStr(ciphertext, 24000) || !B64.test(ciphertext) ||
//         !isStr(iv, 16) || !B64.test(iv)
//       ) {
//         return ack({ status: 'error', error: 'Invalid message' });
//       }
//       if (!(await User.exists({ _id: receiverId }))) {
//         return ack({ status: 'error', error: 'Recipient not found' });
//       }

//       const savedMessage = await Message.create({
//         sender: userId,
//         receiver: receiverId,
//         ciphertext,
//         iv
//       });

//       io.to(String(receiverId)).emit('receive_message', savedMessage);
//       ack({ status: 'ok', message: savedMessage });
//     } catch (err) {
//       console.error('send_message error:', err.message);
//       ack({ status: 'error', error: 'Failed to relay message' });
//     }
//   });

//   socket.on('typing', (payload) => {
//     const { receiverId, isTyping } = payload || {};
//     if (!isObjectId(receiverId)) return;
//     io.to(String(receiverId)).emit('user_typing', { senderId: userId, isTyping: Boolean(isTyping) });
//   });

//   socket.on('mark_as_read', async (payload) => {
//     try {
//       const { senderId } = payload || {};
//       if (!isObjectId(senderId)) return;

//       await Message.updateMany(
//         { sender: senderId, receiver: userId, read: false },
//         { $set: { read: true } }
//       );
//       io.to(String(senderId)).emit('messages_read_by_peer', { readBy: userId });
//     } catch (err) {
//       console.error('Error marking messages read:', err.message);
//     }
//   });

//   socket.on('disconnect', () => {
//     const remaining = (connections.get(userId) || 1) - 1;
//     if (remaining <= 0) connections.delete(userId);
//     else connections.set(userId, remaining);
//     broadcastOnline();
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 E2EE Chat Server running on port ${PORT}`));









const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const path = require('path');

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// If deployed behind a proxy/load balancer (Render, Nginx, etc.), uncomment so
// rate limiting sees the real client IP:
// app.set('trust proxy', 1);

// ---------- Config ----------
// CLIENT_URLS=http://localhost:5173,http://localhost:5174,https://chat.example.com
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const JWT_EXPIRY = '8h'; // matches the 8h key-cache TTL in the client
const isProd = process.env.NODE_ENV === 'production';

// Browsers send an Origin header on same-origin POSTs too, so never throw here.
// Unlisted origins simply get no CORS headers (the browser blocks them), while
// requests from the page this server serves itself keep working.
const corsOptions = {
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true
};

// ---------- Security middleware ----------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind + inline animation-delay
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", ...allowedOrigins, ...allowedOrigins.map((o) => o.replace(/^http/, 'ws'))],
        objectSrc: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null
      }
    }
  })
);
app.use(cors(corsOptions));
app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'dist')));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' }
});

// ---------- Database ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ---------- Helpers ----------
const B64 = /^[A-Za-z0-9+/]+={0,2}$/;
const isStr = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max;
const isObjectId = (v) => typeof v === 'string' && mongoose.isValidObjectId(v);
const USERNAME_RE = /^[a-z0-9_]{3,32}$/;

const validPublicKey = (v) => {
  try {
    const k = JSON.parse(v);
    return (
      v.length < 400 && k.kty === 'EC' && k.crv === 'P-256' &&
      typeof k.x === 'string' && typeof k.y === 'string'
    );
  } catch {
    return false;
  }
};

const signToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRY
  });

const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

// Used so login takes the same time whether or not the username exists.
const DUMMY_HASH = bcrypt.hashSync('cipherchat-dummy', 12);

// ---------- JWT middleware ----------
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: Token missing' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    // 401 (not 403) so the client knows to sign in again
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
};

// ================= REST API ROUTES ================= //

// Register. `password` is the client-derived auth secret (never the real password).
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { username, password, publicKey, encryptedPrivateKey, privateKeyIv, keySalt } = req.body;

    if (
      !isStr(username, 32) || !isStr(password, 64) || !isStr(publicKey, 400) ||
      !isStr(encryptedPrivateKey, 2000) || !isStr(privateKeyIv, 64) || !isStr(keySalt, 64)
    ) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!USERNAME_RE.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username must be 3-32 chars: a-z, 0-9, underscore' });
    }
    if (password.length !== 44 || !B64.test(password)) {
      return res.status(400).json({ error: 'Invalid credential format' });
    }
    if (!validPublicKey(publicKey)) {
      return res.status(400).json({ error: 'Invalid public key' });
    }
    if (![encryptedPrivateKey, privateKeyIv, keySalt].every((v) => B64.test(v))) {
      return res.status(400).json({ error: 'Invalid vault encoding' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let newUser;
    try {
      newUser = await User.create({
        username: cleanUsername,
        password: hashedPassword,
        publicKey,
        encryptedPrivateKey,
        privateKeyIv,
        keySalt
      });
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ error: 'Username already taken' });
      throw err;
    }

    res.status(201).json({
      token: signToken(newUser),
      // The client already holds its key; no need to send the vault back.
      user: { _id: newUser._id, username: newUser.username, publicKey: newUser.publicKey }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login. The vault is only returned AFTER the auth secret is verified.
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!isStr(username, 32) || !isStr(password, 64)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() }).select(
      '+password +encryptedPrivateKey +privateKeyIv +keySalt'
    );

    const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
    if (!user || !isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      token: signToken(user),
      user: {
        _id: user._id,
        username: user.username,
        publicKey: user.publicKey,
        encryptedPrivateKey: user.encryptedPrivateKey,
        privateKeyIv: user.privateKeyIv,
        keySalt: user.keySalt
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Contacts (public keys only, never vault data)
app.get('/api/users', authenticate, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('_id username publicKey createdAt')
      .sort({ username: 1 });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Unread counts grouped by sender. Must be declared BEFORE '/api/messages/:contactId'.
app.get('/api/messages/unread-counts', authenticate, async (req, res) => {
  try {
    const unread = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(req.user.id), read: false } },
      { $group: { _id: '$sender', count: { $sum: 1 } } }
    ]);
    const counts = {};
    unread.forEach((item) => {
      counts[item._id.toString()] = item.count;
    });
    res.json(counts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch unread counts' });
  }
});

// Encrypted conversation history
app.get('/api/messages/:contactId', authenticate, async (req, res) => {
  try {
    const { contactId } = req.params;
    if (!isObjectId(contactId)) return res.status(400).json({ error: 'Invalid contact id' });
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: contactId },
        { sender: contactId, receiver: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Unknown API routes -> JSON 404 (never the SPA's index.html)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// SPA fallback: MUST be last, otherwise it swallows every GET API route above.
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ================= SOCKET.IO REAL-TIME RELAY ================= //

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true }
});

// userId -> number of open sockets (tabs/devices)
const connections = new Map();
const broadcastOnline = () => io.emit('online_users', Array.from(connections.keys()));

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    socket.user = verifyToken(token);
    next();
  } catch {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = String(socket.user.id);

  // One room per user: every tab/device of that user receives events, and a
  // refresh (old socket disconnecting after the new one connects) cannot
  // knock the user offline or drop messages.
  socket.join(userId);
  connections.set(userId, (connections.get(userId) || 0) + 1);
  broadcastOnline();

  socket.on('logout', () => socket.disconnect(true));

  socket.on('send_message', async (payload, callback) => {
    const ack = typeof callback === 'function' ? callback : () => {};
    try {
      const { receiverId, ciphertext, iv } = payload || {};
      if (
        !isObjectId(receiverId) ||
        !isStr(ciphertext, 24000) || !B64.test(ciphertext) ||
        !isStr(iv, 16) || !B64.test(iv)
      ) {
        return ack({ status: 'error', error: 'Invalid message' });
      }
      if (!(await User.exists({ _id: receiverId }))) {
        return ack({ status: 'error', error: 'Recipient not found' });
      }

      const savedMessage = await Message.create({
        sender: userId,
        receiver: receiverId,
        ciphertext,
        iv
      });

      io.to(String(receiverId)).emit('receive_message', savedMessage);
      ack({ status: 'ok', message: savedMessage });
    } catch (err) {
      console.error('send_message error:', err.message);
      ack({ status: 'error', error: 'Failed to relay message' });
    }
  });

  socket.on('typing', (payload) => {
    const { receiverId, isTyping } = payload || {};
    if (!isObjectId(receiverId)) return;
    io.to(String(receiverId)).emit('user_typing', { senderId: userId, isTyping: Boolean(isTyping) });
  });

  socket.on('mark_as_read', async (payload) => {
    try {
      const { senderId } = payload || {};
      if (!isObjectId(senderId)) return;

      await Message.updateMany(
        { sender: senderId, receiver: userId, read: false },
        { $set: { read: true } }
      );
      io.to(String(senderId)).emit('messages_read_by_peer', { readBy: userId });
    } catch (err) {
      console.error('Error marking messages read:', err.message);
    }
  });

  socket.on('disconnect', () => {
    const remaining = (connections.get(userId) || 1) - 1;
    if (remaining <= 0) connections.delete(userId);
    else connections.set(userId, remaining);
    broadcastOnline();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 E2EE Chat Server running on port ${PORT}`));