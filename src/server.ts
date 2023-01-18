import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";

import * as firebaseAdmin from "firebase-admin";
import { FIREBASE_CONFIG, STORAGE_BUCKET } from "./firebase/firebase-constants";

const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "15MB" }));

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3333);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(FIREBASE_CONFIG),
  storageBucket: STORAGE_BUCKET,
});
