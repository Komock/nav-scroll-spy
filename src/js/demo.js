import ScrollToElement from 'scroll-window-to-element';
import NavScrollSpy from './nav-scroll-spy';

let quarterWindowHeight = window.innerHeight / 4;
let spy = new NavScrollSpy({
	offset: quarterWindowHeight
});
spy.init();


// Smooth scroll to element
let scroll = new ScrollToElement({
    anchors: '.nav a'
});
scroll.init();
