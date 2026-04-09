import Count from "@/components/common/Count";

interface DataType {
    id: number;
    icon: string;
    number: number;
    title: string;
    number_text?: string;
}

const counter_data: DataType[] = [
    {
        id: 1,
        icon: "icon-building", // Icono de edificio o proyecto
        number: 400,
        title: "Proyectos Entregados",
        number_text: "+"
    },
    {
        id: 2,
        icon: "icon-key", // Icono de llave o apartamento
        number: 2500,
        title: "Unidades Amobladas",
        number_text: "+"
    },
    {
        id: 3,
        icon: "icon-factory", // Icono de fábrica o industria
        number: 1850,
        title: "m² de Taller Productivo",
        number_text: " M²" // Añadimos el símbolo de metros cuadrados
    },
    {
        id: 4,
        icon: "icon-handshake", // Icono de apretón de manos o alianza
        number: 50,
        title: "Constructoras Aliadas",
        number_text: "+"
    },
];

interface PropType {
    style: boolean;
}

const Counter = ({ style }: PropType) => {
    return (
        <section className={`icon-box-counter-section section-space ${style ? "bg-color-3 is-dark" : ""}`}>
            <div className="small-container">
                <div className="row g-4">
                    {counter_data.map((item) => (
                        <div key={item.id} className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
                            <div className="icon-box-counter-area">
                                <div className="icon-box">
                                    <i className={item.icon}></i>
                                </div>
                                <div className="content">
                                    <h3><span className="counter"><Count number={item.number} /></span>{item.number_text}</h3>
                                    <span className="text-1">{item.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Counter;