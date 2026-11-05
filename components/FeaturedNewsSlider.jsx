'use client';
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { T } from './Lang';

export default function FeaturedNewsSlider({ stories }) {
  return (
    <Swiper
      modules={[Autoplay, Keyboard, Mousewheel, Navigation, Pagination]}
      slidesPerView={1}
      slidesPerGroup={1}
      freeMode={false}
      loop={stories.length > 1}
      speed={800}
      cssMode={false}
      style={{ paddingBottom: '50px' }}
      keyboard={{ enabled: true, onlyInViewport: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      mousewheel={{ forceToAxis: true, thresholdTime: 500, thresholdDelta: 50 }}
      navigation={true}
      pagination={{ clickable: true }}
      onTouchStart={swiper => swiper.autoplay?.stop()}
      onTouchEnd={swiper => {
        if (stories.length > 1) {
          swiper.autoplay?.stop();
          swiper.autoplay?.start();
        }
      }}
    >
      {stories.map(story => (
        <SwiperSlide key={story.link}>
          <div className="feature">
            <div className="feature-img" style={{ '--img': `url(${story.image})` }}></div>
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
  );
}