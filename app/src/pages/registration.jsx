import React from "react";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoKeyOutline } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { GrUserManager } from "react-icons/gr";
import { FiBookOpen } from "react-icons/fi";
import { TbCalendarTime } from "react-icons/tb";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuCalendarDays } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { LuUpload } from "react-icons/lu";
import dropDownIcon from "../assets/dropDownIcon.png";
import { useHistory } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import useAuthentication from "../hooks/useAuth";

const Registration = () => {
  const [identitySelectMenuActivation, setIdentitySelectMenuActivation] =
    useState(false);
  const [yearOfStudySelectMenuActivation, setYearOfStudySelectMenuActivation] =
    useState(false);
  const [identitySelectMenuButtonText, setIdentitySelectMenuButtonText] =
    useState("Student");
  const [yearOfStudySelectMenuButtonText, setYearOfStudySelectMenuButtonText] =
    useState("Year 1");
  const [emailDomain, setEmailDomain] = useState("@connect.hku.hk");
  const [passwordInputBoxType, setPasswordInputBoxType] = useState("password"); //use to control hide or show password in the password input box
  const [showEyeIcon, setShowEyeIcon] = useState(true);
  const [showEyeOffIcon, setShowEyeOffIcon] = useState(false);
  const [gotOneTimePassword, setGotOneTimePassword] = useState(false); //indicate whether the applicant request the one time password, if the variable become true then set the registration button text to "Submit"
  const [registrationButtonText, setRegistrationButtonText] = useState(
    "Get One Time Password"
  );
  const [successVerify, setSuccessVerify] = useState(false); //indicate the input password is correct and ask applicant to enter the personal information
  const [dateOfBirthValue, setDateOfBirthValue] = useState("");
  const [profileImageObject, setProfileImageObject] = useState("");
  const [profileImageName, setProfileImageName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [nickname, setNickname] = useState("");
  const [firstMajor, setFirstMajor] = useState("");
  const [secondMajor, setSecondMajor] = useState("");
  const [minor, setMinor] = useState("");
  const history = useHistory();
  const { register, sendOtp, firstTimeSetup } = useAuth();
  
  useAuthentication(register);
  
  const handleSelectIdentity = (selectedIdentity) => {
    setIdentitySelectMenuActivation(false); //close the identity select drop down menu
    setIdentitySelectMenuButtonText(selectedIdentity); //set the button text when identity is selected
    if (selectedIdentity === "Student") {
      setEmailDomain("@connect.hku.hk"); //set the email domain name to "@connect.hku.hk" if identity is student
    } else if (selectedIdentity === "Teacher") {
      setEmailDomain("@hku.hk"); //set the email domain name to "@hku.hk" is identity is teacher
    }
  };

  const handleSelectYearOfStudy = (selectedYearOfStudy) => {
    setYearOfStudySelectMenuActivation(false);
    setYearOfStudySelectMenuButtonText(selectedYearOfStudy);
  };

  const handleShowHidePassword = () => {
    if (document.getElementById("registrationPassword").type === "password") {
      setPasswordInputBoxType("text");
      setShowEyeOffIcon(true);
      setShowEyeIcon(false);
    } else if (
      document.getElementById("registrationPassword").type === "text"
    ) {
      setPasswordInputBoxType("password");
      setShowEyeIcon(true);
      setShowEyeOffIcon(false);
    }
  };

  const handleResendPassword = async () => {
    await sendOtp(email + emailDomain);
  };

  const handleRegistration = async () => {
    if (registrationButtonText === "Get One Time Password") {
      if (document.getElementById("registrationEmail").value === "") {
        //implement do something when the email input field is empty
        //...
        // setGotOneTimePassword(true);
        // setRegistrationButtonText("Verify One Time Password");
      } else {
        const result = await sendOtp(email + emailDomain);
        // if (result.ok) {
          setGotOneTimePassword(true);
          setRegistrationButtonText("Verify One Time Password");
        // }
        //implement make request to the server to send one time password to applicant email
        //...
      }
    } else if (registrationButtonText === "Verify One Time Password") {
      //implement send the one time password given by the applicant to the sever to verify, if corect then change the registrationButtonText to "Submit"
      //...
      const result = await register(email + emailDomain, password);
      let verificationResult = result.ok; //need modify this line
      if (verificationResult === true) {
        setSuccessVerify(true);
        setRegistrationButtonText("Submit");
      }
    } else if (registrationButtonText === "Submit") {
      //implement submit all applicant personal information to the server to finish the registration
      //...
      const result = await firstTimeSetup({
        email: email + emailDomain,
        password: password,
        firstname: firstname,
        lastname: lastname,
        nickname: nickname,
        firstMajor: firstMajor,
        secondMajor: secondMajor,
        minor: minor,
        year_of_study: yearOfStudySelectMenuButtonText,
        date_of_birth: dateOfBirthValue,
        profile_image: profileImageObject,
      });
      if (result.ok) {
        history.push("/");
      }
    }
  };

  const handleCancel = () => {
    history.push("/login");
  };

  const selectDateOfBirthPopUpWindow = () => {
    document
      .getElementById("registrationDateOfBirth")
      .setAttribute("max", new Date().toISOString().split("T")[0]);
    document.getElementById("registrationDateOfBirth").showPicker();
  };

  const handlePickedDateOfBirth = (pickedDateOfBirth) => {
    setDateOfBirthValue(pickedDateOfBirth);
  };

  const selectProfileImagePopUpWindow = () => {
    document.getElementById("registrationProfileImage").click();
  };

  const handleUploadedProfileImage = (e) => {
    const pickedProfileImage = e.target.files[0];
    const reader = new FileReader();
      reader.onload =()=> {
        const base64 = reader.result;
        setProfileImageObject(base64);
        setProfileImageName(pickedProfileImage.name);
       
      }
      reader.readAsDataURL(pickedProfileImage);
      e.target.value = null;
      
  };

  const handleRemoveProfileImage = () => {
    setProfileImageObject("");
    setProfileImageName("");
  };

  return (
    <div className="m-auto w-80 p-3 test max-w-sm mx-auto left-0 right-0 bottom-5 absolute.">
      <div className="registrationLabelContainer">
        <p className="registrationLabel">Registration</p>
      </div>
      <br />
      <div className="registrationPageIdentitySelectSectionContainer">
        <div className="registrationPageIdentitySelectLabelContainer">
          <div className="registrationPageIdentityLabelAndIconContainer">
            <p className="registrationPageIdentitySelectLabel">Identity</p>
            <SlPeople />
          </div>
        </div>
        <div className="registrationIdentitySelectDropDownMenuContainer">
          <button
            className="registrationIdentitySelectDropDownMenuButton"
            onClick={(e) =>
              setIdentitySelectMenuActivation(!identitySelectMenuActivation)
            }
          >
            {identitySelectMenuButtonText}
            <img src={dropDownIcon} className="dropDownMenuIcon" />
          </button>
          {identitySelectMenuActivation && (
            <div className="registrationIdentitySelectDropDownMenuContent">
              <div
                id="Student"
                className="registrationIdentitySelectDropDownMenuItem"
                onClick={(e) => handleSelectIdentity(e.target.id)}
              >
                Student
              </div>
              <div
                id="Teacher"
                className="registrationIdentitySelectDropDownMenuItem"
                onClick={(e) => handleSelectIdentity(e.target.id)}
              >
                Teacher
              </div>
            </div>
          )}
        </div>
      </div>
      <form className="registrationInformation">
        <div className="registrationPageEmailInputSectionContainer">
          <div className="registrationPageEmailInputLabelContainer">
            <div className="registrationPageEmailLabelAndIconContainer">
              <label
                htmlFor="registrationEmail"
                className="registrationPageEmailInputLabel"
              >
                Email
              </label>
              <AiOutlineMail />
            </div>
          </div>
          <div className="registrationPageEmailInputContainer">
            <input
              id="registrationEmail"
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="registrationPageEmailInput"
            />
            <div className="registrationPageEmailInputDomain">
              {emailDomain}
            </div>
          </div>
        </div>
        {gotOneTimePassword && (
          <div className="registrationPagePasswordInputSectionContainer">
            <div className="registrationPagePasswordInputLabelContainer">
              <div className="registrationPagePasswordLabelAndIconContainer">
                <label
                  htmlFor="registrationPassword"
                  className="registrationPagePasswordInputLabel"
                >
                  One Time Password
                </label>
                <IoKeyOutline />
              </div>
              <p
                className="registrationPageResendLabel"
                onClick={handleResendPassword}
              >
                Resend
              </p>
            </div>
            <div className="registrationPagePasswordInputContainer">
              <input
                id="registrationPassword"
                type={passwordInputBoxType}
                onChange={(e) => setPassword(e.target.value)}
                className="registrationPagePasswordInput"
                autoComplete="off"
              />
              {showEyeIcon && (
                <div
                  className="registrationPageEyeIconContainer"
                  onClick={handleShowHidePassword}
                >
                  <IoMdEye />
                </div>
              )}
              {showEyeOffIcon && (
                <div
                  className="registrationPageEyeOffIconContainer"
                  onClick={handleShowHidePassword}
                >
                  <IoMdEyeOff />
                </div>
              )}
            </div>
          </div>
        )}
        {successVerify && (
          <div className="registrationPageNameInputSectionContainer">
            <div className="registrationPageNameInputLabelContainer">
              <div className="registrationPageNameLabelAndIconContainer">
                <p className="registrationPageNameInputLabel">Name</p>
                <GrUserManager />
              </div>
            </div>
            <div className="registrationPageNameInputContainer">
              <div className="registrationPageFirstNameInputContainer">
                <label
                  htmlFor="registrationFirstName"
                  className="registrationPageFirstNameLabel"
                >
                  FirstName
                </label>
                <input
                  id="registrationFirstName"
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  className="registrationPageFirstNameInput"
                  autoComplete="off"
                />
              </div>
              <div className="registrationPageLastNameInputContainer">
                <label
                  htmlFor="registrationLastName"
                  className="registrationPageLastNameLabel"
                >
                  LastName
                </label>
                <input
                  id="registrationLastName"
                  onChange={(e) => setLastname(e.target.value)}
                  type="text"
                  className="registrationPageLastNameInput"
                  autoComplete="off"
                />
              </div>
              <div className="registrationPageNickNameInputContainer">
                <label
                  htmlFor="registrationNickName"
                  className="registrationPageNickNameLabel"
                >
                  NickName
                </label>
                <input
                  id="registrationNickName"
                  onChange={(e) => setNickname(e.target.value)}
                  type="text"
                  className="registrationPageNickNameInput"
                  autoComplete="off"
                  maxLength="20"
                />
              </div>
            </div>
          </div>
        )}
        {successVerify && identitySelectMenuButtonText === "Student" && (
          <div className="registrationPageProgramInputSectionContainer">
            <div className="registrationPageProgramInputLabelContainer">
              <div className="registrationPageProgramLabelAndIconContainer">
                <p className="registrationPageProgramInputLabel">Program</p>
                <FiBookOpen />
              </div>
            </div>
            <div className="registrationPageProgramInputContainer">
              <div className="registrationPageFirstMajorInputContainer">
                <label
                  htmlFor="registrationFirstMajor"
                  className="registrationPageFirstMajorLabel"
                >
                  FirstMajor
                </label>
                <input
                  id="registrationFirstMajor"
                  onChange={(e) => setFirstMajor(e.target.value)}
                  type="text"
                  className="registrationPageFirstMajorInput"
                  autoComplete="off"
                />
              </div>
              <div className="registrationPageSecondMajorInputContainer">
                <label
                  htmlFor="registrationSecondMajor"
                  className="registrationPageSecondMajorLabel"
                >
                  SecondMajor
                </label>
                <input
                  id="registrationSecondMajor"
                  onChange={(e) => setSecondMajor(e.target.value)}
                  type="text"
                  className="registrationPageSecondMajorInput"
                  autoComplete="off"
                  placeholder="Optional"
                />
              </div>
              <div className="registrationPageMinorInputContainer">
                <label
                  htmlFor="registrationMinor"
                  className="registrationPageMinorLabel"
                >
                  Minor
                </label>
                <input
                  id="registrationMinor"
                  onChange={(e) => setMinor(e.target.value)}
                  type="text"
                  className="registrationPageMinorInput"
                  autoComplete="off"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        )}
      </form>
      {successVerify && identitySelectMenuButtonText === "Student" && (
        <div className="registrationPageYearOfStudySelectSectionContainer">
          <div className="registrationPageYearOfStudySelectLabelContainer">
            <div className="registrationPageYearOfStudyLabelAndIconContainer">
              <p className="registrationPageYearOfStudySelectLabel">
                Year of Study
              </p>
              <TbCalendarTime />
            </div>
          </div>
          <div className="registrationYearOfStudySelectDropDownMenuContainer">
            <button
              className="registrationYearOfStudySelectDropDownMenuButton"
              onClick={(e) =>
                setYearOfStudySelectMenuActivation(
                  !yearOfStudySelectMenuActivation
                )
              }
            >
              {yearOfStudySelectMenuButtonText}
              <img src={dropDownIcon} className="dropDownMenuIcon" />
            </button>
            {yearOfStudySelectMenuActivation && (
              <div className="registrationYearOfStudySelectDropDownMenuContent">
                <div
                  id="Year 1"
                  className="registrationYearOfStudySelectDropDownMenuItem"
                  onClick={(e) => handleSelectYearOfStudy(e.target.id)}
                >
                  Year 1
                </div>
                <div
                  id="Year 2"
                  className="registrationYearOfStudySelectDropDownMenuItem"
                  onClick={(e) => handleSelectYearOfStudy(e.target.id)}
                >
                  Year 2
                </div>
                <div
                  id="Year 3"
                  className="registrationYearOfStudySelectDropDownMenuItem"
                  onClick={(e) => handleSelectYearOfStudy(e.target.id)}
                >
                  Year 3
                </div>
                <div
                  id="Year 4"
                  className="registrationYearOfStudySelectDropDownMenuItem"
                  onClick={(e) => handleSelectYearOfStudy(e.target.id)}
                >
                  Year 4
                </div>
                <div
                  id="Year 5"
                  className="registrationYearOfStudySelectDropDownMenuItem"
                  onClick={(e) => handleSelectYearOfStudy(e.target.id)}
                >
                  Year 5
                </div>
                <div
                  id="Year 6"
                  className="registrationYearOfStudySelectDropDownMenuItem"
                  onClick={(e) => handleSelectYearOfStudy(e.target.id)}
                >
                  Year 6
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {successVerify && (
        <div className="registrationPageDateOfBirthInputSectionContainer">
          <div className="registrationPageDateOfBirthInputLabelContainer">
            <div className="registrationPageDateOfBirthLabelAndIconContainer">
              <p className="registrationPageDateOfBirthInputLabel">Date of Birth</p>
              <LiaBirthdayCakeSolid />
            </div>
          </div>
          <div className="registrationPageDateOfBirthInputContainer">
            <p className="registrationPageDateOfBirthDisplay">{dateOfBirthValue}</p>
            <div className="registrationPageDateOfBirthCalendarIconContainer" onClick={() => selectDateOfBirthPopUpWindow()}>
              <LuCalendarDays />
            </div>
            <input type="date" id="registrationDateOfBirth" className="registrationDateOfBirthSelector" onChange={(e) => handlePickedDateOfBirth(e.target.value)}/>
          </div>
        </div>
      )}


      {successVerify && (
        <div className="registrationPageProfileImageUploadSectionContainer">
          <div className="registrationPageProfileImageUploadLabelContainer">
            <div className="registrationPageProfileImageLabelAndIconContainer">
              <p className="registrationPageProfileImageUploadLabel">
                Profile Image
              </p>
              <CgProfile />
            </div>
            <p
              className="registrationPageRemoveLabel"
              onClick={handleRemoveProfileImage}
            >
              Remove
            </p>
          </div>
          <div className="registrationPageProfileImageUploadContainer">
            <p className="registrationPageProfileImageDisplay">
              {profileImageName}
            </p>
            <div
              className="registrationPageProfileImageUploadIconContainer"
              onClick={() => selectProfileImagePopUpWindow()}
            >
              <LuUpload />
            </div>
            <input
              type="file"
              id="registrationProfileImage"
              className="registrationProfileImageSelector"
              accept="image/*"
              onChange={(e) => handleUploadedProfileImage(e)}
            />
          </div>
        </div>
      )}
      <br />
      <br />
      <div className="registrationPageRegistrationButtonCancelButtonContainer">
        <button className="registrationPageRegistrationButton" onClick={handleRegistration}>
          {registrationButtonText}
        </button>
        <button className="registrationPageCancelButton" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Registration;
