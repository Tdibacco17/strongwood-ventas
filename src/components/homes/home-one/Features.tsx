import Link from "next/link";
// 1. Importa los iconos que necesitas
import { FaRegClock, FaAward, FaSitemap, FaRulerCombined } from "react-icons/fa";
import { IconType } from "react-icons";

interface DataType {
  id: number;
  icon: IconType; // 2. El tipo ahora es IconType
  title: string;
  desc: string;
}

const feature_data: DataType[] = [
  {
    "id": 1,
    "icon": FaRegClock, // 3. Usamos el componente del icono directamente
    "title": "Puntualidad Innegociable",
    "desc": "Garantizamos entregas a tiempo para que cumplas con tus plazos sin sorpresas."
  },
  {
    "id": 2,
    "icon": FaAward,
    "title": "Calidad que Cuida tu Reputación",
    "desc": "Muebles con terminaciones impecables que elevan el valor de tus unidades."
  },
  {
    "id": 3,
    "icon": FaSitemap,
    "title": "Cero Complicaciones",
    "desc": "Somos tu único proveedor y contacto para todo el amoblamiento de la obra."
  },
  {
    "id": 4,
    "icon": FaRulerCombined,
    "title": "Soluciones a Medida",
    "desc": "Nos adaptamos a los planos, diseño y presupuesto de cada uno de tus proyectos."
  }
];

interface PropType {
  style: boolean;
}

const Features = ({ style }: PropType) => {
  return (
    <section className={`features-section pt-80 pb-80 bg-color-1 p-relative ${style ? "is-dark" : ""}`}>
      <div className="bg-shape-1" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-27.png)` }}></div>
      <div className="bg-shape-2" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-28.png)` }}></div>
      <div className="small-container">
        <div className="row g-4">
          {feature_data.map((item) => (
            <div key={item.id} className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
              <div className={`features-box-area p-relative wow fadeInLeft ${style ? "bg-color-5" : ""}`} data-wow-delay="500ms">
                <div className="shape-1" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-24.png)` }}></div>
                <div className="shape-2" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-25.png)` }}></div>
                <div className="shape-3" style={{ backgroundImage: `url(/assets/imgs/shapes/shape-26.png)` }}></div>
                <div className="icon-box">
                  {/* 4. Renderiza el icono como un componente */}
                  <item.icon />
                </div>
                <h5 className="mt-20 mb-10"><Link href="/services">{item.title}</Link></h5>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features;