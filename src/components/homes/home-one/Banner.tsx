"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { JSX } from 'react';


interface DataType {
   id: number;
   thumb: string;
   sub_title: string;
   title: string;
   desc: JSX.Element;
}

const banner_data: DataType[] = [
   {
      id: 1,
      thumb: "assets/imgs/banner/4.webp",
      sub_title: "Cocinas, casas completas y ambientes pensados para obra y remodelación.",
      title: "Diseñamos y ejecutamos proyectos integrales de muebles a medida",
      desc: (<>Trabajamos proyectos desde el diseño hasta la instalación final. <br /> Nos enfocamos en proyectos completos, no en piezas sueltas.</>),
   }
   
]

const setting = {
   slidesPerView: 1,
   loop: true,
   effect: "fade",
   fadeEffect: { crossFade: true },
   autoplay: {
      delay: 5000,
      disableOnInteraction: false,
   },
   pagination: {
      el: ".banner-dot",
      clickable: true,
   },
   navigation: false,
};

const Banner = () => {
   return (
      <section className="banner-section-2 p-relative fix">
         <Swiper {...setting} modules={[Autoplay, Pagination, EffectFade]} className="swiper banner-active">
            {banner_data.map((item) => (
               <SwiperSlide key={item.id} className="swiper-slide">
                  <div className="banner-main-2" style={{ backgroundImage: `url(${item.thumb})` }}>
                     <div className="large-container">
                        <div className="banner-area-2 p-relative z-3 wow img-custom-anim-left animated" data-wow-delay="1000ms">
                           <span className="p-relative banner-sub-title">{item.sub_title}</span>
                           <h1 className="banner-title">{item.title}</h1>
                           <p className="banner-text">{item.desc}</p>
                           <div className="banner-btn-area-2">
                              <a className="primary-btn-1 btn-hover" href="#contacto">
                                  CONSULTAR PROYECTO &nbsp; | <i className="icon-right-arrow"></i>
                                 <span style={{ top: "147.172px", left: "108.5px" }}></span>
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
                  
               </SwiperSlide>
            ))}
         </Swiper>
         <div className="banner-dot-inner">
            <div className="banner-dot"></div>
         </div>
      </section>
   )
}

export default Banner
