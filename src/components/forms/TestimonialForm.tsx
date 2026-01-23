"use client"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { submitContact } from "@/app/actions";
import { useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

// 1. Define la estructura de los datos del formulario
interface FormData {
    nombre_completo: string;
    email: string;
    telefono: string;
    tipo_proyecto: string;
    etapa_proyecto: string;
    tiene_plano: string;
    mensaje: string; // El '?' lo hace opcional
}

// 2. Crea las reglas de validación con yup
const schema = yup.object({
    nombre_completo: yup.string().required("El nombre es obligatorio."),
    email: yup.string().required("El correo es obligatorio.").email("Debe ser un correo válido."),
    telefono: yup.string().required("El teléfono es obligatorio."),
    tipo_proyecto: yup.string().required("Debes seleccionar un tipo de proyecto."),
    etapa_proyecto: yup.string().required("Debes seleccionar la etapa del proyecto."),
    tiene_plano: yup.string().required("Debes indicar si tienes plano o medidas."),
    mensaje: yup.string().required("El mensaje es obligatorio."),
}).required();

const TestimonialForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    const form = useRef<HTMLFormElement>(null);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendEmail = async () => {
        if (!form.current) return console.error("Form reference is null");

        try {
            setIsSubmitting(true);

            // 1) Obtener token v3 por acción
            const action = "contact_submit";
            if (!executeRecaptcha) {
                console.warn("reCAPTCHA aún no cargó");
            } else {
                const token = await executeRecaptcha(action);
                const tokenInput = form.current.querySelector<HTMLInputElement>('input[name="g-recaptcha-token"]');
                const actionInput = form.current.querySelector<HTMLInputElement>('input[name="g-recaptcha-action"]');
                if (tokenInput) tokenInput.value = token ?? "";
                if (actionInput) actionInput.value = action;
            }

            // 2) Llamar Server Action
            const fd = new FormData(form.current);
            const result = (await submitContact(fd)) as { ok: boolean; error?: string; };

            if (result?.ok) {
                toast.success("¡Consulta recibida! Nos pondremos en contacto pronto.", { position: "top-center" });
                // Limpio campos visibles y también ocultos
                reset();
                const tokenInput = form.current.querySelector<HTMLInputElement>('input[name="g-recaptcha-token"]');
                if (tokenInput) tokenInput.value = "";
            } else {
                toast.error(result?.error || "No se pudo enviar el mensaje", {
                    position: "top-center",
                });
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // 5. Conecta handleSubmit al evento onSubmit del formulario
        <form ref={form} onSubmit={handleSubmit(sendEmail)}>
            {/* Hidden reCAPTCHA v3 */}
            <input type="hidden" name="g-recaptcha-token" />
            <input type="hidden" name="g-recaptcha-action" value="contact_submit" />

            <div className="row">
                {/* --- Nombre Completo --- */}
                <div className="col-lg-12">
                    <div className="contact__from-input mb-20">
                        <label>Nombre completo*</label>
                        <input type="text" {...register("nombre_completo")} placeholder="Ej: Juan Pérez" />
                        <p className="form_error">{errors.nombre_completo?.message}</p>
                    </div>
                </div>

                {/* --- Correo Electrónico --- */}
                <div className="col-lg-6">
                    <div className="contact__from-input mb-20">
                        <label>Correo electrónico*</label>
                        <input type="email" {...register("email")} placeholder="ejemplo@correo.com" />
                        <p className="form_error">{errors.email?.message}</p>
                    </div>
                </div>

                {/* --- Teléfono --- */}
                <div className="col-lg-6">
                    <div className="contact__from-input mb-20">
                        <label>Teléfono*</label>
                        <input type="tel" {...register("telefono")} placeholder="Ej: 11 1234 5678" />
                        <p className="form_error">{errors.telefono?.message}</p>
                    </div>
                </div>

                {/* --- Tipo de Proyecto --- */}
                <div className="col-lg-6">
                    <div className="contact__from-input mb-20">
                        <label>Tipo de proyecto*</label>
                        <select {...register("tipo_proyecto")}>
                            <option value="">Seleccionar...</option>
                            <option value="Cocina">Cocina</option>
                            <option value="Ambiente completo">Ambiente completo</option>
                            <option value="Casa completa">Casa completa</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <p className="form_error">{errors.tipo_proyecto?.message}</p>
                    </div>
                </div>

                {/* --- Etapa del Proyecto --- */}
                <div className="col-lg-6">
                    <div className="contact__from-input mb-20">
                        <label>Etapa del proyecto*</label>
                        <select {...register("etapa_proyecto")}>
                            <option value="">Seleccionar...</option>
                            <option value="Obra nueva">Obra nueva</option>
                            <option value="Remodelación">Remodelación</option>
                            <option value="Idea a futuro">Idea a futuro</option>
                        </select>
                        <p className="form_error">{errors.etapa_proyecto?.message}</p>
                    </div>
                </div>

                {/* --- ¿Tenés plano o medidas? --- */}
                <div className="col-lg-6">
                    <div className="contact__from-input mb-20">
                        <label>¿Tenés plano o medidas?*</label>
                        <select {...register("tiene_plano")}>
                            <option value="">Seleccionar...</option>
                            <option value="Sí">Sí</option>
                            <option value="En proceso">En proceso</option>
                            <option value="No todavía">No todavía</option>
                        </select>
                        <p className="form_error">{errors.tiene_plano?.message}</p>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="contact__from-input mb-20">
                        <label>Consulta o comentario</label>
                        <textarea {...register("mensaje")} placeholder="Escribe tu mensaje aquí..." rows={5}></textarea>
                        <p className="form_error">{errors.mensaje?.message}</p>
                    </div>
                </div>

                {/* --- Botón de Envío --- */}
                <div className="col-12">
                    <div className="testimonials_btn text-center">
                        <button type="submit" className="primary-btn-4 btn-hover btn-hover-2" disabled={isSubmitting}>
                            {isSubmitting ? "ENVIANDO.." : "ENVIAR CONSULTA"}
                            <span style={{ top: "147.172px", left: "108.5px" }}></span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default TestimonialForm;