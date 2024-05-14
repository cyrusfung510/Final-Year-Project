import React from "react";
import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoKeyOutline } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import dropDownIcon from "../assets/dropDownIcon.png"
import { useHistory } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import useAuthentication from "../hooks/useAuth";

const Login = () => {
    const [identitySelectMenuActivation, setIdentitySelectMenuActivation] = useState(false);
    const [identitySelectMenuButtonText, setIdentitySelectMenuButtonText] = useState("Student");
    const [emailDomain, setEmailDomain] = useState("@connect.hku.hk");
    const [passwordInputBoxType, setPasswordInputBoxType] = useState("password");   //use to control hide or show password in the password input box
    const [showEyeIcon, setShowEyeIcon] = useState(true);
    const [showEyeOffIcon, setShowEyeOffIcon] = useState(false);
    const [loginButtonText, setLoginButtonText] = useState("Get One Time Password");
    const [gotOneTimePassword, setGotOneTimePassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const { login, sendOtp } = useAuth();
    useAuthentication("/login");


    const handleNewUser = async () => {
        history.push("/registration");
    }

    const handleSelectIdentity = (selectedIdentity) => {
        setIdentitySelectMenuActivation(false);   //close the identity select drop down menu
        setIdentitySelectMenuButtonText(selectedIdentity);  //set the button text when identity is selected
        if (selectedIdentity === "Student") {
            setEmailDomain("@connect.hku.hk");  //set the email domain name to "@connect.hku.hk" if identity is student
        }
        else if (selectedIdentity === "Teacher") {
            setEmailDomain("@hku.hk");  //set the email domain name to "@hku.hk" is identity is teacher
        }
    }

    const handleShowHidePassword = ()=> {
        if (document.getElementById("loginPassword").type === "password") {
            setPasswordInputBoxType("text");
            setShowEyeOffIcon(true);
            setShowEyeIcon(false);
        } 
        else if (document.getElementById("loginPassword").type === "text"){
            setPasswordInputBoxType("password");
            setShowEyeIcon(true);
            setShowEyeOffIcon(false);
        }
    }

    const handleResendPassword = async() => {
        await sendOtp(email+emailDomain)
    }

    const handleLogin = async(e) => {
        if (loginButtonText === "Get One Time Password") {
            if (document.getElementById('loginEmail').value === "") {
                //implement do something when the email input field is empty
                //...
            }
            else {
                const result= await sendOtp(email+emailDomain)
                if (result.ok){
                    setGotOneTimePassword(true);
                    setLoginButtonText("Login");
                }
            }
        }
        else if (loginButtonText === "Login") {
            //implement send the one time password given by the applicant to the sever to verify, if corect then login to the system
            //...
            const result = await login(email+emailDomain,password)
            console.log(result)
            if(result.ok){
                history.push("/")
            }
        }
    }
    
    return (
        <div className="m-auto w-80 p-3 test max-w-sm mx-auto left-0 right-0 bottom-5 absolute.">  {/* delete the test class name after finish */}
            <div className="loginLabelContainer">
                <p className="loginLabel">Login</p>
            </div>
            <br />
            <div className="loginPageIdentitySelectSectionContainer">
                <div className="loginPageIdentitySelectLabelContainer">
                    <div className="loginPageIdentityLabelAndIconContainer">
                        <p className="loginPageIdentitySelectLabel">Identity</p>
                        <SlPeople />
                    </div>
                </div>                    
                <div className="loginIdentitySelectDropDownMenuContainer">
                    <button className="loginIdentitySelectDropDownMenuButton" onClick={(e) => setIdentitySelectMenuActivation(!identitySelectMenuActivation)}>
                        {identitySelectMenuButtonText}
                        <img src={dropDownIcon} className="dropDownMenuIcon" />
                    </button>
                    {
                        identitySelectMenuActivation && (
                        <div className="loginIdentitySelectDropDownMenuContent">
                            <div id="Student" className="loginIdentitySelectDropDownMenuItem" onClick={(e) => handleSelectIdentity(e.target.id)}>
                                Student
                            </div> 
                            <div id="Teacher" className="loginIdentitySelectDropDownMenuItem" onClick={(e) => handleSelectIdentity(e.target.id)}>
                                Teacher
                            </div> 
                        </div>
                        )
                    }
                </div>
            </div>
            <form className="loginInformation">
                <div className="loginPageEmailInputSectionContainer">
                    <div className="loginPageEmailInputLabelContainer">
                        <div className="loginPageEmailLabelAndIconContainer">
                            <label htmlFor="loginEmail" className="loginPageEmailInputLabel">Email</label>
                            <AiOutlineMail />
                        </div>
                        <p className="loginPageNewUserLabel" onClick={handleNewUser}>New User</p>
                    </div>
                    <div className="loginPageEmailInputContainer">
                        <input id="loginEmail" onChange={(e)=>setEmail(e.target.value)} type="text" className="loginPageEmailInput" autoComplete="off"/>
                        <div className="loginPageEmailInputDomain">{emailDomain}</div>
                    </div>
                </div>
                {
                    gotOneTimePassword && (
                        <div className="loginPagePasswordInputSectionContainer">
                            <div className="loginPagePasswordInputLabelContainer">
                                <div className="loginPagePasswordLabelAndIconContainer">
                                    <label htmlFor="loginPassword" className="loginPagePasswordInputLabel">One Time Password</label>
                                    <IoKeyOutline />
                                </div>
                                <p className="loginPageResendLabel" onClick={handleResendPassword}>Resend</p>
                            </div>
                            <div className="loginPagePasswordInputContainer">
                                <input id="loginPassword" onChange={(e)=>setPassword(e.target.value)} type={passwordInputBoxType} className="loginPagePasswordInput" autoComplete="off" />
                                {showEyeIcon && <div className="loginPageEyeIconContainer" onClick={handleShowHidePassword}><IoMdEye/></div>}
                                {showEyeOffIcon && <div className="loginPageEyeOffIconContainer" onClick={handleShowHidePassword}><IoMdEyeOff/></div>}
                            </div>
                        </div>
                    )
                }
            </form>
            <br />
            <br />
            <div className="loginPageLoginButtonContainer">
                <button className="loginPageLoginButton" onClick={(e) => handleLogin(e)}>{loginButtonText}</button>
            </div>
        </div>
    );
};

export default Login;