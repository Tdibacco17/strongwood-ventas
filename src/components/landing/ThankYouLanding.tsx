"use client";

import Link from "next/link";
import styles from "./ThankYouLanding.module.css";

export default function ThankYouLanding() {
  return (
    <div className={styles.swWrap}>
      <header className={styles.swNav}>
        <Link href="/" className={styles.swLogo}>
          SW
        </Link>
      </header>

      <main className={styles.swMain}>
        <div className={styles.swCard}>
          <div className={styles.swIcon}>✓</div>
          <h1 className={styles.swHeading}>Diagnóstico recibido</h1>
          <p className={styles.swLead}>
            Gracias por compartir los detalles de tu proyecto. Nuestra prioridad es mantener un alto
            nivel de ejecución, por lo que evaluamos cada solicitud con detalle.
          </p>

          <div className={styles.swSteps}>
            <div className={styles.swStep}>
              <div className={styles.swStepNum}>1</div>
              <div className={styles.swStepText}>
                <h4>Revisión de tu proyecto</h4>
                <p>
                  Analizamos la información para confirmar si tu proyecto hace fit con nuestro sistema
                  de trabajo integral.
                </p>
              </div>
            </div>
            <div className={styles.swStep}>
              <div className={styles.swStepNum}>2</div>
              <div className={styles.swStepText}>
                <h4>Contacto vía WhatsApp</h4>
                <p>
                  Dentro de las próximas 24 a 48 hs hábiles, te escribiremos al número que nos dejaste.
                </p>
              </div>
            </div>
            <div className={styles.swStep}>
              <div className={styles.swStepNum}>3</div>
              <div className={styles.swStepText}>
                <h4>Llamada o reunión</h4>
                <p>
                  Si hay compatibilidad, coordinamos una breve charla para entender el espacio y definir
                  los próximos pasos.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.swActions}>
            <Link href="/" className={`${styles.swBtn} ${styles.swBtnPrimary}`}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
