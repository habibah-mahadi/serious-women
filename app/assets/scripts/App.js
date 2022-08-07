import '../styles/styles.css';
import 'lazysizes';
import MobileMenu from './modules/MobileMenu';
import RevealOnScroll from './modules/RevealOnScroll';
import StickyHeader from './modules/StickyHeader';
// import Modal from './modules/Modal';
import ClientArea from './modules/ClientArea';

// new Modal();
new ClientArea();
new StickyHeader();
new MobileMenu();
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75); //element should begin when it crosses the bottom 25% of the browser viewport
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60); //this will come a bit later, because it needs 40% of the element from the bottom to be visible 

//code splitting with webpack
let modal; //initially as undefined
document.querySelectorAll(".open-modal").forEach(el => {
    el.addEventListener("click", e => {
        e.preventDefault();

        //check if the modal file is already downloaded or not
        if (typeof modal == 'undefined') {

            //make promise
            import(/* webpackChunkName: "bibahmodal" */ './modules/Modal').then(x => {
                modal = new x.default();
                setTimeout(()=> modal.openTheModal(), 20);
            }
            ).catch(()=> console.log("There was a problem."))

        } else {
            modal.openTheModal();
        }

    })
})


if (module.hot) {
    module.hot.accept();
}