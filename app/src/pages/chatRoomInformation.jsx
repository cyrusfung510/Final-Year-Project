import React, { useEffect, useLayoutEffect } from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { useState, useMemo} from "react";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import dropDownIcon from "../assets/dropDownIcon.png";
import { CiEdit } from "react-icons/ci";
import ChatRoomMemberList from "../compnents/ChatRoomMemberList";
import GroupMemberInvitationList from "../compnents/GroupMemberInvitationList";
import { useAuth } from "../providers/AuthProvider";
import moment from "moment";
import { toast } from "react-toastify";
import { useGetChatRoomInformation } from "../../services/queries";
import { useUpdateChatRoomInformation, useLeaveChatRoom } from "../../services/mutation";

const ChatRoomInformation = () => {
  const history = useHistory();
  const { chatRoomId } = useParams();
  const location = useLocation();
  const { groupName, groupImage } = location.state;
  const { user } = useAuth();
  const [newGroupName, setNewGroupName] = useState(groupName);
  const [showHideMemberList, setShowHideMemberList] = useState(false);
  const [showHideMemberListButtonText, setShowHideMemberListButtonText] =
    useState("Show");
  const [chatRoomProfileImage, setChatRoomProfileImage] = useState(
    groupImage || defaultProfileImage
  ); //this value should be retrieved from the database
  const [privacySelectMenuActivation, setPrivacySelectMenuActivation] =
    useState(false);
  const [privacySelectMenuButtonText, setPrivacySelectMenuButtonText] =
    useState("Private"); //this value should be retrieved from the database
  const [defaultInvitationObjArray, setDefaultInvitationObjArray] = useState([
    { inviteUserID: "", inviteUserKey: Date.now() },
  ]);
  const [extraInvitationObjArray, setExtraInvitationObjArray] = useState([]);
  const [userInformationObject, setUserInformationObject] = useState({});
  const [
    otherMemberInformationObjectArray,
    setOtherMemberInformationObjectArray,
  ] = useState([]);
  const { data } = useGetChatRoomInformation(chatRoomId);
  const mutation = useUpdateChatRoomInformation(history);
  const leaveChatRoomMutation = useLeaveChatRoom(history);

  const getChatRoomInformation = async (data) => {
    console.log(data,user)
    if (data && user) {
      const member = data["members"].find(
        (member) => member.userId === user._id
      );

      if (member) {
        setUserInformationObject({
          memberUserID: member.userId,
          memberNickName: member.nickname,
          memberFirstName: member.firstname,
          memberLastName: member.lastname,
          memberRole: member.role,
          memberEmail: member.email,
          memberProfileImage: member.profile_image || defaultProfileImage,
          memberIsChatRoomAdmin: member.isAdmin,
          memberJoinDate: moment(member.joinedDate).format("DD/MM/YYYY"),
        });
      }

      setOtherMemberInformationObjectArray(
        data["members"]
          .filter((member) => member.userId != user._id)
          .map((memberInformation) => ({
            memberUserID: memberInformation.userId,
            memberNickName: memberInformation.nickname,
            memberFirstName: memberInformation.firstname,
            memberLastName: memberInformation.lastname,
            memberRole: memberInformation.role,
            memberEmail: memberInformation.email,
            memberProfileImage:
              memberInformation.profile_image || defaultProfileImage,
            memberIsChatRoomAdmin: memberInformation.isAdmin,
            memberJoinDate: moment(memberInformation.joinedDate).format(
              "DD/MM/YYYY"
            ),
          }))
      );
      setPrivacySelectMenuButtonText(data["privacy"]);
    }
  };
  const memoizedValue = useMemo(() => getChatRoomInformation(data), [data]);
  
  // useEffect(() => {
  //   getChatRoomInformation(data);
  //   console.log(data);
  // }, []);

  const handleSubmit = async () => {
    // console.log("testing")  //for testing
    // console.log(newGroupName, chatRoomProfileImage, privacySelectMenuButtonText)
    // console.log(defaultInvitationObjArray.map(_=>_.inviteUserID), extraInvitationObjArray.map(_=>_.inviteUserID))
    // console.log([...defaultInvitationObjArray, ...extraInvitationObjArray].map(obj => obj.inviteUserID));
    // console.log(otherMemberInformationObjectArray)
    mutation.mutate({
      chatRoomId: chatRoomId,
      newGroupName: newGroupName,
      chatRoomProfileImage:
        chatRoomProfileImage == defaultProfileImage
          ? null
          : chatRoomProfileImage,
      privacy: privacySelectMenuButtonText,
      invitationList: [
        ...defaultInvitationObjArray,
        ...extraInvitationObjArray,
      ].map((obj) => obj.inviteUserID),
      memberList: otherMemberInformationObjectArray.map((member) => ({
        memberUserID: member.memberUserID,
        memberIsChatRoomAdmin: member.memberIsChatRoomAdmin,
      })),
    });
  };

  const handleChangeChatRoomProfileImage = (e) => {
    const chatRoomProfileImage = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setChatRoomProfileImage(reader.result);
    };
    reader.readAsDataURL(chatRoomProfileImage);
    e.target.value = null;
  };

  const handleShowHideMemberList = () => {
    setShowHideMemberList(!showHideMemberList);
    setShowHideMemberListButtonText(
      showHideMemberListButtonText === "Show" ? "Hide" : "Show"
    );
  };

  const handleSelectPrivacy = (selectedPrivacy) => {
    setPrivacySelectMenuActivation(false);
    setPrivacySelectMenuButtonText(selectedPrivacy);
  };

  const handleRemoveChatRoomMemberFromGroup = (toBeRemovedMemberUserID) => {
    const newOtherMemberInformationObjectArray =
      otherMemberInformationObjectArray.filter(
        (memberInformationObject) =>
          memberInformationObject.memberUserID !== toBeRemovedMemberUserID
      );
    setOtherMemberInformationObjectArray(newOtherMemberInformationObjectArray);
  };

  const handleAddRemoveAdmin = (memberUserIDConcerned) => {
    const targetMemberInformationObjectIdx =
      otherMemberInformationObjectArray.findIndex((memberInformationObject) => {
        return memberInformationObject.memberUserID === memberUserIDConcerned;
      });
    const tempOtherMemberInformationObjectArray =
      otherMemberInformationObjectArray.slice();
    tempOtherMemberInformationObjectArray[
      targetMemberInformationObjectIdx
    ].memberIsChatRoomAdmin =
      !tempOtherMemberInformationObjectArray[targetMemberInformationObjectIdx]
        .memberIsChatRoomAdmin;
    setOtherMemberInformationObjectArray(tempOtherMemberInformationObjectArray);
  };

  const addExtraInvitation = () => {
    const InvitationWithKeyObj = {
      inviteUserID: "",
      inviteUserKey: Date.now(),
    };
    let tempInvitationUserIDObjArray = extraInvitationObjArray.slice();
    tempInvitationUserIDObjArray.push(InvitationWithKeyObj);
    setExtraInvitationObjArray(tempInvitationUserIDObjArray);
  };

  const handleDeleteAddedInvitation = (toBeDeletedInvitationKey) => {
    const newAddedInvitationObjArray = extraInvitationObjArray.filter(
      (addedInvitation) =>
        addedInvitation.inviteUserKey !== toBeDeletedInvitationKey
    );
    setExtraInvitationObjArray(newAddedInvitationObjArray);
  };

  const handleExitGroup = () => {
    console.log("pressed exit group button"); //for testing
    leaveChatRoomMutation.mutate({ chatRoomId: chatRoomId });
  };

  const handleUpdateInvitationObject = (
    e,
    inviteUserKeyConcerned,
    arrayConcerned
  ) => {
    if (arrayConcerned === "default") {
      const targetInvitationObjIdx = defaultInvitationObjArray.findIndex(
        (inspectingInvitationObject) => {
          return (
            inspectingInvitationObject.inviteUserKey === inviteUserKeyConcerned
          );
        }
      );
      const tempDefaultInvitationObjArray = defaultInvitationObjArray.slice();
      tempDefaultInvitationObjArray[targetInvitationObjIdx].inviteUserID =
        e.target.value;
      setDefaultInvitationObjArray(tempDefaultInvitationObjArray);
    } else if (arrayConcerned === "extra") {
      const targetInvitationObjIdx = extraInvitationObjArray.findIndex(
        (inspectingInvitationObject) => {
          return (
            inspectingInvitationObject.inviteUserKey === inviteUserKeyConcerned
          );
        }
      );
      const tempExtraInvitationObjArray = extraInvitationObjArray.slice();
      tempExtraInvitationObjArray[targetInvitationObjIdx].inviteUserID =
        e.target.value;
      setExtraInvitationObjArray(tempExtraInvitationObjArray);
    }
  };

  return (
    <div className="m-auto w-80 p-3 test">
      <div className="chatRoomInformationPageChatRoomInformationLabelSaveCancelButtonContainer">
        <button
          className="chatRoomInformationPageCancelButton"
          onClick={(e) => history.goBack()}
        >
          Cancel
        </button>
        <p className="chatRoomInformationPageChatRoomInformationLabel">
          Chatroom Info
        </p>
        {userInformationObject.memberIsChatRoomAdmin === true && (
          <button
            className="chatRoomInformationPageSaveButton"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </div>
      <br />

      <div className="chatRoomInformationPageChatRoomProfileImageChangeChatRoomProfileImageButtonContainer">
        <img
          className="chatRoomInformationPageChatRoomProfileImage"
          src={chatRoomProfileImage}
        />
        {userInformationObject.memberIsChatRoomAdmin === true && (
          <input
            type="file"
            className="chatRoomProfileImageSelector"
            accept="image/*"
            hidden
            onChange={handleChangeChatRoomProfileImage}
          />
        )}
        {userInformationObject.memberIsChatRoomAdmin === true && (
          <p
            className="chatRoomInformationPageChangeChatRoomProfileImageButton"
            onClick={(e) =>
              document.querySelector(".chatRoomProfileImageSelector").click()
            }
          >
            Change chatroom picture
          </p>
        )}
      </div>
      <br />

      <div className="chatRoomInformationPageChatRoomNameEditSectionContainer">
        <div className="chatRoomInformationPageChatRoomNameEditLabelContainer">
          <div className="chatRoomInformationPageChatRoomNameLabelContainer">
            <label
              htmlFor="chatRoomInformationGroupName"
              className="chatRoomInformationPageChatRoomNameEditLabel"
            >
              Group Name
            </label>
            {userInformationObject.memberIsChatRoomAdmin === true && <CiEdit />}
          </div>
        </div>
        {userInformationObject.memberIsChatRoomAdmin === true && (
          <div className="chatRoomInformationPageChatRoomNameEditContainer">
            <input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              id="chatRoomInformationGroupName"
              type="text"
              className="chatRoomInformationPageChatRoomNameEdit"
              maxLength="35"
            />
          </div>
        )}
        {userInformationObject.memberIsChatRoomAdmin === false && (
          <div className="chatRoomInformationPageChatRoomNameDisplayContainer">
            <p
              id="chatRoomInformationGroupName"
              className="chatRoomInformationPageChatRoomNameDisplay"
            >
              {groupName}
            </p>
          </div>
        )}
      </div>

      <div className="chatRoomInformationPageChatRoomIDDisplaySectionContainer">
        <div className="chatRoomInformationPageChatRoomIDDisplayLabelContainer">
          <div className="chatRoomInformationPageChatRoomIDLabelContainer">
            <p className="chatRoomInformationPageChatRoomIDDisplayLabel">
              Chatroom ID
            </p>
          </div>
        </div>
        <div className="chatRoomInformationPageChatRoomIDDisplayContainer">
          <p className="chatRoomInformationPageChatRoomIDDisplay">
            {chatRoomId}
          </p>
        </div>
      </div>

      <div className="chatRoomInformationPagePrivacySelectSectionContainer">
        <div className="chatRoomInformationPagePrivacySelectLabelContainer">
          <div className="chatRoomInformationPagePrivacyLabelContainer">
            <p className="chatRoomInformationPagePrivacySelectLabel">Privacy</p>
            {userInformationObject.memberIsChatRoomAdmin === true && <CiEdit />}
          </div>
        </div>
        {userInformationObject.memberIsChatRoomAdmin === true && (
          <div className="chatRoomInformationPrivacySelectDropDownMenuContainer">
            <button
              className="chatRoomInformationPrivacySelectDropDownMenuButton"
              onClick={(e) =>
                setPrivacySelectMenuActivation(!privacySelectMenuActivation)
              }
            >
              {privacySelectMenuButtonText}
              <img src={dropDownIcon} className="dropDownMenuIcon" />
            </button>
            {privacySelectMenuActivation === true && (
              <div className="chatRoomInformationPrivacySelectDropDownMenuContent">
                <div
                  id="Private"
                  className="chatRoomInformationPrivacySelectDropDownMenuItem"
                  onClick={(e) => handleSelectPrivacy(e.target.id)}
                >
                  Private
                </div>
                <div
                  id="Public"
                  className="chatRoomInformationPrivacySelectDropDownMenuItem"
                  onClick={(e) => handleSelectPrivacy(e.target.id)}
                >
                  Public
                </div>
              </div>
            )}
          </div>
        )}
        {userInformationObject.memberIsChatRoomAdmin === false && (
          <div className="chatRoomInformationPageChatRoomPrivacyDisplayContainer">
            <p className="chatRoomInformationPageChatRoomPrivacyDisplay">
              {privacySelectMenuButtonText}
            </p>
          </div>
        )}
      </div>

      {userInformationObject.memberIsChatRoomAdmin === true && (
        <div className="chatRoomInformationPageChatRoomMemberInviteSectionContainer">
          <div className="chatRoomInformationPageChatRoomMemberInviteLabelContainer">
            <div className="chatRoomInformationPageChatRoomMemberInvitationLabelContainer">
              <p className="chatRoomInformationPageChatRoomMemberInviteLabel">
                New Member Invite
              </p>
            </div>
            <p
              className="chatRoomInformationPageAddInvitationLabel"
              onClick={() => addExtraInvitation()}
            >
              Add
            </p>
          </div>
          <GroupMemberInvitationList
            defaultInvitationList={defaultInvitationObjArray}
            extraInvitationList={extraInvitationObjArray}
            deleteAddedInvitation={handleDeleteAddedInvitation}
            updateInvitationObject={handleUpdateInvitationObject}
          />
        </div>
      )}

      <div className="chatRoomInformationPageMemberListDisplaySectionContainer">
        <div className="chatRoomInformationPageMemberListDisplayLabelContainer">
          <div className="chatRoomInformationPageMemberListLabelContainer">
            <p className="chatRoomInformationPageMemberListDisplayLabel">
              Member
            </p>
            {userInformationObject.memberIsChatRoomAdmin === true && <CiEdit />}
          </div>
          <p
            className="chatRoomInformationPageShowHideMemberListLabel"
            onClick={handleShowHideMemberList}
          >
            {showHideMemberListButtonText}
          </p>
        </div>
        {showHideMemberList && (
          <ChatRoomMemberList
            userInformation={userInformationObject}
            otherMemberInformation={otherMemberInformationObjectArray}
            removeMemberFromGroup={handleRemoveChatRoomMemberFromGroup}
            addRemoveAdmin={handleAddRemoveAdmin}
          />
        )}
      </div>

      <div className="chatRoomInformationPageGroupExitInputSectionContainer">
        <div className="chatRoomInformationPageGroupExitInputLabelContainer">
          <div className="chatRoomInformationPageGroupExitLabelContainer">
            <p className="chatRoomInformationPageGroupExitInputLabel">
              Exit Group
            </p>
          </div>
        </div>
        <div className="chatRoomInformationPageGroupExitInputContainer">
          <button
            onClick={() => handleExitGroup()}
            className="chatRoomInformationPageGroupExitInput"
          >
            Leave This Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomInformation;
