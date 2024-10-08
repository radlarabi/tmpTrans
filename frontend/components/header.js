export const header = async () => {
    return `
    <div class="dashboard-head">
        <div class="d-flex flex-row align-items-center ">
            <h4 class="welcome-text">Good evening ,</h4>
            <h4 class="welcome-subtext">${String(user.login).toUpperCase()}</h4>    
        </div>
    
        <div class="notification">
            ${searchBar()}
            <div onclick="showNotification()" class="notification-icon"> <img src="assets/icons/notification.svg" width="30px" height="30px"> </div>
        </div>
    </div>
    `
}