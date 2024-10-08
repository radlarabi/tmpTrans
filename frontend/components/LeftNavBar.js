import { leftSideIcons, dots } from "../assets/index.js";

export const LeftNavBar = () => {
    return `
        <div class="left-sidebar">
                <div class="icon-container" >
                    ${
                        leftSideIcons && leftSideIcons.map((icon, index) => {
                        return `
                            <a href="#${icon.name}" key=${index} class="iconSideBar">
                                <img src="${icon.link}" alt="icon" class="icon" width="25px" height="25px">
                            </a>
                            `
                        }).join("")
                    }
                </div>
            </div>
    `
}