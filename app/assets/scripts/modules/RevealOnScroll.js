import throttle from 'lodash/throttle'; //we want to run the function every 200ms continually when scrolling
import debounce from 'lodash/debounce'; //when resizing the browser window, we dont need to do anything during the middle of this action. We only need to do something once after we finally stopped resizing

class RevealOnScroll {
    constructor (els, thresholdPercent) {
        this.thresholdPercent = thresholdPercent;
        this.itemsToReveal = els;
        this.browserHeight = window.innerHeight;
        this.hideInitially();
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this);
        this.events();
    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle);
        window.addEventListener("resize", debounce(()=> {
            console.log("resize just run");
            this.browserHeight = window.innerHeight;
        }, 333))
    }

    calcCaller() {
        console.log("scroll function run");
        this.itemsToReveal.forEach(el=> {
            if (!el.isRevealed) { 
                this.calculateIfScrolledTo(el); //this will not be calculated if the item is revealed
            }
        });
    }

    calculateIfScrolledTo(el) {
        //lets not bother wasting resources calculating anything else if you are nowhere near an item that needs to be revealed
        //window.scrollY - how far down you've scrolled from the very top of the page
        //el.offsetTop - element's top edge, not in relation to the viewport, but in relation to the total page height
        if (window.scrollY + this.browserHeight > el.offsetTop) {
            //console.log(el.getBoundingClientRect().y);
            console.log("Element was calculated");
            let scrollPercent = (el.getBoundingClientRect().y / this.browserHeight) * 100;
            if(scrollPercent < this.thresholdPercent) { //75% of browser's height
                el.classList.add("reveal-item--is-visible");
                el.isRevealed = true;
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle);
                }
            }
        }

    }

    hideInitially() {
        this.itemsToReveal.forEach(el=> {
            el.classList.add("reveal-item");
            el.isRevealed = false;
        });

        //to completely remove the scroll event listener
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
    }
}

export default RevealOnScroll;