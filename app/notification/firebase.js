// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLB6EwaZ7LtgW68GAAKPPSg6fhUi4NwE8",
  authDomain: "im-pushnotification-4440b.firebaseapp.com",
  projectId: "im-pushnotification-4440b",
  storageBucket: "im-pushnotification-4440b.appspot.com",
  messagingSenderId: "446759565365",
  appId: "1:446759565365:web:bce88433de7dd8c69f197c",
  measurementId: "G-Z96WZK1TKB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// const analytics = getAnalytics(app);
export const getRegistrationToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log('granted token')
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BPBtLPLoyOHCo4YiyNAJ9pYdPGYu2tZXuTCozel1d3FGEtfYBMtlQnisL0vn6D8Ng1SwrAac77TzmQIpaM5w52o",
    });
    if (currentToken){
        return currentToken;
    }else{
        throw new Error('No registration token available. Request permission to generate one.');
    }
  }
};
