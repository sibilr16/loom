import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const slides = [
  "/carousal-1.png",
  "/carousal-2.png",
  "/carousal-3.png",
  "/carousal-4.png",
  "/carousal-5.png",
];

function Carousel() {
  return (
    <Swiper
      className=""
      modules={[Autoplay]}
      spaceBetween={10}
      slidesPerView={2.5} // 👈 THIS is your requirement
      loop={true} // 👈 seamless infinite loop
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      speed={2000} // smooth transition
    >
      {slides.map((src, i) => (
        <SwiperSlide key={i}>
          <img src={src} className="w-full rounded-xl" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Carousel;
