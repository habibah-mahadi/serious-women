import '../styles/styles.css';
import MobileMenu from './modules/MobileMenu';
import StickyHeader from './modules/StickyHeader';
import 'animate.css';
import Rellax from 'rellax';

// new Modal();
new StickyHeader();
new MobileMenu(); 
new Rellax('.rellax-md', {
    breakpoints: [530, 768, 1010]
});
new Rellax('.rellax');

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

