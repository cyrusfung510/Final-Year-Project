import React, { useContext, useEffect } from "react";
import { useState } from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { HistoryContext } from "../providers/HistoryProvider";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const GroupMemberProfile = () => {
    const history = useContext(HistoryContext);
    const location = useLocation();
    const {memberInfo} = location.state;
    const [groupMemberIdentity, setGroupMemberIdentity] = useState(memberInfo.memberRole);
    // const [groupMemberEmail, setGroupMemberEmail] = useState(memberInfo.memberEmail);
    const [groupMemberYearOfStudy, setGroupMemberYearOfStudy] = useState(null);
    const [groupMemberFirstMajorProgram, setGroupMemberFirstMajorProgram] = useState("");
    const [groupMemberSecondMajorProgram, setGroupMemberSecondMajorProgram] = useState("");
    const [groupMemberMinorProgram, setGroupMemberMinorProgram] = useState("");

    console.log(memberInfo);
    const getUerProfile = async ()=>{
        try{
            const res = await fetch('http://localhost:3000/chatRoom/getGroupMemberProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    userId: memberInfo.memberUserID
                })
            });
            const data = await res.json();
            setGroupMemberYearOfStudy(data["year_of_study"]);
            setGroupMemberFirstMajorProgram(data["firstMajor"]);
            setGroupMemberSecondMajorProgram(data["secondMajor"]);
            setGroupMemberMinorProgram(data["minor"]);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getUerProfile();
    
    },[])


    return (
        <div className="m-auto w-80 p-3 test">
            <div className="groupMemberProfilePageGroupMemberProfileLabelCancelButtonContainer">
                <button onClick={()=>history.goBack()} className="groupMemberProfilePageCancelButton">Cancel</button>
                <p className="groupMemberProfilePageGroupMemberProfileLabel">Profile</p>
            </div>
            <br />

            <div className="groupMemberProfilePageGroupMemberProfileImageContainer">
                <img className="groupMemberProfilePageGroupMemberProfileImage" src={memberInfo.memberProfileImage ||defaultProfileImage}/>
            </div>
            <br />



            <div className="groupMemberProfilePageFirstLastNameDisplaySectionContainer">
                <div className="groupMemberProfilePageFirstNameDisplaySection">
                    <div className="groupMemberProfilePageFirstNameDisplayLabelContainer">
                        <div className="groupMemberProfilePageFirstNameLabelContainer">
                            <p className="groupMemberProfilePageFirstNameDisplayLabel">First name</p>
                        </div>
                    </div>
                    <div className="groupMemberProfilePageFirstNameDisplayContainer">
                        <p className="groupMemberProfilePageFirstNameDisplay">{memberInfo.memberFirstName}</p>
                    </div>
                </div>

                <div className="groupMemberProfilePageLastNameDisplaySection">
                    <div className="groupMemberProfilePageLastNameDisplayLabelContainer">
                        <div className="groupMemberProfilePageLastNameLabelContainer">
                            <p className="groupMemberProfilePageLastNameDisplayLabel">Last name</p>
                        </div>
                    </div>
                    <div className="groupMemberProfilePageLastNameDisplayContainer">
                        <p className="groupMemberProfilePageLastNameDisplay">{memberInfo.memberLastName}</p>
                    </div>
                </div>
            </div>



            <div className="groupMemberProfilePageUserIDDisplaySectionContainer">
                <div className="groupMemberProfilePageUserIDDisplayLabelContainer">
                    <div className="groupMemberProfilePageUserIDLabelContainer">
                        <p className="groupMemberProfilePageUserIDDisplayLabel">User ID</p>
                    </div>
                </div>
                <div className="groupMemberProfilePageUserIDDisplayContainer">
                    <p className="groupMemberProfilePageUserIDDisplay">{memberInfo.memberUserID}</p>
                </div>
            </div>

            <div className="groupMemberProfilePageEmailDisplaySectionContainer">
                <div className="groupMemberProfilePageEmailDisplayLabelContainer">
                    <div className="groupMemberProfilePageEmailLabelContainer">
                        <p className="groupMemberProfilePageEmailDisplayLabel">Email</p>
                    </div>
                </div>
                <div className="groupMemberProfilePageEmailDisplayContainer">
                    <p className="groupMemberProfilePageEmailDisplay">{memberInfo.memberEmail}</p>
                </div>
            </div>

            {
                (groupMemberIdentity == "student") && (
                    <div className="groupMemberProfilePageYearOfStudyDisplaySectionContainer">
                        <div className="groupMemberProfilePageYearOfStudyDisplayLabelContainer">
                            <div className="groupMemberProfilePageYearOfStudyLabelContainer">
                                <p className="groupMemberProfilePageYearOfStudyDisplayLabel">Year of Study</p>
                            </div>
                        </div>
                        <div className="groupMemberProfilePageYearOfStudyDisplayContainer">
                            <p className="groupMemberProfilePageYearOfStudyDisplay">{`${groupMemberYearOfStudy}`}</p>
                        </div>
                    </div>
                )
            }

            {
                (groupMemberIdentity == "student") && (
                    <div className="groupMemberProfilePageFirstMajorProgramDisplaySectionContainer">
                        <div className="groupMemberProfilePageFirstMajorProgramDisplayLabelContainer">
                            <div className="groupMemberProfilePageFirstMajorProgramLabelContainer">
                                <p className="groupMemberProfilePageFirstMajorProgramDisplayLabel">First Major Program</p>
                            </div>
                        </div>
                        <div className="groupMemberProfilePageFirstMajorProgramDisplayContainer">
                            <p className="groupMemberProfilePageFirstMajorProgramDisplay">{groupMemberFirstMajorProgram}</p>
                        </div>
                    </div>
                )
            }

            {
                (groupMemberIdentity === "student") && (groupMemberSecondMajorProgram !== "") && (
                    <div className="groupMemberProfilePageSecondMajorProgramDisplaySectionContainer">
                        <div className="groupMemberProfilePageSecondMajorProgramDisplayLabelContainer">
                            <div className="groupMemberProfilePageSecondMajorProgramLabelContainer">
                                <p className="groupMemberProfilePageSecondMajorProgramDisplayLabel">Second Major Program</p>
                            </div>
                        </div>
                        <div className="groupMemberProfilePageSecondMajorProgramDisplayContainer">
                            <p className="groupMemberProfilePageSecondMajorProgramDisplay">{groupMemberSecondMajorProgram}</p>
                        </div>
                    </div>
                )
            }

            {
                (groupMemberIdentity === "student") && (groupMemberMinorProgram !== "") && (
                    <div className="groupMemberProfilePageMinorProgramDisplaySectionContainer">
                        <div className="groupMemberProfilePageMinorProgramDisplayLabelContainer">
                            <div className="groupMemberProfilePageMinorProgramLabelContainer">
                                <p className="groupMemberProfilePageMinorProgramDisplayLabel">Minor Program</p>
                            </div>
                        </div>
                        <div className="groupMemberProfilePageMinorProgramDisplayContainer">
                            <p className="groupMemberProfilePageMinorProgramDisplay">{groupMemberMinorProgram}</p>
                        </div>
                    </div>
                )
            }

        </div>
    )
};

export default GroupMemberProfile;
