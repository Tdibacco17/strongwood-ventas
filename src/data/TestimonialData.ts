import { StaticImageData } from "next/image";

// Usamos solo las 2 imágenes que ya existen en la plantilla
import avatar_1 from "@/assets/imgs/resources/testimonials-1.png";
import avatar_2 from "@/assets/imgs/resources/testimonials-2.png";

interface DataType {
    id: number;
    avatar: StaticImageData;
    name: string;
    designation: string;
    context: string;
    desc: string;
}

const testi_data: DataType[] = [
    {
        id: 1,
        avatar: avatar_1,
        name: "Lucila Cicciaro + Natalia Helou",
        designation: "CicciaroHelou Arquitectura",
        context: "Cocina integral – CABA",
        desc: "“Gracias equipo de Strongwood por su profesionalismo y atención. Cumpliendo en tiempo, forma y gran predisposición! ❤”"
    },
    {
        id: 2,
        avatar: avatar_2,
        name: "Carolina Lipszyc",
        designation: "Arquitecta",
        context: "Proyecto en obra – Belgrano",
        desc: "“Muy buena atención y predisposición! Cumplieron con el tiempo de entrega. La cocina quedó super linda!”"
    },
    {
        id: 3,
        avatar: avatar_1, // Reutilizamos la primera imagen para evitar errores
        name: "OJA-Arquitectos",
        designation: "Estudio de Arquitectura",
        context: "Casa completa – Pilar",
        desc: "“Un equipo con todo el compromiso y la mejor predisposición. 100% recomendables!”"
    },
];

export default testi_data;