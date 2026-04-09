// NO se necesitan importaciones de 'react-icons' ni de iconos específicos.

interface Datatype {
    id: number;
    icon: string; // El tipo de dato para el icono es 'string' (clase CSS)
    title: string;
    desc: string;
}

const process_data: Datatype[] = [
    {
        id: 1,
        // Clases de Font Awesome para planificación/diseño
        icon: "fa-solid fa-ruler-combined", // Icono de regla y escuadra
        title: "Planificación y Diseño",
        desc: "Analizamos los planos de tu obra, definimos los diseños y materiales, y te presentamos un presupuesto detallado. Acá le damos forma al proyecto.",
    },
    {
        id: 2,
        // Clases de Font Awesome para producción/control
        icon: "fa-solid fa-gears", // Icono de engranajes
        title: "Producción y Control",
        desc: "Fabricamos todos los amoblamientos a medida en nuestro taller, con un control de calidad exhaustivo para garantizar un resultado perfecto.",
    },
    {
        id: 3,
        // Clases de Font Awesome para instalación/entrega
        icon: "fa-solid fa-truck-fast", // Icono de camión de entrega rápida
        title: "Instalación y Entrega",
        desc: "Coordinamos la logística y enviamos a nuestro equipo propio para instalar todo en obra, asegurando una terminación limpia y profesional.",
    },
];

interface PropType {
    style: boolean;
}

const Process = ({ style }: PropType) => {
    return (
        <section className={`work-process-section section-space p-relative ${style ? "is-dark" : ""}`} style={{ backgroundImage: `url(${style ? "/assets/imgs/shapes/shape-51.png" : "/assets/imgs/bg/process-bg.png"})` }}>
            <div className="shape-1" style={{ backgroundImage: `url(${style ? "/assets/imgs/shapes/shape-52.png" : "/assets/imgs/bg/line.png"})` }}></div>
            <div className="small-container">
                <div className="title-box text-center mb-60 wow fadeInLeft" data-wow-delay=".5s">
                    <span className="section-sub-title">NUESTRO PROCESO</span>
                    <h3 className="section-title mt-10">Un Proceso Simple para Resultados Impecables</h3>
                </div>
                <div className="row g-4">
                    {process_data.map((item) => (
                        <div key={item.id} className="col-xxl-4 col-xl-4 col-lg-4">
                            <div className="work-process-box text-center ">
                                <div className="icon-box p-relative">
                                    {/* Usamos la etiqueta <i> con la clase de Font Awesome */}
                                    <i className={item.icon}></i>
                                    <span>{item.id}</span>
                                </div>
                                <div className="content">
                                    <h4 className="pt-25 pb-25">{item.title}</h4>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Process;