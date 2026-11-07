'use client';
import { useRef } from 'react';
import { Autoplay, Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { T } from './Lang';

export default function FeaturedNewsSlider({ stories }) {
  const swiperRef = useRef(null);

  return (
    <div
      onFocusCapture={() => swiperRef.current?.autoplay?.pause()}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) swiperRef.current?.autoplay?.resume();
      }}
    >
      <Swiper
        modules={[Autoplay, Mousewheel, Pagination]}
        slidesPerView={1}
        loop={stories.length > 1}
        speed={800}
        style={{ paddingBottom: '50px' }}
        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        mousewheel={{ forceToAxis: true, thresholdTime: 500, thresholdDelta: 50 }}
        pagination={{ clickable: true }}
        onSwiper={swiper => { swiperRef.current = swiper; }}
      >
        {stories.map(story => (
          <SwiperSlide key={story.link}>
            <div className="feature">
              <div className="feature-img" style={{ '--img': `url("${story.image}")` }}></div>
              <div className="feature-text">
                <p className="tag"><T>Featured story</T></p>
                <time dateTime={story.dateTime}>{story.date}</time>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
                <a className="btn primary" href={story.link} target="_blank" rel="noopener noreferrer">
                  <T>Read full story</T>
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}