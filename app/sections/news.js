const featuredStories = [
	{
		title: 'BU student joins ASEAN Digital GrandPals to promote scam awareness',
		description: 'A School of Engineering student was selected as one of eight Thai representatives in the ASEAN Scam Ready programme, sharing practical digital-safety awareness.',
		date: '2026-10-08',
		dateLabel: '8 Oct 2026',
		image: 'https://contents.bu.ac.th/contents/images/news/9fe8ccc4-f8aa-45e4-9fc2-356954cdf1e5.webp',
		url: 'https://www.bu.ac.th/th/featured-stories/2641'
	},
	{
		title: 'BU student wins Thailand Cyber Top Talent 2026',
		description: 'A computer science senior and team Cybr Hero Acdmia won the higher-education division of Thailand Cyber Top Talent 2026.',
		date: '2026-10-06',
		dateLabel: '6 Oct 2026',
		image: 'https://contents.bu.ac.th/contents/images/news/8d818aa6-4d59-46cb-be9d-7f0888eaeaf8.webp',
		url: 'https://www.bu.ac.th/th/featured-stories/2629'
	},
	{
		title: 'BU International partners with British Council EnglishScore',
		description: 'Bangkok University International Programs and British Council EnglishScore formalized a partnership with an MoU signing and student training workshop.',
		date: '2026-10-30',
		dateLabel: '30 Oct 2026',
		image: 'https://contents.bu.ac.th/contents/images/news/cf8cc136-80bb-4e4e-af32-1182bc1c6762.webp',
		url: 'https://www.bu.ac.th/th/featured-stories/3026'
	}
];

