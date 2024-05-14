import React from "react";
import { useState, useMemo } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { IoSearch } from "react-icons/io5";
import { LuUpload } from "react-icons/lu";
import dropDownIcon from "../assets/dropDownIcon.png"
import UnjoinedChatGroupList from "../compnents/UnjoinedChatGroupList";
import GroupMemberInvitationList from "../compnents/GroupMemberInvitationList";
import { toast } from "react-toastify";
import { useGetPublicChatRooms } from "../../services/queries";
import { useCreateNewChatGroup, useJoinPublicChatRoom } from "../../services/mutation";
import { useEffect } from "react";
const addNewGroup = () => {
    console.log('addNew Group rerendering')
    const [actionSelected, setActionSelected] = useState("Create new chat group")
    const [unjoinedGroupFound, setUnjoinedGroupFound] = useState(true);
    const [toBeDisplayedUnjoinedChatGroups, setToBeDisplayedUnjoinedChatGroups] = useState([]);
    const [groupProfileImageObject, setGroupProfileImageObject] = useState("");
    const [groupProfileImageName, setGroupProfileImageName] = useState("");
    const [privacySelectMenuActivation, setPrivacySelectMenuActivation] = useState(false);
    const [privacySelectMenuButtonText, setPrivacySelectMenuButtonText] = useState("Private");
    const [defaultInvitationObjArray, setDefaultInvitationObjArray] = useState([{inviteUserID:'', inviteUserKey: Date.now()}]);
    const [extraInvitationObjArray, setExtraInvitationObjArray] = useState([]);
    const [goingToJoinChatGroupGroupID, setGoingToJoinChatGroupGroupID] = useState(null);

    const history = useHistory();
    const {data} = useGetPublicChatRooms();
    const createNewChatGroupMutation = useCreateNewChatGroup(history);
    const joinPublicChatRoomMutation = useJoinPublicChatRoom(history);

    const allUnjoinedChatGroups = useMemo(
      () => {
        return data?.map((chatRoom) => ({
          chatRoomName: chatRoom.chatRoomName,
          chatRoomId: chatRoom._id,
          chatRoomImage: chatRoom.chatRoomImage,
        }));
      },
      [data]
    );

    useEffect(() => {
      setToBeDisplayedUnjoinedChatGroups(allUnjoinedChatGroups)
    }, [allUnjoinedChatGroups]);
      
    console.log(toBeDisplayedUnjoinedChatGroups); //for testing

    const handleSelectAction = (selectedAction) => {
        if (selectedAction === "create") {
            setActionSelected("Create new chat group");  //set the button text when action is selected
        }
        else if (selectedAction === "join") {
            setActionSelected("Join existing chat group");  //set the button text when action is selected
        }
    }

    const handleRemoveGroupProfileImage = () => {
        setGroupProfileImageObject("");
        setGroupProfileImageName("");
      };

    const selectGroupProfileImagePopUpWindow = () => {
        document.getElementById("addNewGroupGroupProfileImage").click();
    }

    const handleGroupUploadedProfileImage = (e) => {
        const pickedGroupProfileImage = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setGroupProfileImageObject(base64);
            setGroupProfileImageName(pickedGroupProfileImage.name);
        }
        reader.readAsDataURL(pickedGroupProfileImage);
        e.target.value = null;
    }

    const handleSelectPrivacy = (selectedPrivacy) => {
        setPrivacySelectMenuActivation(false);
        setPrivacySelectMenuButtonText(selectedPrivacy);
    }

    const addExtraInvitation = () => {
        const InvitationWithKeyObj = {inviteUserID:'', inviteUserKey: Date.now()};
        let tempInvitationUserIDObjArray = extraInvitationObjArray.slice();
        tempInvitationUserIDObjArray.push(InvitationWithKeyObj);
        setExtraInvitationObjArray(tempInvitationUserIDObjArray);
    }

    const handleDeleteAddedInvitation = (toBeDeletedInvitationKey) => {
        const newAddedInvitationObjArray = extraInvitationObjArray.filter((addedInvitation) => addedInvitation.inviteUserKey !== toBeDeletedInvitationKey);
        setExtraInvitationObjArray(newAddedInvitationObjArray);
    }

    const handleUpdateInvitationObject = (e, inviteUserKeyConcerned, arrayConcerned) => {
        if (arrayConcerned === "default") {
            const targetInvitationObjIdx = defaultInvitationObjArray.findIndex((inspectingInvitationObject) => {return inspectingInvitationObject.inviteUserKey === inviteUserKeyConcerned});
            const tempDefaultInvitationObjArray = defaultInvitationObjArray.slice();
            tempDefaultInvitationObjArray[targetInvitationObjIdx].inviteUserID = e.target.value;
            setDefaultInvitationObjArray(tempDefaultInvitationObjArray);
            console.log(defaultInvitationObjArray); //for testing
        }
        else if (arrayConcerned === "extra") {
            const targetInvitationObjIdx = extraInvitationObjArray.findIndex((inspectingInvitationObject) => {return inspectingInvitationObject.inviteUserKey === inviteUserKeyConcerned});
            const tempExtraInvitationObjArray = extraInvitationObjArray.slice();
            tempExtraInvitationObjArray[targetInvitationObjIdx].inviteUserID = e.target.value;
            setExtraInvitationObjArray(tempExtraInvitationObjArray);
            console.log(extraInvitationObjArray);   //for testing
        }
    }

    const handleCreateNewChatGroup = async() => {
        createNewChatGroupMutation.mutate({
            chatRoomName: document.getElementById("addNewGroupNewGroupName").value,
            chatRoomImage: groupProfileImageObject,
            privacy: privacySelectMenuButtonText,
            groupMembers: defaultInvitationObjArray.concat(extraInvitationObjArray).map((_) => _.inviteUserID),
        });
    }
    const handleJoinNewChatGroup = async()=>{
        if(goingToJoinChatGroupGroupID){
            console.log(goingToJoinChatGroupGroupID)
            joinPublicChatRoomMutation.mutate(goingToJoinChatGroupGroupID);
        }else{
            toast.error("Please select a chat group to join")
        }
    }

    const handleSelectUnjoinedChatGroup = (selectedUnjoinedChatGroupGroupID) => {
        setGoingToJoinChatGroupGroupID(selectedUnjoinedChatGroupGroupID);
    }

    const handleUnjoinedChatGroupSearch = (e) => {
      setToBeDisplayedUnjoinedChatGroups(
        allUnjoinedChatGroups.filter((room, idx) => {
          return  room.chatRoomName.toLowerCase().includes(e.target.value.toLowerCase())
        })
      );
    }
    
    // console.log(goingToJoinChatGroupGroupID);

    return (
      <div className="m-auto w-80 p-3 test">
        <div className="addNewGroupPageAddChatGroupLabelCancelButtonContainer">
          <button
            className="addNewGroupPageCancelButton"
            onClick={(e) => history.push("/")}
          >
            Cancel
          </button>
          <p className="addNewGroupPageAddChatGroupLabel">Add Chat Group</p>
          {actionSelected === "Create new chat group" && (
            <button
              onClick={handleCreateNewChatGroup}
              className="addNewGroupPageCreateButton"
            >
              Create
            </button>
          )}
          {actionSelected === "Join existing chat group" && (
            <button
              onClick={handleJoinNewChatGroup}
              className="addNewGroupPageJoinButton"
            >
              Join
            </button>
          )}
        </div>
        <br />
        <div className="addNewGroupPageActionSelectButtonContainer">
          <button id="create" className="addNewGroupPageCreateNewActionButton" onClick={(e) => handleSelectAction(e.target.id)}>
            Create new
          </button>
          <button
            id="join"
            className="addNewGroupPageJoinExistingActionButton"
            onClick={(e) => handleSelectAction(e.target.id)}
          >
            Join existing
          </button>
        </div>
        <br />
        {actionSelected === "Join existing chat group" && (
          <div className="addNewGroupPageJoinGroupContainer">
            <form>
              <label htmlFor="default-search"className="addNewGroupPageGroupSearchLabel">
                Search
              </label>
              <div className="addNewGroupPageGroupSearchIconInputContainer">
                <IoSearch />
                <input type="search" id="default-search" className="addNewGroupPageGroupSearchInput" placeholder="Search for unjoined groups" onChange={(e) => handleUnjoinedChatGroupSearch(e)}/>
              </div>
            </form>
            <br />
            {unjoinedGroupFound === true && (
              <div className="addNewGroupPageUnjoinedGroupFoundContainer">
                <UnjoinedChatGroupList
                  toBeDisplayedUnjoinedChatGroupList={
                    toBeDisplayedUnjoinedChatGroups
                  }
                  selectUnjoinedChatGroup={handleSelectUnjoinedChatGroup}
                />
              </div>
            )}
            {unjoinedGroupFound === false && (
              <div className="addNewGroupPageUnjoinedGroupNotFoundContainer">
                No records found
              </div>
            )}
          </div>
        )}
        {actionSelected === "Create new chat group" && (
          <div className="addNewGroupPageCreateGroupContainer">
            <div className="addNewGroupPageNewGroupNameInputSectionContainer">
              <div className="addNewGroupPageNewGroupNameInputLabelContainer">
                <div className="addNewGroupPageNewGroupNameLabelContainer">
                  <label
                    htmlFor="addNewGroupNewGroupName"
                    className="addNewGroupPageNewGroupNameInputLabel"
                  >
                    Chatroom Name
                  </label>
                </div>
              </div>
              <div className="addNewGroupPageNewGroupNameInputContainer">
                <input
                  id="addNewGroupNewGroupName"
                  type="text"
                  className="addNewGroupPageNewGroupNameInput"
                  maxLength="35"
                />
              </div>
            </div>

            <div className="addNewGroupPageGroupProfileImageUploadSectionContainer">
              <div className="addNewGroupPageGroupProfileImageUploadLabelContainer">
                <div className="addNewGroupPageGroupProfileImageLabelContainer">
                  <p className="addNewGroupPageGroupProfileImageUploadLabel">
                    Chatroom Profile Image
                  </p>
                </div>
                <p
                  className="addNewGroupPageRemoveLabel"
                  onClick={handleRemoveGroupProfileImage}
                >
                  Remove
                </p>
              </div>
              <div className="addNewGroupPageGroupProfileImageUploadContainer">
                <p className="addNewGroupPageGroupProfileImageDisplay">
                  {groupProfileImageName}
                </p>
                <div
                  className="addNewGroupPageGroupProfileImageUploadIconContainer"
                  onClick={() => selectGroupProfileImagePopUpWindow()}
                >
                  <LuUpload />
                </div>
                <input
                  type="file"
                  id="addNewGroupGroupProfileImage"
                  className="addNewGroupGroupProfileImageSelector"
                  accept="image/*"
                  onChange={(e) => handleGroupUploadedProfileImage(e)}
                />
              </div>
            </div>

            <div className="addNewGroupPagePrivacySelectSectionContainer">
              <div className="addNewGroupPagePrivacySelectLabelContainer">
                <div className="addNewGroupPagePrivacyLabelContainer">
                  <p className="addNewGroupPagePrivacySelectLabel">
                    Chatroom Privacy
                  </p>
                </div>
              </div>
              <div className="addNewGroupPrivacySelectDropDownMenuContainer">
                <button
                  className="addNewGroupPrivacySelectDropDownMenuButton"
                  onClick={(e) =>
                    setPrivacySelectMenuActivation(!privacySelectMenuActivation)
                  }
                >
                  {privacySelectMenuButtonText}
                  <img src={dropDownIcon} className="dropDownMenuIcon" />
                </button>
                {privacySelectMenuActivation && (
                  <div className="addNewGroupPrivacySelectDropDownMenuContent">
                    <div
                      id="Private"
                      className="addNewGroupPrivacySelectDropDownMenuItem"
                      onClick={(e) => handleSelectPrivacy(e.target.id)}
                    >
                      Private
                    </div>
                    <div
                      id="Public"
                      className="addNewGroupPrivacySelectDropDownMenuItem"
                      onClick={(e) => handleSelectPrivacy(e.target.id)}
                    >
                      Public
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="addNewGroupPageGroupMemberInviteSectionContainer">
              <div className="addNewGroupPageGroupMemberInviteLabelContainer">
                <div className="addNewGroupPageGroupMemberInvitationLabelContainer">
                  <p className="addNewGroupPageGroupMemberInviteLabel">
                    Chatroom Member Invite
                  </p>
                </div>
                <p
                  className="addNewGroupPageAddInvitationLabel"
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
          </div>
        )}
      </div>
    );
};

export default addNewGroup;