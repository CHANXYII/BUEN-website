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
	const track = $('[data-feature-track]', carousel);
	const dots = $('[data-feature-dots]', carousel);
	const previous = $('.feature-prev', carousel);
	const next = $('.feature-next', carousel);
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
	let activeIndex = 0;
	let timer;
	let hovered = false;
	let focused = false;

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
		link.setAttribute('aria-label', `${story.title} (opens in a new tab)`);

		const imageFrame = element('div', 'feature-img');
		const image = element('img');
		image.src = story.image;
		image.alt = story.title;
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
		if (featuredStories.length > 1 && !hovered && !focused && !document.hidden && !reducedMotion.matches) {
			timer = setInterval(() => show(activeIndex + 1, false), 5000);
		}
	};

	function show(index, restartTimer = true) {
		activeIndex = (index + slides.length) % slides.length;
		track.style.transform = `translateX(-${activeIndex * 100}%)`;
		slides.forEach((slide, slideIndex) => { slide.inert = slideIndex !== activeIndex; });
		pagination.forEach((dot, dotIndex) => dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false'));
		if (restartTimer) schedule();
	}

	previous.addEventListener('click', () => show(activeIndex - 1));
	next.addEventListener('click', () => show(activeIndex + 1));
	carousel.addEventListener('mouseenter', () => { hovered = true; stop(); });
	carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
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
