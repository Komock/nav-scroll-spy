import throttle from './throttle.js';

export default class NavScrollSpy {
	constructor(options) {
		let defaults = {
			offset: 0,
			currentClass: 'active',
			selector: 'nav a',
			throttle: 50
		};
		options ? this.options = Object.assign(defaults, options) : this.options = defaults;

		this.prevNavItems = [];
	}

	elOffsetTop(el) {
		let top = 0;
		try {
			while (el.parentNode) {
				top += el.offsetTop;
				el = el.parentNode;
			}
			return top;
		} catch (err) { //#####################=> TODO
			console.warn('Section missing!', err);
		}
		
	}

	getElements() {
		// Nav Items
		this.navItems = document.querySelectorAll(this.options.selector);

		// Store Sections
		this.sections = [];
		for (let item of this.navItems ) {
			let link = item.getAttribute('href');
			
			let section = document.querySelector(link) || document.querySelector(`*[data-section="${link.substr(1)}"]`);
			this.sections.push(section);
		}
		this.sectionsLength = this.sections.length;
	}

	getSectionsBoundaries() {
		this.sectionsBoundaries = [];
		this.sections.forEach((item, i) => {
			let top = this.elOffsetTop(item);
			this.sectionsBoundaries.push({ top: top, bottom: top + item.offsetHeight, index: i });
		});
		this.lowerBound = this.sectionsBoundaries[this.sectionsLength - 1].bottom;
	}

	setCurentMenuItems(sectionsInScreen) {
		// No items for cleaning and new available
		if( this.prevNavItems.length === 0 && sectionsInScreen.length !== 0 ){
			for( let key in sectionsInScreen ){
				this.navItems[key].parentNode.classList.add(this.options.currentClass);
			}
		}
		// Available prevNavItems and new available
		if( this.prevNavItems.length !== 0 && sectionsInScreen.length !== 0 ){
			this.navItems.forEach((item, i)=>{
				// Remove current class
				if( this.prevNavItems[i] && !sectionsInScreen[i] ){
					item.parentNode.classList.remove(this.options.currentClass);
				}
				// Add current class
				if( !this.prevNavItems[i] && sectionsInScreen[i] ){
					item.parentNode.classList.add(this.options.currentClass);
				}
				// Else available in both arrays and already have class
			});
		}
		// Available prevNavItems and new not available. Remove old
		if( this.prevNavItems.length !== 0 && sectionsInScreen.length === 0 ){
			for( let key in this.prevNavItems ){
				this.navItems[key].parentNode.classList.remove(this.options.currentClass);
			}
		}

		// Store current sections
		this.prevNavItems = sectionsInScreen;
	}

	defineCurrentSection() {
		let winScrollPos = window.pageYOffset + this.options.offset;
		let sectionsInScreen = [];
		this.sectionsBoundaries.forEach((position, i)=> {
			if (winScrollPos > position.top && winScrollPos < position.bottom ) sectionsInScreen[i] = position;
		});
	
		this.setCurentMenuItems(sectionsInScreen);
	}

	setEvents() {
		// Throttling to improve performance
		let throttledDefineCurrentSection = throttle( this.defineCurrentSection, this.options.throttle ).bind(this),
			throttledGetSectionsBoundaries = throttle( this.getSectionsBoundaries, this.options.throttle ).bind(this);

		// Scroll
		window.addEventListener('scroll', ()=> throttledDefineCurrentSection() );

		// Resize
		window.addEventListener('resize', () => {
			throttledGetSectionsBoundaries();
			throttledDefineCurrentSection();
		});
	}

	init() {
		this.getElements();
		this.getSectionsBoundaries();
		this.setEvents();
	}

}
