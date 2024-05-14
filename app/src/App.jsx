import { useState} from "react";
import "./App.css";
import Home from "./pages/home.jsx";
import Profile from "./pages/profile.jsx";
import CreateQuiz from "./pages/createQuiz";
import Chat from "./compnents/chatroom/Chat.jsx";
import Quiz from "./compnents/quiz/Quiz.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import AddNewGroup from "./pages/addNewGroup";
import ChatRoomInformation from "./pages/chatRoomInformation";
import GroupMemberProfile from "./pages/groupMemberProfile";
import QuizQuestion from "./pages/quizQuestion"
import QuizInformation from "./pages/quizInformation"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { RealmProvider } from "./providers/RealmProvider.jsx";
import { HistoryProvider } from "./providers/HistoryProvider.jsx";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import SplashScreen from "./pages/splashScreen";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <RealmProvider>
      <AuthProvider>
      <Router>
        <HistoryProvider>

          <Route path="/splashScreen" component={SplashScreen} />

          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} />
          <Route path="/registration" component={Registration} />
          <Route path="/profile" component={Profile} />
          <Route path="/addNewGroup" component={AddNewGroup} />
          <Route path="/chatroom/:chatRoomId" component={Chat} />
          <Route path="/chatRoomInformation/:chatRoomId" component={ChatRoomInformation} />
          <Route path="/groupMemberProfile/:userId" component={GroupMemberProfile} />
          <Route path="/createQuiz" component={CreateQuiz}/>
          <Route path="/quiz/:roomId" component={Quiz} />
          <Route path="/quizQuestion" component={QuizQuestion} />
          <Route path="/quizInformation/:quizId" component={QuizInformation} />  
      </HistoryProvider>
      </Router>
      </AuthProvider>
    </RealmProvider>
    <ReactQueryDevtools/>
    </QueryClientProvider>
  );
}

export default App;
