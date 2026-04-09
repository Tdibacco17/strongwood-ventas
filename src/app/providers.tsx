"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Wrapper from "@/layouts/Wrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "head",   // (default) dónde inyectar el script
                // nonce: undefined,  
            }}
        >
            <Wrapper>
                {children}
            </Wrapper>
        </GoogleReCaptchaProvider>
    );
}
