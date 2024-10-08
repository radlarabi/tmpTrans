import { getCookie } from "../layers.js"
import { dashboard } from "./dashboard.js"
export const login = async () => {
    document.title = "Login"
    window.location.hash = '#/login'
    
    if (getCookie('token')){
        window.location.hash = '#/dashboard'
        return await dashboard()
    }

    return `
        <div class="login-container">

            <div class="form-container">
        
        
                <div class="form-animation-assets">
                    <img class="form-animation-img" src="assets/login/rocket.png">
                    <img class="form-animation-img-1" src="assets/login/white-outline.png">
                    <img class="form-animation-img-2" src="assets/login/stars.png">
                    <img class="form-animation-img-3" src="assets/login/cloud.png">
                    <img class="form-animation-img-4" src="assets/login/dots.png">
                </div>


                <div class="form-login">
                    <div class="form-header">
                        <button class="form-header-button-login" id="login" >SignIn</button>
                        <button class="form-header-button-signUp" id="signUp" onclick="goToSignUp()">signUp</button>
                    </div>
                
                    <div class="form-login-title">Sign In</div>
                    <input type="text" class="form-login-input-username" placeholder="Username" id="form-login-input-username"/>
                    <input type="password" class="form-login-input-password" placeholder="password" id="form-login-input-password"/>

                    <button class="form-login-button" onclick="submitLogin()" type="submit">SignIn</button>

                    <div class="form-login-footer-or"> Or </div>
                    

                    <div class="form-login-footer-social-media">
                        <button onclick="continueWith42()" id="continue-with-42-login" class="form-login-social-media-button">
                            <div class="form-login-footer-social-media-content">
                                <img class="img42" src="assets/icons/42_Logo.svg">
                                <div> continue with 42</div>
                            </div>
                        </button>
                    </div>
                          
                </div>

                <div class="registration-form">
                    <div class="form-header">
                        <button class="form-header-button-login registration-form-header-button-login" id="login" onclick="goToSignIn()">SignIn</button>
                        <button class="form-header-button-signUp registration-form-header-button-signUp" id="signUp" >signUp</button>
                    </div>

                    <div class="registration-form-login-title">Sign Up</div>
                    <div class="registration-form-name">
                        <input type="text" id="form-registration-input-firstname" class="form-login-input-name" placeholder="First Name">
                        <input type="text" id="form-registration-input-lastname" class="form-login-input-name" placeholder="Last Name">
                    </div>
                    <input type="text" id="form-registration-input-username" class="form-login-input-username" placeholder="Username">
                    <input type="text" id="form-registration-input-email" class="form-login-input-email" placeholder="Email">
                    <input type="password" id="form-registration-input-password1" class="form-login-input-password" placeholder="password">
                    <input type="password" id="form-registration-input-password2" class="form-login-input-password" placeholder="re-enter password">

                    <button type="submit" class="form-login-button" id="form-registration-submit" value="SignIn" onclick="submitRegistration()">SignIn</button>

                    <div class="form-login-footer-or"> Or </div>

                    <div class="form-login-footer-social-media">
                        <button onclick="continueWith42()" id="continue-with-42-login" class="form-login-social-media-button">
                            <div class="form-login-footer-social-media-content">
                                <img class="img42" src="assets/icons/42_Logo.svg">
                                <div> continue with 42</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div> 
        `;
}
