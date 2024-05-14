import React from "react";
import appIcon from "../assets/android-chrome-192x192.png";

const SplashScreen = () => {
    
    setTimeout(() => {
        console.log("timeout");
    }, 5000);

    return (
        <div className="w-80 m-auto p-3 flex items-center justify-center">
            <div className="splashScreenPageAppIconContainer">
                <img src={appIcon} className="splashScreenPageAppIcon"/>
            </div>
        </div>
    );
};

export default SplashScreen;