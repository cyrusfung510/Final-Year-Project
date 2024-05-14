import React from "react";
import { MdDelete } from "react-icons/md";

const GroupMemberInvitationList = (props) => {
    const defaultInvitations = props.defaultInvitationList;
    const extraInvitations = props.extraInvitationList;
    const deleteInvitation = props.deleteAddedInvitation;
    const updateInvitationObj = props.updateInvitationObject;

    return (
        <div className="addNewGroupAndChatRoomInformationPageGroupMemberInvitationListDisplay">
            {/* for default invitation */}
            {
                defaultInvitations.map((defaultInvitationElement) => (
                    <div className="addNewGroupAndChatRoomInformationPageGroupMemberInvitationDefaultUserIDInputContainer" key={defaultInvitationElement.inviteUserKey}>
                        <input type="text" className="addNewGroupAndChatRoomInformationPageGroupMemberInvitationUserIDInput" maxLength="24" placeholder="Please enter the User ID" onChange={(e) => updateInvitationObj(e, defaultInvitationElement.inviteUserKey, "default")}/>
                    </div>
                ))
            }
            {/* for extra invitation */}
            {
                extraInvitations.map((extraInvitationElement) => (
                    <div className="addNewGroupAndChatRoomInformationPageGroupMemberInvitationExtraUserIDInputContainer" key={extraInvitationElement.inviteUserKey}>
                        <input type="text" className="addNewGroupAndChatRoomInformationPageGroupMemberInvitationUserIDInput" maxLength="24" placeholder="Please enter the User ID" onChange={(e) => updateInvitationObj(e, extraInvitationElement.inviteUserKey, "extra")}/>
                        <div className="addNewGroupAndChatRoomInformationPageGroupMemberInvitationDeleteIconContainer" onClick={() => deleteInvitation(extraInvitationElement.inviteUserKey)}>
                            <MdDelete />
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default GroupMemberInvitationList;