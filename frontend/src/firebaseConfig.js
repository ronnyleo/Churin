// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyBYFElKajF8HeIs_B4QeZPJS2btNgZr6pQ",
    authDomain: "gestor-documental-4fdb4.firebaseapp.com",
    projectId: "gestor-documental-4fdb4",
    storageBucket: "gestor-documental-4fdb4.appspot.com",
    messagingSenderId: "261187279224",
    appId: "1:261187279224:web:bcbce345da62a90cb3d08d"

}


// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);