"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

export default function BannerSlider() {
  return (
    <div className="bg-blue-400 text-white text-center p-1 text-sm">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="h-6"
      >
        <SwiperSlide className="flex items-center bg-blue-400 justify-center text-white">
          <p>Welcome to our site!</p>
        </SwiperSlide>

        <SwiperSlide className="flex items-center bg-blue-400 justify-center text-white">
          <p>Big discounts available now!</p>
        </SwiperSlide>

        <SwiperSlide className="flex items-center bg-blue-400 justify-center text-white">
          <p>Fast delivery worldwide!</p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