{
	const carousel = $('[data-feature-carousel]');
	const viewport = $('.feature-viewport', carousel);
	const track = $('[data-feature-track]', carousel);
	const dots = $('[data-feature-dots]', carousel);
	const previous = $('.feature-prev', carousel);
	const next = $('.feature-next', carousel);
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
	let activeIndex = 0;
	let timer;
	let focused = false;
	let wheelDelta = 0;
	let wheelResetTimer;
	let wheelActive = false;
	let wheelGestureLocked = false;
	let pointerState;
	let suppressedClickPointerId = null;
	let suppressedClickTimer;

	const element = (tag, className, text) => {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text) node.textContent = text;
		return node;
	};

	const slides = featuredStories.map((story, index) => {
		const slide = element('article', 'feature');
		slide.setAttribute('role', 'group');
		slide.setAttribute('aria-roledescription', 'slide');
		slide.setAttribute('aria-label', `${index + 1} of ${featuredStories.length}`);

		const link = element('a', 'feature-link');
		link.href = story.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.draggable = false;
		link.addEventListener('dragstart', event => event.preventDefault());
		link.setAttribute('aria-label', `${story.title} (opens in a new tab)`);

		const imageFrame = element('div', 'feature-img');
		const image = element('img');
		image.src = story.image;
		image.alt = story.title;
		image.draggable = false;
		image.loading = index === 0 ? 'eager' : 'lazy';
		image.decoding = 'async';
		image.addEventListener('error', () => imageFrame.classList.add('is-missing'), { once: true });
		imageFrame.append(image, element('span', 'feature-img-fallback', 'BU'));

		const text = element('div', 'feature-text');
		text.append(element('p', 'tag', 'BU News'));
		const date = element('time');
		date.dateTime = story.date;
		date.textContent = story.dateLabel;
		text.append(date, element('h3', '', story.title), element('p', 'feature-description', story.description));
		text.append(element('span', 'feature-read-more', 'Read on BU website'));

		link.append(imageFrame, text);
		slide.append(link);
		track.append(slide);
		return slide;
	});

	const pagination = featuredStories.map((story, index) => {
		const dot = element('button', 'feature-dot');
		dot.type = 'button';
		dot.setAttribute('aria-label', `Show story ${index + 1}: ${story.title}`);
		dot.addEventListener('click', () => show(index));
		dots.append(dot);
		return dot;
	});

	const stop = () => {
		clearInterval(timer);
		timer = undefined;
	};

	const schedule = () => {
		stop();
		if (featuredStories.length > 1 && !focused && !document.hidden && !reducedMotion.matches) {
			timer = setInterval(() => show(activeIndex + 1, false), 3000);
		}
	};

	function show(index, restartTimer = true) {
		activeIndex = (index + slides.length) % slides.length;
		track.style.transform = `translateX(-${activeIndex * 100}%)`;
		slides.forEach((slide, slideIndex) => { slide.inert = slideIndex !== activeIndex; });
		pagination.forEach((dot, dotIndex) => dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false'));
		if (restartTimer) schedule();
	}

	// Trackpad pan: switch slides once per horizontal gesture and resume autoplay after momentum settles.
	viewport.addEventListener('wheel', event => {
		const horizontalDelta = Math.abs(event.deltaX);
		if (slides.length < 2 || horizontalDelta <= Math.abs(event.deltaY)) return;

		event.preventDefault();
		const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
		if (!wheelActive) {
			wheelActive = true;
			wheelGestureLocked = false;
			wheelDelta = 0;
			stop();
		}
		wheelDelta += event.deltaX * unit;
		if (!wheelGestureLocked && Math.abs(wheelDelta) > 30) {
			show(activeIndex + (wheelDelta > 0 ? 1 : -1), false);
			wheelGestureLocked = true;
		}

		clearTimeout(wheelResetTimer);
		wheelResetTimer = setTimeout(() => {
			wheelDelta = 0;
			wheelActive = false;
			wheelGestureLocked = false;
			schedule();
		}, 100);
	}, { passive: false });

	// Pointer drag: disable transitions on press so the track follows the pointer 1:1.
	viewport.addEventListener('pointerdown', event => {
		if (event.button !== 0 || event.isPrimary === false || event.target.closest('button, input, select, textarea')) return;
		pointerState = {
			id: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			dragging: false
		};
		track.style.transition = 'none';
		carousel.classList.add('is-dragging');
		stop();
	});

	viewport.addEventListener('pointermove', event => {
		if (!pointerState || event.pointerId !== pointerState.id) return;

		const deltaX = event.clientX - pointerState.startX;
		const deltaY = event.clientY - pointerState.startY;
		if (!pointerState.dragging) {
			if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
			if (Math.abs(deltaX) <= Math.abs(deltaY)) {
				pointerState = null;
				track.style.transition = '';
				carousel.classList.remove('is-dragging');
				schedule();
				return;
			}

			pointerState.dragging = true;
			viewport.setPointerCapture(event.pointerId);
		}

		event.preventDefault();
		const atEdge = (activeIndex === 0 && deltaX > 0) || (activeIndex === slides.length - 1 && deltaX < 0);
		const visualDelta = atEdge ? deltaX * 0.35 : deltaX;
		track.style.transform = `translateX(calc(-${activeIndex * 100}% + ${visualDelta}px))`;
	});

	const finishPointer = (event, cancelled = false) => {
		if (!pointerState || event.pointerId !== pointerState.id) return;

		const { startX, dragging } = pointerState;
		const deltaX = event.clientX - startX;
		pointerState = null;
		track.style.transition = '';
		carousel.classList.remove('is-dragging');

		if (!dragging || cancelled) {
			show(activeIndex);
			return;
		}

		suppressedClickPointerId = event.pointerId;
		clearTimeout(suppressedClickTimer);
		suppressedClickTimer = setTimeout(() => { suppressedClickPointerId = null; }, 500);
		const direction = deltaX < -50 ? 1 : deltaX > 50 ? -1 : 0;
		show(activeIndex + direction);
	};

	viewport.addEventListener('pointerup', event => finishPointer(event));
	viewport.addEventListener('pointerleave', event => {
		if (pointerState && event.pointerId === pointerState.id && !viewport.hasPointerCapture(event.pointerId)) finishPointer(event);
	});
	viewport.addEventListener('pointercancel', event => finishPointer(event, true));
	viewport.addEventListener('lostpointercapture', event => finishPointer(event, true));
	viewport.addEventListener('click', event => {
		if (suppressedClickPointerId === null) return;
		if (typeof event.pointerId === 'number' && event.pointerId !== suppressedClickPointerId) return;
		if (event.detail === 0) return;
		event.preventDefault();
		event.stopPropagation();
		suppressedClickPointerId = null;
		clearTimeout(suppressedClickTimer);
	}, true);

	previous.addEventListener('click', () => show(activeIndex - 1));
	next.addEventListener('click', () => show(activeIndex + 1));
	carousel.addEventListener('focusin', () => { focused = true; stop(); });
	carousel.addEventListener('focusout', event => {
		if (!event.relatedTarget || !carousel.contains(event.relatedTarget)) {
			focused = false;
			schedule();
		}
	});
	document.addEventListener('visibilitychange', schedule);
	reducedMotion.addEventListener('change', schedule);

	show(0);
}

reveal('#news');
