import React, { createContext, useContext, useEffect, useState } from "react";
import * as Realm from "realm-web";

const RealmContext = createContext();

export function RealmProvider({ children }) {
  const [app, setApp] = useState(new Realm.App({ id: "application-0-eetka" }));
  const [realmUser, setRealmUser] = useState(null);
  const [events, setEvents] = useState([]);

  const realmLogin = async (jwt) => {
      const user = await app.logIn(Realm.Credentials.jwt(jwt));
      console.log(user.profile);
      setRealmUser(user);

      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("InstantMessaging").collection("chatrooms");
      console.log(collection)
      for await (const change of collection.watch()) {
        setEvents((events) => [...events, change]);
      }
    }; 
  // useEffect(()=>{
  //   login(
  //     localStorage.getItem("token")
  //   );
  // },[])
  return <RealmContext.Provider value={{app,realmLogin, realmUser, events}}>{children}</RealmContext.Provider>;
}

export function useRealm() {
  const context = useContext(RealmContext);
  if (context === undefined) {
    throw new Error("useRealm must be used within a RealmProvider");
  }
  return context;
}
