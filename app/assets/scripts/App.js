import '../styles/styles.css';
import MobileMenu from './modules/MobileMenu';
import RevealOnScroll from './modules/RevealOnScroll';
import StickyHeader from './modules/StickyHeader';

let stickyHeader = new StickyHeader();
let mobileMenu = new MobileMenu();
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75); //element should begin when it crosses the bottom 25% of the browser viewport
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60); //this will come a bit later, because it needs 40% of the element from the bottom to be visible 

if (module.hot) {
    module.hot.accept();
}