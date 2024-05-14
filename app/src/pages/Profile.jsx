import React from "react";
import defaultProfileImage from "../assets/defaultProfileImage.png";
import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Profile = () => {
  const { user } = useAuth();
  const [userIdentity, setUserIdentity] = useState(user.role); //indicates whether show program of study
  const [nickname, setNickname] = useState(user.nickname);
  const [secondMajor, setSecondMajor] = useState(user.secondMajor);
  const [minor, setMinor] = useState(user.minor);
  const [profileImage, setProfileImage] = useState(
    user?.profile_image || defaultProfileImage
  );
  const history = useHistory();

  const handleChangeProfileImage = (e) => {
    const profileImage = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(profileImage);
    e.target.value = null;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nickname: nickname,
      secondMajor: secondMajor,
      minor: minor,
      profile_image:
        profileImage === "/src/assets/defaultProfileImage.png"
          ? ""
          : profileImage,
    };
    console.log(data);
    const result = await fetch("http://localhost:3000/users/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });
    console.log(result);
    if (result.ok) {
      history.push("/");
    } else {
      // console.log("error");
    }
  };
  
  return (
    <div className="m-auto w-80 p-3 test">
      <div className="profilePageProfileLabelSaveCancelButtonContainer">
        <button className="profilePageCancelButton" onClick={(e) => history.push("/")}>Cancel</button>
        <p className="profilePageProfileLabel">Profile</p>
        <button type="submit" onClick={handleSubmit} className="profilePageSaveButton">Save</button>
      </div>
      <br />
      <div className="profilePageProfileImageChangeProfileImageButtonContainer">
        <img className="profilePageProfileImage" src={profileImage}/>
        <input type="file" className="profileImageSelector" accept="image/*" hidden onChange={handleChangeProfileImage} />
        <p className="profilePageChangeProfileImageButton" onClick={(e) => document.querySelector(".profileImageSelector").click()}>
          Change profile picture
        </p>
      </div>
      <br />


      <form>
        <div className="profilePageFirstNameDisplaySectionLastNameDisplaySectionContainer">
            <div className="profilePageFirstNameDisplaySectionContainer">
                <div className="profilePageFirstNameDisplayLabelContainer">
                    <div className="profilePageFirstNameLabelContainer">
                        <p className="profilePageFirstNameDisplayLabel">First name</p>
                    </div>
                </div>
                <div className="profilePageFirstNameDisplayContainer">
                    <p className="profilePageFirstNameDisplay">{user.firstname}</p>
                </div>
            </div>

            <div className="profilePageLastNameDisplaySectionContainer">
                <div className="profilePageLastNameDisplayLabelContainer">
                    <div className="profilePageLastNameLabelContainer">
                        <p className="profilePageLastNameDisplayLabel">Last name</p>
                    </div>
                </div>
                <div className="profilePageLastNameDisplayContainer">
                    <p className="profilePageLastNameDisplay">{user.lastname}</p>
                </div>
            </div>
        </div>

        <div className="profilePageNicknameUpdateSectionContainer">
          <div className="profilePageNicknameUpdateLabelContainer">
            <div className="profilePageNicknameLabelContainer">
                <p className="profilePageNicknameUpdateLabel">Nickname</p>
                <CiEdit />
            </div>
          </div>
          <div className="profilePageNicknameUpdateContainer">
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="profilePageNicknameUpdate" maxLength="20"/>
          </div>
        </div>

        <div className="profilePageUserIDDisplaySectionContainer">
          <div className="profilePageUserIDDisplayLabelContainer">
            <div className="profilePageUserIDLabelContainer">
              <p className="profilePageUserIDDisplayLabel">User ID</p>
            </div>
          </div>
          <div className="profilePageUserIDDisplayContainer">
            <p className="profilePageUserIDDisplay">{user._id}</p>
          </div>
        </div>

        <div className="profilePageEmailDisplaySectionContainer">
          <div className="profilePageEmailDisplayLabelContainer">
            <div className="profilePageEmailLabelContainer">
                <p className="profilePageEmailDisplayLabel">Email Address</p>
            </div>
          </div>
          <div className="profilePageEmailDisplayContainer">
            <p className="profilePageEmailDisplay">{user.email}</p>
          </div>
        </div>

        {
          (userIdentity === "student") && (
            <div className="profilePageFirstMajorProgramDisplaySectionContainer">
              <div className="profilePageFirstMajorProgramDisplayLabelContainer">
                <div className="profilePageFirstMajorProgramLabelContainer">
                  <p className="profilePageFirstMajorProgramDisplayLabel">First Major Program</p>
                </div>
              </div>
              <div className="profilePageFirstMajorProgramDisplayContainer">
                <p className="profilePageFirstMajorProgramDisplay">{user.firstMajor}</p>
              </div>
            </div>
          )
        }

        {
          (userIdentity === "student") && (
            <div className="profilePageSecondMajorProgramUpdateSectionContainer">
              <div className="profilePageSecondMajorProgramUpdateLabelContainer">
                <div className="profilePageSecondMajorProgramLabelContainer">
                  <p className="profilePageSecondMajorProgramUpdateLabel">Second Major Program</p>
                  <CiEdit />
                </div>
              </div>
              <div className="profilePageSecondMajorProgramUpdateContainer">
                <input type="text" value={secondMajor} onChange={(e) => setSecondMajor(e.target.value)} className="profilePageSecondMajorProgramUpdate"/>
              </div>
            </div>
          )
        }


        {
          (userIdentity === "student") && (
            <div className="profilePageMinorProgramUpdateSectionContainer">
              <div className="profilePageMinorProgramUpdateLabelContainer">
                <div className="profilePageMinorProgramLabelContainer">
                  <p className="profilePageMinorProgramUpdateLabel">Minor Program</p>
                  <CiEdit />
                </div>
              </div>
              <div className="profilePageMinorProgramUpdateContainer">
                <input type="text" value={minor} onChange={(e) => setMinor(e.target.value)} className="profilePageMinorProgramUpdate"/>
              </div>
            </div>
          )
        }
      </form>


      <div className="profilePageLogoutAccountInputSectionContainer">
        <div className="profilePageLogoutAccountInputLabelContainer">
          <div className="profilePageLogoutAccountLabelContainer">
            <p className="profilePageLogoutAccountInputLabel">Logout</p>
          </div>
        </div>
        <div className="profilePageLogoutAccountInputContainer">
          <button className="profilePageLogoutAccountInput" onClick={handleLogout}>Logout</button>
        </div>
      </div>


    </div>
  );
};

export default Profile;
