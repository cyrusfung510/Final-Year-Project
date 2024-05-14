import React, { useContext } from "react";
import { useState } from "react";
import { HistoryContext } from "../providers/HistoryProvider";

const ChatRoomMemberList = (props) => {
    const userInfoObj = props.userInformation;
    const otherMemberInfoObjList = props.otherMemberInformation;
    const removeChatRoomMemberFromGroup = props.removeMemberFromGroup;
    const addOrRemoveAdmin = props.addRemoveAdmin;
    const history = useContext(HistoryContext);

    const [otherMemberSettingPanelActivation, setOtherMemberSettingPanelActivation] = useState(Array.apply(null, Array(otherMemberInfoObjList.length)).map(() => {return false;}));
    
    const handleActivateOtherMemberSettingPanel = (IdxConcerned) => {
        const tempOtherMemberSettingPanelActivation = otherMemberSettingPanelActivation.slice();
        tempOtherMemberSettingPanelActivation[IdxConcerned] = !tempOtherMemberSettingPanelActivation[IdxConcerned];
        setOtherMemberSettingPanelActivation(tempOtherMemberSettingPanelActivation);
    }

    return (
      <div className="chatRoomInformationPageChatRoomMemberListDisplay">
        <div className="chatRoomInformationPageMemberListUserInfoContainer">
          <div className="chatRoomInformationPageMemberListUserInformationDisplayContainer">
            <img
              src={userInfoObj.memberProfileImage}
              className="chatRoomInformationPageMemberListUserProfileImage"
            />
            <div className="chatRoomInformationPageMemberListUserFullNameJoinDateContainer">
              <p className="chatRoomInformationPageMemberListUserFullName">
                {userInfoObj.memberLastName +
                  ", " +
                  userInfoObj.memberFirstName}
              </p>
              <p className="chatRoomInformationPageMemberListUserJoinDate">
                {"Join date: " + userInfoObj.memberJoinDate}
              </p>
            </div>
            <p className="chatRoomInformationPageMemberListUserIsChatRoomAdmin">
              {userInfoObj.memberIsChatRoomAdmin === true ? "Admin" : "Member"}
            </p>
          </div>
        </div>

        {otherMemberInfoObjList.map(
          (otherMemberInfoObj, otherMemberInfoObjIdx) => (
            <div
              className="chatRoomInformationPageMemberListMemberInfoContainer"
              key={otherMemberInfoObj.memberUserID}
            >
              <div
                className="chatRoomInformationPageMemberListMemberInformationDisplayContainer"
                onClick={() =>
                  handleActivateOtherMemberSettingPanel(otherMemberInfoObjIdx)
                }
              >
                <img
                  src={otherMemberInfoObj.memberProfileImage}
                  className="chatRoomInformationPageMemberListMemberProfileImage"
                />
                <div className="chatRoomInformationPageMemberListMemberFullNameJoinDateContainer">
                  <p className="chatRoomInformationPageMemberListMemberFullName">
                    {otherMemberInfoObj.memberLastName +
                      ", " +
                      otherMemberInfoObj.memberFirstName}
                  </p>
                  <p className="chatRoomInformationPageMemberListMemberJoinDate">
                    {"Join date: " + otherMemberInfoObj.memberJoinDate}
                  </p>
                </div>
                <p className="chatRoomInformationPageMemberListMemberIsChatRoomAdmin">
                  {otherMemberInfoObj.memberIsChatRoomAdmin === true
                    ? "Admin"
                    : "Member"}
                </p>
              </div>
              {otherMemberSettingPanelActivation[otherMemberInfoObjIdx] ===
                true && (
                <div className="chatRoomInformationPageMemberListMemberSettingPanelContainer">
                  <button
                    onClick={() =>
                      history.push(
                        `/groupMemberProfile/${otherMemberInfoObj.memberUserID}`,{memberInfo: otherMemberInfoObj}
                      )
                    }
                    className="chatRoomInformationPageMemberListViewMemberProfileButton"
                  >
                    Profile
                  </button>
                  {userInfoObj.memberIsChatRoomAdmin === true && (
                    <button
                      className="chatRoomInformationPageMemberListRemoveMemberFromGroupButton"
                      onClick={() =>
                        removeChatRoomMemberFromGroup(
                          otherMemberInfoObj.memberUserID
                        )
                      }
                    >
                      Remove from Group
                    </button>
                  )}
                  {userInfoObj.memberIsChatRoomAdmin === true && (
                    <button
                      className="chatRoomInformationPageMemberListRemoveMemberAdminButton"
                      onClick={() =>
                        addOrRemoveAdmin(otherMemberInfoObj.memberUserID)
                      }
                    >
                      {otherMemberInfoObj.memberIsChatRoomAdmin === true
                        ? "Remove Admin"
                        : "Add Admin"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
}

export default ChatRoomMemberList;