import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDs8sT5FFd8_lPxGUIaaG6nHpfI63ff0uw",
    authDomain: "agentathon-211ed.firebaseapp.com",
    projectId: "agentathon-211ed",
    storageBucket: "agentathon-211ed.firebasestorage.app",
    messagingSenderId: "80132849012",
    appId: "1:80132849012:web:a270ce77b6da031a3e8021",
    measurementId: "G-Y8TBVZE1EC"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:5173', // or your production URL
    handleCodeInApp: true,
};
