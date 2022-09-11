import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce'; 

class StickyHeader {
    constructor() {
        this.siteHeader = document.querySelector(".site-header");
        this.pageSections = document.querySelectorAll(".page-section");
        this.browserHeight = window.innerHeight;
        this.previousScrollY = window.scrollY;
        this.events();
    }

    events() {
        window.addEventListener("scroll", throttle(()=> this.runOnScroll(), 200));
        window.addEventListener("resize", debounce(()=> {
            this.browserHeight = window.innerHeight;
        }, 333))
    }

    runOnScroll() {
        this.determineScrollDirection();

        if (window.scrollY > 60) {
            this.siteHeader.classList.add("site-header--dark");
        } else {
            this.siteHeader.classList.remove("site-header--dark");
        }
    }

    determineScrollDirection() {
        if (window.scrollY > this.previousScrollY) {
            this.scrollDirection = 'down';
        } else {
            this.scrollDirection = 'up';
        }

        this.previousScrollY =  window.scrollY;
    }
}

export default StickyHeader;