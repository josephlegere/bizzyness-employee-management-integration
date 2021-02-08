const fireadmin = require('firebase-admin');
const serviceAccount = require('../keys/bizzyness-ddf6e-firebase-adminsdk-9fnf6-2f73c4402a.json');

fireadmin.initializeApp({
  credential: fireadmin.credential.cert(serviceAccount)
});

const db = fireadmin.firestore();

module.exports = db;