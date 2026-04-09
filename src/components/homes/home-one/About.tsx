import Image from "next/image";
import Link from "next/link";

import about_1 from "@/assets/imgs/about/Foto_2_Strong.webp"
import about_2 from "@/assets/imgs/about/Foto_1_Strong.webp"

interface DataType {
   sub_title: string;
   title: string;
   desc: string;
   feature_list: {
      id: number;
      list: string[];
   }[]
}

const about_data: DataType = {
   sub_title: "¿POR QUÉ ELEGIRNOS?",
   title: "La Solución Confiable para tus Proyectos",
   desc: "En StrongWood, entendemos los desafíos de una obra. Por eso, no solo fabricamos muebles de primera, sino que ofrecemos una experiencia integral que te simplifica la vida, te garantiza calidad y te ayuda a cumplir tus objetivos. Somos tu socio estratégico para que cada proyecto sea un éxito.",
   feature_list: [
      {
         id: 1,
         list: ["Especialistas en Obras", "Gestión Total del Amoblamiento", "Plazos de Entrega Garantizados"],
      },
      {
         id: 2,
         list: ["Calidad Premium en Acabados", "Equipo de Instalación Propio", "Mayor Satisfacción Postventa"],
      },
   ],
}

const { sub_title, title, desc, feature_list } = about_data;

interface PropType {
   style: boolean;
}

const About = ({ style }: PropType) => {
   return (
      <section className={`about-2-section p-relative fix section-space ${style ? "bg-color-3 is-dark" : ""}`}>
         <div className="bg-shape-1" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-30.png)` }}></div>
         <div className="bg-shape-2" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-31.png)` }}></div>
         <div className="small-container">
            <div className="row">
               <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                  <div className="about-2-image-area p-relative wow fadeInLeft" data-wow-delay="500ms">
                     <figure className="main-image m-img">
                        <Image src={about_1} alt="" />
                     </figure>
                     <div className="small-image">
                        <Image src={about_2} alt="" />
                     </div>
                     <div className="shape-1" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-29.png)` }}></div>
                  </div>
               </div>
               <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
                  <div className="about-2-content-area pl-50">
                     <div className="title-box mb-35 wow fadeInRight" data-wow-delay=".5s">
                        <span className="section-sub-title">{sub_title}</span>
                        <h3 className="section-title mt-10">{title}</h3>
                     </div>
                     <p className="mb-35">{desc}</p>
                     <div className="row mb-45">
                        {feature_list.map((item) => (
                           <div key={item.id} className="col-lg-6">
                              <ul className="list-area">
                                 {item.list.map((list, i) => (
                                    <li key={i} className="mb-10">{list}</li>
                                 ))}
                              </ul>
                           </div>
                        ))}
                     </div>
                     <div className="about-2-btn-area">
                        <Link className="primary-btn-1 btn-hover" href="#contacto">
                           COTIZAR PROYECTO &nbsp; | <i className="icon-right-arrow"></i>
                           <span style={{ top: "147.172px", left: "108.5px" }}></span>
                        </Link>
                       
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default About
