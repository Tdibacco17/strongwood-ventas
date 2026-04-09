"use server";

import { Resend } from "resend";

type RecaptchaVerify = {
    success: boolean;
    score?: number;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
};

export type SubmitResult = {
    ok: boolean;
    error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚙️ flag para saltear reCAPTCHA en dev (o cuando quieras)
const BYPASS_RECAPTCHA =
    process.env.NODE_ENV !== "production" || process.env.RECAPTCHA_BYPASS === "1";

async function verifyRecaptcha(token: string, expectedAction: string) {
    if (BYPASS_RECAPTCHA) {
        // En dev devolvemos éxito "alto" y acción correcta
        return { success: true, score: 1, action: expectedAction } as RecaptchaVerify;
    }

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY!,
            response: token,
        }),
        cache: "no-store",
    });

    return (await res.json()) as RecaptchaVerify;
}

export async function submitContact(formData: FormData): Promise<SubmitResult> {
    // 1) datos del form (usando tus nombres actuales)
    const user_name = String(formData.get("nombre_completo") || "");
    const user_email = String(formData.get("email") || "");
    const user_phone = String(formData.get("telefono") || "");
    const message = String(formData.get("mensaje") || "");
    const subject = "[Landing] Nuevo mensaje";

    // 2) reCAPTCHA
    const token = String(formData.get("g-recaptcha-token") || "");
    const action = String(formData.get("g-recaptcha-action") || "contact_submit");

    const verify = await verifyRecaptcha(token, action);
    const passed =
        verify.success === true &&
        (verify.score ?? 0) >= 0.5 &&
        (!verify.action || verify.action === action);

    if (!passed) {
        return { ok: false, error: "reCAPTCHA rechazado" };
    }

    // 3) enviar con Resend (con try/catch para devolver error controlado)
    const from = process.env.RESEND_FROM!;
    const to = process.env.RESEND_TO!;

    try {
        await resend.emails.send({
            from,
            to: [to],
            subject,
            replyTo: user_email || undefined,
            text: `
            Nombre: ${user_name}
            Email: ${user_email}
            Teléfono: ${user_phone}

            Mensaje:
            ${message}
                `.trim(),
        });

        return { ok: true };
    } catch (err) {
        console.error("Resend error:", err);
        return { ok: false, error: "No se pudo enviar el email" };
    }
}
