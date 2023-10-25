import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: import.meta.env.FIREBASE_API_KEY,
	authDomain: "rapyd-3c123.firebaseapp.com",
	projectId: "rapyd-3c123",
	storageBucket: "rapyd-3c123.appspot.com",
	messagingSenderId: "628620783591",
	appId: "1:628620783591:web:803a020cc612a39d0d5742",
	measurementId: "G-SLVS77W9Y5"
};

const app = initializeApp(firebaseConfig)
// Firebase storage reference
const storage = getStorage(app);
export default storage;