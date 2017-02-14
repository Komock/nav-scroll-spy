import ScrollToElement from 'scroll-window-to-element';
import NavScrollSpy from './nav-scroll-spy';

let HalfWindowHeight = window.innerHeight / 2;
let spy = new NavScrollSpy({
	offset: HalfWindowHeight
});
spy.init();


// Smooth scroll to element
let scroll = new ScrollToElement({
    anchors: '.nav a',
    offset: HalfWindowHeight / 2
});
scroll.init();
