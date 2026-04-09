import React from 'react'

// Array con el nuevo copy enfocado en beneficios clave
const text_slider: string[] = [
    "DISEÑO A MEDIDA", 
    "CALIDAD SUPERIOR", 
    "ENTREGA PUNTUAL", 
    "GESTIÓN INTEGRAL", 
    "SOLUCIONES PARA OBRAS", 
    "PRESUPUESTO EXACTO"
];

interface PropType {
    style: boolean;
}

const TextSlider = ({ style }: PropType) => {
    return (
        <section className={`text-slider-section section-space fix ${style ? "bg-color-1 is-dark" : ""}`}>
            <div className="container-fluid">
                <div className="text-slider-box">
                    {text_slider.map((item, i) => (
                        <div key={i} className="slide-box">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M30 0L38.1027 21.8973L60 30L38.1027 38.1027L30 60L21.8973 38.1027L0 30L21.8973 21.8973L30 0Z" fill="#EA1826" />
                            </svg>
                            <h1>{item}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TextSlider;
