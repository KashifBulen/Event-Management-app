import admin, { ServiceAccount } from "firebase-admin";
import { serviceAccountJson } from "../mttrs-service-account";

//Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson() as ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: "mttrs-f9261"
});
