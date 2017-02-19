import throttle from './throttle.js';

export default class NavScrollSpy {
	constructor(options) {
		let defaults = {
			offset: 0,
			currentClass: 'active',
			selector: 'nav a[href*="#"]',
			throttle: 100
		};
		options ? this.options = Object.assign(defaults, options) : this.options = defaults;

		this.prevCurrentSections = [];
		this.navItems = {};
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
		let navItemsNodeList = document.querySelectorAll(this.options.selector);
		// Store nav items in object with hash-keys
		for (let item of navItemsNodeList) {
			this.navItems[item.hash] = item;
		}

		// Store Sections
		this.sections = [];
		for (let key in this.navItems) {
			let section = document.querySelector(key);
			this.sections.push(section);
		}
	}

	getSectionsParams() {
		this.sectionsParams = [];
		this.sections.forEach((item, i) => {
			let top = this.elOffsetTop(item);
			this.sectionsParams.push({ top: top, bottom: top + item.offsetHeight, id: '#' + item.id });
		});
	}

	setCurentMenuItems(sectionsInScreen) {
		// prevCurrentSections not available
		if (this.prevCurrentSections.length === 0) {
			// No items for cleaning and no new available
			if (sectionsInScreen.length === 0) {
				return;
			}
			// No items for cleaning and new available
			else {
				for (const key in sectionsInScreen) {
					let id = sectionsInScreen[key].id;
					this.navItems[id].parentNode.classList.add(this.options.currentClass);
				}
			}
		}
		// prevCurrentSections available
		else {
			// Available prevNavItems and new not available. Remove old. ( this.prevCurrentSections.length !== 0 && sectionsInScreen.length === 0 )
			if (sectionsInScreen.length === 0) {
				for (const key in this.prevCurrentSections) {
					let id = this.prevCurrentSections[key].id;
					this.navItems[id].parentNode.classList.remove(this.options.currentClass);
				}
			}
			// Available prevNavItems and new available, compare they
			else {
				Object.keys(this.navItems).forEach((key, i) => {
					// Remove current class
					if (this.prevCurrentSections[i] && !sectionsInScreen[i]) {
						this.navItems[key].parentNode.classList.remove(this.options.currentClass);
					}
					// Add current class
					if (!this.prevCurrentSections[i] && sectionsInScreen[i]) {
						this.navItems[key].parentNode.classList.add(this.options.currentClass);
					}
					// Else available in both arrays and already have current class
				});

			}

		}

		// Store current sections
		this.prevCurrentSections = sectionsInScreen;
	}

	defineCurrentSection() {
		let winScrollPos = window.pageYOffset + this.options.offset;
		let sectionsInScreen = [];
		this.sectionsParams.forEach((section, i) => {
			if (winScrollPos > section.top && winScrollPos < section.bottom) sectionsInScreen[i] = section;
		});
		this.setCurentMenuItems(sectionsInScreen);
	}

	setEvents() {
		// Throttling to improve performance
		let throttledDefineCurrentSection = throttle(this.defineCurrentSection, this.options.throttle).bind(this),
			throttledGetSectionsParams = throttle(this.getSectionsParams, this.options.throttle).bind(this);

		// Scroll
		window.addEventListener('scroll', () => throttledDefineCurrentSection());

		// Resize
		window.addEventListener('resize', () => {
			throttledGetSectionsParams();
			throttledDefineCurrentSection();
		});
	}

	init() {
		this.getElements();
		this.getSectionsParams();
		this.setEvents();
	}

}
