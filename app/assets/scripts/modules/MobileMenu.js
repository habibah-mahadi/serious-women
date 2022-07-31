class MobileMenu {
    constructor() {
        this.menuIcon = document.querySelector(".site-header__menu-icon");
        this.menuContent = document.querySelector(".site-header__menu-content");
        this.siteHeader = document.querySelector(".site-header");
        this.events();
    }

    events() {
        //addEventListener wants to modify the 'this' keyword to point towards the DOM element that was just clicked on
        //()=> this.toggleTheMenu() arrow function does not manipulate the value of 'this' keyword
        this.menuIcon.addEventListener("click", ()=> this.toggleTheMenu())
    }

    toggleTheMenu() {
        this.menuContent.classList.toggle("site-header__menu-content--is-visible");
        this.siteHeader.classList.toggle("site-header--is-expanded");
        this.menuIcon.classList.toggle("site-header__menu-icon--close-x");
    }
}

export default MobileMenu;