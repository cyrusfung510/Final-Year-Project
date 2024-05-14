import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useRealm } from "../providers/RealmProvider";


const useAuthentication = (redirectedPage)=> {
    const history = useHistory();
    const {getUserProfile} = useAuth();
    const {realmLogin, realmUser} = useRealm();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || token == "undefined") {
            history.push(redirectedPage);
        } else {
            getUserProfile()
                .then((res) => {
                    if (res.status >= 400 && res.status < 500) {
                        history.push(redirectedPage);
                    } else {
                        
                        if (history.location.pathname == "/login" || history.location.pathname == "/registration") {
                            history.push("/");
                        }
                        if (realmUser == null) {
                            realmLogin(token);
                        }
                        
                    }
                })
                .catch((error) => {
                    console.error("Error occurred while fetching user profile:", error);
                    history.push(redirectedPage);
                });
        }
    }, []);
    
}

export default useAuthentication;