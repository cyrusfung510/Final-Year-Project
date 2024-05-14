import React, { createContext, useMemo } from "react";
import JoinedChatGroupList from "../compnents/JoinedChatGroupList";
import JoinedQuizGroupList from "../compnents/JoinedQuizGroupList";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuth";
import { IoPersonAdd, IoSearch } from "react-icons/io5";
import { useGetQuizRoom, useGetChatRooms, useGetRegistrationToken} from "../../services/queries";
import moment from "moment";
import { getRegistrationToken } from "../../notification/firebase";
import { useUpdateRegistrationToken } from "../../services/mutation";

const Home = () => {
  const [systemSelected, setSystemSelected] = useState("Chat");
  const { user } = useAuth();
  const history = useHistory();
  // const [allChatRooms, setAllChatRooms] = useState([]);
  const [toBeDisplayedChatRooms, setToBeDisplayedChatRooms] = useState([]);
  const [toBeDisplayedQuizRooms, setToBeDisplayedQuizRooms] = useState([]);
  useAuthentication("login");

  const handleAddGroup = async () => {
    history.push("/addNewGroup");
  };

  const handleShowProfile = async () => {
    history.push("/profile");
  };

  const handleChatQuizRoomSearch = (e) => {
    const current_target_name = e.target.value;
    if (systemSelected === "Chat") {
      const newToBeDisplayedChatRooms = allChatRooms.filter(
        (inspecting_chatRoom) =>
          inspecting_chatRoom.chatRoomName
            .toLowerCase()
            .includes(current_target_name.toLowerCase())
      );
      setToBeDisplayedChatRooms(newToBeDisplayedChatRooms);
    } else if (systemSelected === "Quiz") {
      //to be tested
      const newToBeDisplayedQuizRooms = allQuizRooms.filter(
        (inspecting_quizRoom) =>
          inspecting_quizRoom.quizRoomName
            .toLowerCase()
            .includes(current_target_name.toLowerCase())
      );
      setToBeDisplayedQuizRooms(newToBeDisplayedQuizRooms);
    }
  };

  const handleSystemSelection = (selectedSystem) => {
    setSystemSelected(selectedSystem);
    document.getElementById("default-search").value = "";
    document.getElementById(
      "default-search"
    ).placeholder = `Search for ${selectedSystem.toLowerCase()} group`;
  };

  //retrieve joined chat room list for chat system
  const chatRoom = useGetChatRooms();
  const allChatRooms = useMemo(() => {
    return (Array.isArray(chatRoom?.data) ? chatRoom?.data : [])
      .map((data_element) => ({
        chatRoomName: data_element.chatRoomName,
        chatRoomId: data_element.chatRoomId,
        chatRoomImage: data_element.chatRoomImage,
        chatRoomSentDate: data_element.sentDate,
        chatRoomCreatedAt: data_element.createdAt,
        chatRoomDateCombine: Number(moment(data_element.sentDate).format("YYYYMMDD") + moment(data_element.sentDate).format("HH:mm:ss").split(":").join("")) ||
          Number(moment(data_element.createdAt).format("YYYYMMDD") + moment(data_element.createdAt).format("HH:mm:ss").split(":").join("")),
        unseenMessageNumber: data_element.unseenMessageNumber,
      }))
      .sort(
        (compareObj1, compareObj2) =>
          compareObj2.chatRoomDateCombine - compareObj1.chatRoomDateCombine
      );
  }, [chatRoom.data]);

  //retrieve joined quiz room list for quiz system
  //modify this section later
  const quizRoom = useGetQuizRoom();
  const allQuizRooms = useMemo(() => {
    return (Array.isArray(quizRoom?.data) ? quizRoom?.data : [])
      .map((data_element) => ({
          quizRoomName: data_element.chatRoomName,
          quizRoomId: data_element._id,
          quizRoomImage: data_element.chatRoomImage,
          quizRoomSentDate: data_element.lastQuizSentDate,
          quizRoomDateCombine: Number(
            moment(data_element.lastQuizSentDate).format("YYYYMMDD") + moment(data_element.lastQuizSentDate).format("HH:mm:ss").split(":").join("")
          ) || 0
      }))
      .sort(
        (compareObj1, compareObj2) =>
        compareObj2.quizRoomDateCombine - compareObj1.quizRoomDateCombine
      );
  }, [quizRoom.data]);

  //console.log(allQuizRooms);  //for testing

  useEffect(() => {
    if (quizRoom.data) {
      setToBeDisplayedQuizRooms(allQuizRooms);
    }
    if (chatRoom.data) {
      setToBeDisplayedChatRooms(allChatRooms);
    }

  }, [quizRoom.data, chatRoom.data]);
  const {data:token} = useGetRegistrationToken();
  const updateTokenMutation = useUpdateRegistrationToken();

  const fetchToken = async () => {
    const myToken = await getRegistrationToken();
    //console.log('myToken', myToken, token ,myToken == token,);
    if(myToken != token){
      updateTokenMutation.mutate(myToken)
    }

  }

  useEffect(() => {
    if(user){
      fetchToken();
    }
  }, [user]);

  return (
    <Router>
      <div className="w-80 m-auto p-3 test cursor-pointer">
        <div
          onClick={handleShowProfile}
          className="homePageProfileImageNameIdentityContainer"
        >
          <img
            className="homePageProfileImage"
            src={user?.profile_image || defaultProfileImage}
            alt="profile"
          />
          <div className="homePageNameIdentityContainer ">
            <div className="homePageName " onClick={handleShowProfile}>
              {user?.nickname}
            </div>
            <p className="homePageIdentity">{user?.role}</p>
          </div>
        </div>

        <div className="homePageChatQuizSystemAccessGroupAddButtonContainer">
          <button
            id="Chat"
            className="homePageChatSystemAccessButton"
            onClick={(e) => handleSystemSelection(e.target.id)}
          >
            Chat
          </button>
          <button
            id="Quiz"
            className="homePageQuizSystemAccessButton"
            onClick={(e) => handleSystemSelection(e.target.id)}
          >
            Quiz
          </button>
          <Link to="/addNewGroup" className="groupAddButton">
            <button className="homePageGroupAddButton" onClick={handleAddGroup}>
              <div className="homePageGroupAddIconContainer">
                <IoPersonAdd />
              </div>
            </button>
          </Link>
        </div>

        <form>
          <label htmlFor="default-search" className="homePageGroupSearchLabel">
            Search
          </label>
          <div className="homePageGroupSearchIconInputContainer">
            <IoSearch />
            <input
              type="search"
              id="default-search"
              className="homePageGroupSearchInput"
              onChange={(e) => handleChatQuizRoomSearch(e)}
              placeholder="Search for chat group"
              autoComplete="off"
            />
          </div>
        </form>

        <br></br>

        <div className="ChatQuizListComponentContainer">
          {systemSelected === "Chat" && (
            <JoinedChatGroupList
              toBeDisplayedChatRoomList={toBeDisplayedChatRooms}
            />
          )}
          {systemSelected === "Quiz" && (
            <JoinedQuizGroupList
              toBeDisplayedQuizRoomList={toBeDisplayedQuizRooms}
            />
          )}
        </div>
      </div>
    </Router>
  );
};

export default Home;
