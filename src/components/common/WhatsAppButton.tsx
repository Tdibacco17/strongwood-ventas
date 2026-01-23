import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/5491171196506?text=Hola%2C%20estoy%20evaluando%20un%20proyecto%20de%20cocina%20%2F%20ambiente%20completo%20y%20quer%C3%ADa%20consultar."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <FaWhatsapp size={24} />
      <span className="tooltip">Consultanos por proyectos integrales</span>
    </a>
  );
};

export default WhatsAppButton;