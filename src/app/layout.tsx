import "./globals.css";
// import "../styles/index.css";
import { Inter, Roboto } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import Script from "next/script";
import Providers from "./providers";
import WhatsAppButton from "../components/common/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });

export const metadata = {
  // metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Strong Wood",
  description: "metal roofing, industrial roofing, construction, exterior, maintenance, painting, remodelling, renovation, repair service, roof repair, roofers, roofing, roofing company, roofing service, siding websites",
  keywords: ["Strong Wood", "Muebles para Proyectos Inmobiliarios"],
  icons: { icon: "/favicon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      {/* <head> */}
      {/* <meta name="keywords" content="Strong Wood - Muebles para Proyectos Inmobiliarios" />
        <meta name="description" content="metal roofing, industrial roofing, construction, exterior, maintenance, painting, remodelling, renovation, repair service, roof repair, roofers, roofing, roofing company, roofing service, siding websites" /> */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" /> */}
      {/* For IE  */}
      {/* <meta httpEquiv="X-UA-Compatible" content="IE=edge" /> */}
      {/* <link rel="icon" href="/favicon.png" sizes="any" /> */}
      {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" /> */}
      {/* </head> */}
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NP65ZB78');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${roboto.variable}`} suppressHydrationWarning={true}>
        {/* Noscript de GTM: debe ir inmediatamente dentro de <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-NP65ZB78`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>
          {children}
        </Providers>
        <WhatsAppButton />
      </body>
    </html>
  )
}
