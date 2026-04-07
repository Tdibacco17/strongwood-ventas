"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzaEA-lOvtnswZkE52ec4xK4iCABnzDDc16qAmiXpNNzwstY9yZXnJBN4w0G05TrbHlnQ/exec";
const REDIRECT_URL = "/STRONGWOOD_COCINAS/thankyou";
const CHECKPOINTS = [
  "project_type",
  "timing",
  "property",
  "priority",
  "budget",
  "decision_stage",
  "location",
  "name",
  "phone",
];

const stepOrder = [1, 2, 3, 4, 5, 6, 7, 8];

export default function StrongwoodLanding() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState({
    sheetName: "STRONGWOOD_COCINAS",
    sheet: "STRONGWOOD_COCINAS",
    timestamp: "",
    page_url: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    project_type: "",
    timing: "",
    property: "",
    priority: "",
    budget: "",
    decision_stage: "",
    location: "",
    name: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Enviar aplicación");
  const [microText, setMicroText] = useState(
    "Revisamos cada aplicación para priorizar proyectos que realmente encajan con nuestro tipo de trabajo."
  );
  const router = useRouter();

  const sheetFieldNames: Record<string, string> = {
    timestamp: "fecha",
    page_url: "url_pagina",
    utm_source: "utm_origen",
    utm_medium: "utm_medio",
    utm_campaign: "utm_campana",
    utm_content: "utm_contenido",
    utm_term: "utm_termino",
    project_type: "tipo_proyecto",
    timing: "tiempo",
    property: "tipo_propiedad",
    priority: "prioridad",
    budget: "presupuesto",
    decision_stage: "etapa_decision",
    location: "ubicacion",
    name: "nombre",
    phone: "telefono",
  };

  useEffect(() => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    const params = new URLSearchParams(window.location.search);
    setFormValues((prev) => ({
      ...prev,
      timestamp: ts,
      page_url: window.location.href,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_term: params.get("utm_term") ?? "",
    }));

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>(".c3-reveal, .c3d-reveal")
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const step = stepOrder[currentStepIndex];
    const el = document.querySelector(`[data-step=\"${step}\"]`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, [currentStepIndex]);

  const completedCount = useMemo(() => {
    return CHECKPOINTS.reduce((count, key) => {
      return formValues[key as keyof typeof formValues] ? count + 1 : count;
    }, 0);
  }, [formValues]);

  const progress = useMemo(() => {
    return Math.round((completedCount / CHECKPOINTS.length) * 100);
  }, [completedCount]);

  useEffect(() => {
    if (formValues.project_type.includes("Cocina completa")) {
      setMicroText(
        "Perfecto. Vamos a priorizar proyectos integrales de cocina con intención real de ejecución."
      );
    } else {
      setMicroText(
        "Revisamos cada aplicación para priorizar proyectos que realmente encajan con nuestro tipo de trabajo."
      );
    }
  }, [formValues.project_type]);

  const goToStep = (nextStep: number) => {
    const safeIndex = Math.max(0, Math.min(stepOrder.length - 1, nextStep - 1));
    setCurrentStepIndex(safeIndex);
  };

  const updateField = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionClick = (
    targetId: string,
    value: string,
    nextStep?: number,
    redirect?: string
  ) => {
    updateField(targetId, value);
    if (nextStep) {
      goToStep(nextStep);
    } else if (redirect) {
      setTimeout(() => {
        window.location.hash = redirect.startsWith("#") ? redirect : `#${redirect}`;
      }, 250);
    } else {
      goToStep(stepOrder[currentStepIndex] + 1);
    }
  };

  const validateForm = () => {
    const labels: Record<string, string> = {
      project_type: "Tipo de proyecto",
      timing: "Momento para avanzar",
      property: "Tipo de propiedad",
      priority: "Prioridad",
      budget: "Rango de inversión",
      decision_stage: "Etapa de decisión",
      location: "Ubicación",
      name: "Nombre",
      phone: "Teléfono",
    };
    const missing = CHECKPOINTS.filter((key) => !formValues[key as keyof typeof formValues]).map(
      (key) => labels[key] ?? key
    );
    if (missing.length === 0) return true;
    setErrorMessage(`Falta completar: ${missing.join(" · ")}`);
    return false;
  };

  const sendBeaconFallback = (fd: FormData) => {
    try {
      const params = new URLSearchParams();
      fd.forEach((value, key) => {
        params.append(key, String(value));
      });
      const blob = new Blob([params.toString()], { type: "application/x-www-form-urlencoded" });
      return navigator.sendBeacon(SCRIPT_URL, blob);
    } catch {
      return false;
    }
  };

  const iframeFallback = (fd: FormData) => {
    return new Promise<boolean>((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.name = "sw_iframe_sink";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const f = document.createElement("form");
      f.action = SCRIPT_URL;
      f.method = "POST";
      f.target = "sw_iframe_sink";

      fd.forEach((value, key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        f.appendChild(input);
      });

      document.body.appendChild(f);
      f.submit();

      setTimeout(() => {
        try {
          document.body.removeChild(f);
        } catch {}
        try {
          document.body.removeChild(iframe);
        } catch {}
        resolve(true);
      }, 650);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage("");
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitLabel("Enviando…");

    const fd = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      const fieldName = sheetFieldNames[key] ?? key;
      fd.set(fieldName, value);
    });

    try {
      const payloadObj: Record<string, string> = {};
      fd.forEach((value, key) => {
        payloadObj[key] = String(value);
      });
      fd.set("raw_json", JSON.stringify(payloadObj));
    } catch {}

    fd.set("sheetName", "STRONGWOOD_COCINAS");
    fd.set("sheet", "STRONGWOOD_COCINAS");

    const beaconOk = sendBeaconFallback(fd);
    if (!beaconOk) {
      await iframeFallback(fd);
    }

    setTimeout(() => {
      router.push(REDIRECT_URL);
    }, 500);
  };

  const getStepLocked = (stepNumber: number) => {
    return stepNumber > stepOrder[currentStepIndex];
  };

  return (
    <div className="c3-wrap">
      <div className="c3-top">
        <div className="c3-container">
          <div className="c3-nav">
            <div className="c3-brand">
              <div className="c3-logo">
                <span>SW</span>
              </div>
              <div>StrongWood</div>
            </div>

            <div className="c3-navlinks">
              <a className="c3-btn c3-btn-ghost" href="#problema">
                El problema
              </a>
              <a className="c3-btn c3-btn-ghost" href="#proceso">
                Cómo trabajamos
              </a>
              <a className="c3-btn c3-btn-primary" href="#diagnostico">
                Aplicar
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="c3-hero" id="top">
        <div className="c3-container">
          <div className="c3-hero-grid">
            <div className="c3-glass c3-hero-copy">
              <div className="c3-kicker c3-reveal">
                <span>●</span>
                <span>
                  <b>Proyectos de cocina completos.</b> No módulos sueltos.
                </span>
              </div>

              <h1 className="c3-reveal">
                Tu cocina no se compra por partes.
                <br />Se diseña para que todo encaje.
              </h1>

              <p className="c3-reveal">
                Para personas que están por <b>hacer su cocina ahora</b>, quieren un
                resultado impecable y no están dispuestas a perder tiempo
                coordinando carpintero, diseño, instalación y decisiones improvisadas.
                <br />
                <br />
                En <b>StrongWood</b> desarrollamos <b>proyectos integrales de cocina</b>:
                diseño, fabricación e instalación pensados como un sistema completo.
                Para que se vea bien, funcione bien y quede bien desde el primer día.
              </p>

              <div className="c3-actions c3-reveal">
                <a className="c3-btn c3-btn-primary" href="#diagnostico">
                  Quiero evaluar mi proyecto
                </a>
                <a className="c3-btn c3-btn-ghost" href="#problema">
                  Ver si esto es para mí
                </a>
              </div>

              <div className="c3-micro c3-reveal">{microText}</div>
            </div>

            <div className="c3-hero-visual c3-reveal">
              <div className="c3-hero-overlay">
                <h3>Una decisión importante merece un sistema completo.</h3>
                <p>
                  Menos improvisación. Menos errores caros. Más claridad, mejor diseño
                  y una cocina pensada para durar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="c3-section c3-soft" id="problema">
        <div className="c3-container">
          <h2 className="c3-title c3-reveal">
            El error caro no es elegir mal un mueble.
            <br />Es pensar la cocina por partes.
          </h2>
          <p className="c3-lead c3-reveal">
            Cuando una cocina se resuelve sin una visión completa, aparecen los
            problemas que después se pagan todos los días: espacios desperdiciados,
            decisiones apuradas, estética desalineada y una obra que se vuelve más
            lenta, más costosa y más desgastante.
          </p>

          <div className="c3-compare">
            <div className="c3-compare-card bad c3-reveal">
              <div className="c3-pill">Comprar por partes</div>
              <h3>Más fricción. Más desgaste.</h3>
              <ul className="c3-list">
                <li>
                  <span className="c3-dot" />
                  <span>
                    Terminás coordinando varios proveedores y cada uno resuelve “su
                    parte”.
                  </span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    Se pierde lugar de guardado y aparecen decisiones que no conversan
                    entre sí.
                  </span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    La cocina puede quedar linda en fotos, pero incómoda en el uso
                    diario.
                  </span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    El costo emocional sube: dudas, demoras, correcciones y
                    arrepentimientos.
                  </span>
                </li>
              </ul>
            </div>

            <div className="c3-compare-card good c3-reveal">
              <div className="c3-pill">Proyecto integral StrongWood</div>
              <h3>Más orden. Mejor resultado.</h3>
              <ul className="c3-list">
                <li>
                  <span className="c3-dot" />
                  <span>
                    Todo se diseña como un sistema: funcionalidad, proporciones,
                    guardado y terminaciones.
                  </span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    Cada centímetro tiene una intención y cada módulo encaja con el conjunto.
                  </span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    La cocina se ve limpia, se usa mejor y transmite la calidad del
                    proyecto completo.
                  </span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    Vos tenés claridad, proceso y un único equipo llevando la ejecución.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }} className="c3-reveal">
            <a className="c3-btn c3-btn-primary" href="#diagnostico">
              Quiero ver si mi proyecto encaja
            </a>
          </div>
        </div>
      </section>

      <section className="c3-section" id="cliente">
        <div className="c3-container">
          <h2 className="c3-title c3-reveal">
            Esto es para quien quiere hacerlo una vez y hacerlo bien.
          </h2>
          <p className="c3-lead c3-reveal">
            Nuestro mejor cliente no está “mirando ideas”. Está en momento de decisión.
            Se está mudando, refaccionando o redefiniendo su espacio y quiere una cocina
            que combine estética, orden y uso real.
          </p>

          <div className="c3-grid">
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Momento</div>
              <h3>Está por avanzar ahora</h3>
              <p>
                No viene a sacar precios al azar. Está próximo a ejecutar y quiere hacerlo
                con criterio.
              </p>
            </div>
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Mentalidad</div>
              <h3>Valora tranquilidad</h3>
              <p>
                No quiere renegar ni administrar cinco frentes. Quiere delegar en un equipo serio.
              </p>
            </div>
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Resultado</div>
              <h3>Busca impecabilidad</h3>
              <p>
                No persigue lo barato. Busca un resultado que se sienta correcto todos los días.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="c3-section c3-soft" id="proceso">
        <div className="c3-container">
          <h2 className="c3-title c3-reveal">Cómo trabajamos un proyecto de cocina</h2>
          <p className="c3-lead c3-reveal">
            Diseñamos para que la cocina funcione antes de fabricarla. Y ejecutamos para que se
            instale con la precisión que el proyecto merece.
          </p>

          <div className="c3-steps">
            <div className="c3-step c3-reveal">
              <div className="c3-num">1</div>
              <h3>Diagnóstico del espacio</h3>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                Entendemos el contexto, el uso esperado, las decisiones de obra y el nivel de proyecto
                que querés construir.
              </p>
            </div>
            <div className="c3-step c3-reveal">
              <div className="c3-num">2</div>
              <h3>Diseño integral</h3>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                Definimos distribución, módulos, estética, guardado y lógica funcional para que todo
                responda a una sola visión.
              </p>
            </div>
            <div className="c3-step c3-reveal">
              <div className="c3-num">3</div>
              <h3>Fabricación</h3>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                Llevamos el proyecto a producción cuidando terminaciones, materiales y consistencia
                en cada pieza del sistema.
              </p>
            </div>
            <div className="c3-step c3-reveal">
              <div className="c3-num">4</div>
              <h3>Instalación final</h3>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                Coordinamos el cierre para que la cocina quede como fue pensada: alineada, limpia y
                lista para vivirla.
              </p>
            </div>
          </div>

          <div className="c3-grid" style={{ marginTop: 20 }}>
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Lo que cuidamos</div>
              <h3>Funcionalidad real</h3>
              <p>La cocina no sólo tiene que verse bien. Tiene que simplificar el uso cotidiano.</p>
            </div>
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Lo que evitamos</div>
              <h3>Errores caros</h3>
              <p>Decisiones improvisadas, módulos forzados, espacios perdidos y arrepentimientos posteriores.</p>
            </div>
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Lo que sentís</div>
              <h3>Tranquilidad</h3>
              <p>Un único proceso, una visión completa y un equipo empujando el proyecto en serio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="c3-section" id="fit">
        <div className="c3-container">
          <h2 className="c3-title c3-reveal">No es para todo el mundo. Y eso está bien.</h2>
          <p className="c3-lead c3-reveal">
            Para cuidar el nivel de los proyectos, preferimos decir que no cuando no encaja. Este filtro
            existe para proteger tu tiempo y el nuestro.
          </p>

          <div className="c3-grid2">
            <div className="c3-card c3-reveal">
              <div className="c3-pill">Esto no</div>
              <h3>No encaja si…</h3>
              <ul className="c3-list">
                <li>
                  <span className="c3-dot" />
                  <span>Buscás resolver un mueble puntual o una pieza aislada.</span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>Estás comparando únicamente por precio.</span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>Tu proyecto todavía no tiene intención real de ejecutarse.</span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>Querés algo rápido sin dedicar tiempo a pensar el conjunto.</span>
                </li>
              </ul>
            </div>

            <div className="c3-card c3-reveal">
              <div className="c3-pill">Esto sí</div>
              <h3>Encaja si…</h3>
              <ul className="c3-list">
                <li>
                  <span className="c3-dot" />
                  <span>Querés una cocina completa y bien resuelta.</span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>Valorás diseño, precisión y una experiencia sin caos.</span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>Estás listo para avanzar en el corto plazo.</span>
                </li>
                <li>
                  <span className="c3-dot" />
                  <span>
                    Preferís pagar por hacerlo bien antes que pagar dos veces por corregir.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }} className="c3-reveal">
            <a className="c3-btn c3-btn-primary" href="#diagnostico">
              Sí, quiero aplicar
            </a>
          </div>
        </div>
      </section>

      <section className="c3-section c3-soft" id="faq">
        <div className="c3-container">
          <h2 className="c3-title c3-reveal">Preguntas rápidas</h2>
          <p className="c3-lead c3-reveal">
            Para decidir con claridad antes de dar el siguiente paso.
          </p>

          <div className="c3-faq">
            <details className="c3-reveal">
              <summary>¿Hacen muebles sueltos?</summary>
              <p>
                No. El foco está en proyectos integrales de cocina. Eso nos permite cuidar mejor el
                resultado, la coherencia del diseño y la experiencia completa.
              </p>
            </details>
            <details className="c3-reveal">
              <summary>¿Trabajan sólo diseño o también ejecución?</summary>
              <p>
                Trabajamos el proyecto completo: diseño, fabricación e instalación. La lógica es resolver
                todo como un sistema, no como partes inconexas.
              </p>
            </details>
            <details className="c3-reveal">
              <summary>¿Qué tipo de cliente encaja mejor?</summary>
              <p>
                Quien está por hacer su cocina ahora, valora un resultado premium, quiere minimizar errores
                y busca una experiencia más ordenada y confiable.
              </p>
            </details>
            <details className="c3-reveal">
              <summary>¿Qué pasa después de enviar el diagnóstico?</summary>
              <p>
                Revisamos la información, evaluamos si tu proyecto encaja con nuestro tipo de trabajo y te
                contactamos para avanzar si vemos buen fit.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="c3-section" id="diagnostico">
        <div className="c3-container">
          <div className="c3d-wrap">
            <div className="c3d-main">
              <div className="c3d-container">
                <div className="c3d-hero">
                  <div className="c3d-kicker c3d-reveal">
                    <span>✓</span>
                    <span>
                      <b>Aplicación breve.</b> Esto tarda menos de 2 minutos.
                    </span>
                  </div>

                  <h1 className="c3d-reveal">
                    Contanos tu proyecto de cocina.
                    <br />Y vemos si encaja.
                  </h1>

                  <p className="c3d-sub c3d-reveal">
                    Este diagnóstico nos ayuda a entender si estás en el momento correcto, el tipo de proyecto que querés construir y si StrongWood es el equipo indicado para ejecutarlo.
                  </p>
                </div>

                <div className="c3d-card c3d-reveal" style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="c3d-pill">Filtro de proyecto — 2 minutos</div>
                  </div>

                  <div className="c3d-progress" aria-label="Progreso del diagnóstico">
                    <div className="c3d-bar" aria-hidden="true">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                    <div className="c3d-pct">{progress}%</div>
                  </div>

                  <form id="c3dForm" autoComplete="on" onSubmit={handleSubmit}>
                    <input type="hidden" name="sheetName" value={formValues.sheetName} />
                    <input type="hidden" name="sheet" value={formValues.sheet} />
                    <input type="hidden" name="fecha" value={formValues.timestamp} />
                    <input type="hidden" name="url_pagina" value={formValues.page_url} />
                    <input type="hidden" name="utm_origen" value={formValues.utm_source} />
                    <input type="hidden" name="utm_medio" value={formValues.utm_medium} />
                    <input type="hidden" name="utm_campana" value={formValues.utm_campaign} />
                    <input type="hidden" name="utm_contenido" value={formValues.utm_content} />
                    <input type="hidden" name="utm_termino" value={formValues.utm_term} />
                    <input type="hidden" name="tipo_proyecto" value={formValues.project_type} />
                    <input type="hidden" name="tiempo" value={formValues.timing} />
                    <input type="hidden" name="tipo_propiedad" value={formValues.property} />
                    <input type="hidden" name="prioridad" value={formValues.priority} />
                    <input type="hidden" name="presupuesto" value={formValues.budget} />
                    <input type="hidden" name="etapa_decision" value={formValues.decision_stage} />
                    <input type="hidden" name="ubicacion" value={formValues.location} />
                    <input type="hidden" name="nombre" value={formValues.name} />
                    <input type="hidden" name="telefono" value={formValues.phone} />

                    <div className={`c3d-q ${getStepLocked(1) ? "is-locked" : ""}`} data-step="1">
                      <p className="c3d-qlabel">1) ¿Qué tipo de proyecto querés resolver?</p>
                      <p className="c3d-qhelp">Buscamos proyectos integrales de cocina, no muebles aislados.</p>

                      <div className="c3d-options" data-target="project_type">
                        <div
                          className={`c3d-opt ${formValues.project_type === "Cocina completa para vivienda" ? "is-on" : ""}`}
                          data-value="Cocina completa para vivienda"
                          data-next="2"
                          onClick={() => handleOptionClick("project_type", "Cocina completa para vivienda", 2)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Cocina completa</div>
                            <div className="c3d-d">Para casa o departamento propio.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.project_type === "Cocina completa para inversión / desarrollo" ? "is-on" : ""}`}
                          data-value="Cocina completa para inversión / desarrollo"
                          data-next="2"
                          onClick={() => handleOptionClick("project_type", "Cocina completa para inversión / desarrollo", 2)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Proyecto para inversión</div>
                            <div className="c3d-d">Unidad premium, desarrollo o propiedad a valorizar.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.project_type === "Mueble aislado / módulo suelto" ? "is-on" : ""}`}
                          data-value="Mueble aislado / módulo suelto"
                          data-redirect="#fit"
                          onClick={() => handleOptionClick("project_type", "Mueble aislado / módulo suelto", undefined, "#fit")}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Algo puntual</div>
                            <div className="c3d-d">Un mueble, un módulo o una solución aislada.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.project_type === "Estoy definiendo si hacer cocina completa" ? "is-on" : ""}`}
                          data-value="Estoy definiendo si hacer cocina completa"
                          data-next="2"
                          onClick={() => handleOptionClick("project_type", "Estoy definiendo si hacer cocina completa", 2)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Estoy definiendo</div>
                            <div className="c3d-d">Todavía ajustando alcance, pero con intención real.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(2) ? "is-locked" : ""}`} data-step="2">
                      <p className="c3d-qlabel">2) ¿Cuándo te gustaría avanzar?</p>
                      <p className="c3d-qhelp">Esto nos ayuda a priorizar proyectos con timing real.</p>
                      <div className="c3d-options" data-target="timing">
                        <div
                          className={`c3d-opt ${formValues.timing === "Quiero avanzar ya" ? "is-on" : ""}`}
                          data-value="Quiero avanzar ya"
                          data-next="3"
                          onClick={() => handleOptionClick("timing", "Quiero avanzar ya", 3)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Ahora</div>
                            <div className="c3d-d">Ya estoy en proceso de decisión.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.timing === "Dentro de 30 a 60 días" ? "is-on" : ""}`}
                          data-value="Dentro de 30 a 60 días"
                          data-next="3"
                          onClick={() => handleOptionClick("timing", "Dentro de 30 a 60 días", 3)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">30–60 días</div>
                            <div className="c3d-d">Estoy preparando el proyecto para ejecutar.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.timing === "Dentro de 2 a 4 meses" ? "is-on" : ""}`}
                          data-value="Dentro de 2 a 4 meses"
                          data-next="3"
                          onClick={() => handleOptionClick("timing", "Dentro de 2 a 4 meses", 3)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">2–4 meses</div>
                            <div className="c3d-d">Quiero hacerlo bien y con planificación.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.timing === "Solo explorando sin fecha" ? "is-on" : ""}`}
                          data-value="Solo explorando sin fecha"
                          data-redirect="#faq"
                          onClick={() => handleOptionClick("timing", "Solo explorando sin fecha", undefined, "#faq")}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Sólo explorando</div>
                            <div className="c3d-d">Todavía sin fecha ni decisión cercana.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(3) ? "is-locked" : ""}`} data-step="3">
                      <p className="c3d-qlabel">3) ¿En qué tipo de propiedad sería?</p>
                      <p className="c3d-qhelp">Así entendemos mejor el nivel del proyecto y el contexto de uso.</p>
                      <div className="c3d-options" data-target="property">
                        <div
                          className={`c3d-opt ${formValues.property === "Casa" ? "is-on" : ""}`}
                          data-value="Casa"
                          data-next="4"
                          onClick={() => handleOptionClick("property", "Casa", 4)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Casa</div>
                            <div className="c3d-d">Vivienda principal o segunda residencia.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.property === "Departamento premium" ? "is-on" : ""}`}
                          data-value="Departamento premium"
                          data-next="4"
                          onClick={() => handleOptionClick("property", "Departamento premium", 4)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Departamento</div>
                            <div className="c3d-d">Unidad premium, remodelación o compra nueva.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.property === "Desarrollo / inversión" ? "is-on" : ""}`}
                          data-value="Desarrollo / inversión"
                          data-next="4"
                          onClick={() => handleOptionClick("property", "Desarrollo / inversión", 4)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Desarrollo / inversión</div>
                            <div className="c3d-d">Proyecto para valorizar o vender/alquilar mejor.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.property === "Otro" ? "is-on" : ""}`}
                          data-value="Otro"
                          data-next="4"
                          onClick={() => handleOptionClick("property", "Otro", 4)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Otro</div>
                            <div className="c3d-d">Lo aclaramos luego en el contacto.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(4) ? "is-locked" : ""}`} data-step="4">
                      <p className="c3d-qlabel">4) ¿Qué es lo más importante para vos en este proyecto?</p>
                      <p className="c3d-qhelp">Elegí lo que más querés evitar o conseguir.</p>
                      <div className="c3d-options" data-target="priority">
                        <div
                          className={`c3d-opt ${formValues.priority === "Que quede impecable visualmente" ? "is-on" : ""}`}
                          data-value="Que quede impecable visualmente"
                          data-next="5"
                          onClick={() => handleOptionClick("priority", "Que quede impecable visualmente", 5)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Estética impecable</div>
                            <div className="c3d-d">Que el resultado se vea premium y alineado.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.priority === "Aprovechar bien cada espacio" ? "is-on" : ""}`}
                          data-value="Aprovechar bien cada espacio"
                          data-next="5"
                          onClick={() => handleOptionClick("priority", "Aprovechar bien cada espacio", 5)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Funcionalidad</div>
                            <div className="c3d-d">Más guardado, mejor uso y cero improvisación.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.priority === "Delegar y evitar caos de proveedores" ? "is-on" : ""}`}
                          data-value="Delegar y evitar caos de proveedores"
                          data-next="5"
                          onClick={() => handleOptionClick("priority", "Delegar y evitar caos de proveedores", 5)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Tranquilidad</div>
                            <div className="c3d-d">No querer coordinar todo por tu cuenta.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.priority === "Todo junto: estética, uso y proceso" ? "is-on" : ""}`}
                          data-value="Todo junto: estética, uso y proceso"
                          data-next="5"
                          onClick={() => handleOptionClick("priority", "Todo junto: estética, uso y proceso", 5)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Todo junto</div>
                            <div className="c3d-d">Quiero resolver el conjunto correctamente.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(5) ? "is-locked" : ""}`} data-step="5">
                      <p className="c3d-qlabel">5) ¿Qué rango de inversión estás contemplando para la cocina?</p>
                      <p className="c3d-qhelp">No es una cotización. Es para saber si estamos hablando del mismo tipo de proyecto.</p>
                      <div className="c3d-options" data-target="budget">
                        <div
                          className={`c3d-opt ${formValues.budget === "Presupuesto inicial / muy ajustado" ? "is-on" : ""}`}
                          data-value="Presupuesto inicial / muy ajustado"
                          data-redirect="#fit"
                          onClick={() => handleOptionClick("budget", "Presupuesto inicial / muy ajustado", undefined, "#fit")}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Estoy muy ajustado</div>
                            <div className="c3d-d">Todavía no definí una inversión acorde a un proyecto integral.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.budget === "Proyecto medio" ? "is-on" : ""}`}
                          data-value="Proyecto medio"
                          data-next="6"
                          onClick={() => handleOptionClick("budget", "Proyecto medio", 6)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Proyecto medio</div>
                            <div className="c3d-d">Busco una cocina completa bien resuelta.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.budget === "Proyecto premium" ? "is-on" : ""}`}
                          data-value="Proyecto premium"
                          data-next="6"
                          onClick={() => handleOptionClick("budget", "Proyecto premium", 6)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Proyecto premium</div>
                            <div className="c3d-d">Priorizo calidad, diseño y proceso por encima del precio.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.budget === "A definir según propuesta" ? "is-on" : ""}`}
                          data-value="A definir según propuesta"
                          data-next="6"
                          onClick={() => handleOptionClick("budget", "A definir según propuesta", 6)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">A definir</div>
                            <div className="c3d-d">Quiero entender bien el proyecto antes de definir.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(6) ? "is-locked" : ""}`} data-step="6">
                      <p className="c3d-qlabel">6) ¿En qué etapa de decisión estás?</p>
                      <p className="c3d-qhelp">Queremos saber si ya estás listo para conversar en serio.</p>
                      <div className="c3d-options" data-target="decision_stage">
                        <div
                          className={`c3d-opt ${formValues.decision_stage === "Ya quiero avanzar con un equipo" ? "is-on" : ""}`}
                          data-value="Ya quiero avanzar con un equipo"
                          data-next="7"
                          onClick={() => handleOptionClick("decision_stage", "Ya quiero avanzar con un equipo", 7)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Listo para avanzar</div>
                            <div className="c3d-d">Quiero elegir bien y mover el proyecto.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.decision_stage === "Comparando opciones serias" ? "is-on" : ""}`}
                          data-value="Comparando opciones serias"
                          data-next="7"
                          onClick={() => handleOptionClick("decision_stage", "Comparando opciones serias", 7)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Comparando opciones</div>
                            <div className="c3d-d">Pero con intención real de decidir pronto.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.decision_stage === "Ya tengo obra / arquitecto en marcha" ? "is-on" : ""}`}
                          data-value="Ya tengo obra / arquitecto en marcha"
                          data-next="7"
                          onClick={() => handleOptionClick("decision_stage", "Ya tengo obra / arquitecto en marcha", 7)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Obra en marcha</div>
                            <div className="c3d-d">Necesito que la cocina acompañe el proyecto.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.decision_stage === "Solo buscando ideas" ? "is-on" : ""}`}
                          data-value="Solo buscando ideas"
                          data-redirect="#top"
                          onClick={() => handleOptionClick("decision_stage", "Solo buscando ideas", undefined, "#top")}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Solo ideas</div>
                            <div className="c3d-d">Todavía sin decisión ni intención de avanzar.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(7) ? "is-locked" : ""}`} data-step="7">
                      <p className="c3d-qlabel">7) ¿Dónde estaría ubicado tu proyecto?</p>
                      <p className="c3d-qhelp">Así validamos zona y logística antes de contactarte.</p>
                      <div className="c3d-options" data-target="location">
                        <div
                          className={`c3d-opt ${formValues.location === "CABA / GBA" ? "is-on" : ""}`}
                          data-value="CABA / GBA"
                          data-next="8"
                          onClick={() => handleOptionClick("location", "CABA / GBA", 8)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">CABA / GBA</div>
                            <div className="c3d-d">Zona metropolitana.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.location === "Interior de Buenos Aires" ? "is-on" : ""}`}
                          data-value="Interior de Buenos Aires"
                          data-next="8"
                          onClick={() => handleOptionClick("location", "Interior de Buenos Aires", 8)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Interior de Buenos Aires</div>
                            <div className="c3d-d">Coordinación según proyecto.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.location === "Otra provincia" ? "is-on" : ""}`}
                          data-value="Otra provincia"
                          data-next="8"
                          onClick={() => handleOptionClick("location", "Otra provincia", 8)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Otra provincia</div>
                            <div className="c3d-d">Lo evaluamos según alcance.</div>
                          </div>
                        </div>
                        <div
                          className={`c3d-opt ${formValues.location === "Prefiero contarlo por WhatsApp" ? "is-on" : ""}`}
                          data-value="Prefiero contarlo por WhatsApp"
                          data-next="8"
                          onClick={() => handleOptionClick("location", "Prefiero contarlo por WhatsApp", 8)}
                        >
                          <div className="c3d-dot" />
                          <div className="c3d-txt">
                            <div className="c3d-t">Lo aclaro después</div>
                            <div className="c3d-d">Te doy contexto al contactarme.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`c3d-q ${getStepLocked(8) ? "is-locked" : ""}`} data-step="8" id="q_contact">
                      <p className="c3d-qlabel">Último paso: dejá tus datos</p>
                      <p className="c3d-qhelp">Si vemos buen fit, te contactamos para conversar el proyecto.</p>

                      <div className="c3d-field" style={{ marginBottom: 10 }}>
                        <label className="c3d-small" htmlFor="c3dName">
                          Nombre
                        </label>
                        <input
                          id="c3dName"
                          name="nombre"
                          type="text"
                          placeholder="Ej: Matías"
                          required
                          value={formValues.name}
                          onChange={(event) => updateField("name", event.target.value)}
                        />
                      </div>

                      <div className="c3d-field">
                        <label className="c3d-small" htmlFor="c3dPhone">
                          Teléfono (WhatsApp)
                        </label>
                        <input
                          id="c3dPhone"
                          name="telefono"
                          type="tel"
                          placeholder="Ej: +54 9 11 1234 5678"
                          required
                          value={formValues.phone}
                          onChange={(event) => updateField("phone", event.target.value)}
                        />
                      </div>
                    </div>

                    {errorMessage ? (
                      <div className="c3d-error" id="c3dErr" style={{ display: "block" }}>
                        {errorMessage}
                      </div>
                    ) : (
                      <div className="c3d-error" id="c3dErr" />
                    )}

                    <div className="c3d-actions">
                      <button className="c3d-btn c3d-primary" id="c3dSubmit" type="submit" disabled={progress !== 100 || isSubmitting}>
                        {submitLabel}
                      </button>
                    </div>

                    <p className="c3d-micro" id="c3dMicro">
                      Revisamos cada aplicación para priorizar proyectos que realmente encajan con nuestro tipo de trabajo.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="c3-sticky">
        <div className="c3-inner">
          <div className="c3-bar">
            <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              ¿Estás por hacer tu cocina ahora?
            </span>
            <a className="c3-btn c3-btn-primary" href="#diagnostico">
              Aplicar al diagnóstico
            </a>
          </div>
        </div>
      </div>

      <footer className="c3-footer">
        <div className="c3-container">
          <div className="c3-footer-inner">
            <div className="c3-footer-brand">
              <div className="c3-logo">
                <span>SW</span>
              </div>
              <span>StrongWood</span>
            </div>
            <div className="c3-footer-links">
              <a className="c3-footer-link" href="#top">Inicio</a>
              <a className="c3-footer-link" href="#diagnostico">Aplicar</a>
              <a className="c3-footer-link" href="#faq">Preguntas</a>
            </div>
            <div className="c3-footer-copy">© {new Date().getFullYear()} StrongWood. Proyectos integrales de cocina.</div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --bg: #f5f5f7;
          --ink: #111111;
          --muted: #6e6e73;
          --line: #e5e5ea;
          --soft: #ffffff;
          --card: #ffffff;
          --shadow: 0 24px 80px rgba(0, 0, 0, 0.08);
          --radius: 28px;
          --brand: #111111;
          --brand2: #3a3a3c;
          --max: 1200px;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .c3-wrap {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          color: var(--ink);
          background: var(--bg);
          line-height: 1.25;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .c3-wrap * {
          box-sizing: border-box;
        }

        .c3-container {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 24px;
        }

        .c3-top {
          position: sticky;
          top: 0;
          z-index: 60;
          backdrop-filter: blur(16px);
          background: rgba(245, 245, 247, 0.72);
          border-bottom: 1px solid rgba(17, 17, 17, 0.06);
        }

        .c3-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
        }

        .c3-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .c3-logo {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .c3-logo span {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .c3-navlinks {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .c3-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 999px;
          font-weight: 600;
          border: 1px solid transparent;
          text-decoration: none !important;
          cursor: pointer;
          user-select: none;
          transition: transform 0.15s ease, filter 0.15s ease, background 0.15s ease,
            box-shadow 0.15s ease;
          will-change: transform;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .c3-btn:active {
          transform: translateY(1px) scale(0.99);
        }

        .c3-btn-primary {
          background: linear-gradient(180deg, #1d1d1f, #000);
          color: #fff;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
        }

        .c3-btn-primary:hover {
          filter: brightness(1.04);
          color: #fff;
        }

        .c3-btn-ghost {
          background: rgba(255, 255, 255, 0.72);
          color: var(--ink);
          border: 1px solid var(--line);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.04);
        }

        .c3-btn-ghost:hover {
          background: #fff;
        }

        .c3-hero {
          padding: 72px 0 30px;
        }

        .c3-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 20px;
          align-items: stretch;
        }

        .c3-glass {
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: var(--shadow);
          border-radius: 36px;
          backdrop-filter: blur(16px);
        }

        .c3-hero-copy {
          padding: 36px;
        }

        .c3-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--muted);
          font-size: 1.1rem !important;
          margin-bottom: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
        }

        .c3-kicker b {
          color: var(--ink);
        }

        .c3-hero h1 {
          margin: 0 0 14px;
          font-size: clamp(3.6rem, 7vw, 6.2rem) !important;
          letter-spacing: -0.055em;
          line-height: 0.96;
          font-weight: 700;
        }

        .c3-hero p {
          margin: 0;
          max-width: 64ch;
          color: var(--muted);
          font-size: clamp(1.15rem, 2.2vw, 1.45rem) !important;
          line-height: 1.6;
          letter-spacing: -0.01em;
        }

        .c3-actions {
          margin-top: 24px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .c3-micro {
          margin-top: 12px;
          color: var(--muted);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .c3-hero-visual {
          min-height: 560px;
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2)),
            url('https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80') center/cover no-repeat;
          box-shadow: var(--shadow);
        }

        .c3-hero-overlay {
          position: absolute;
          inset: auto 18px 18px 18px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 24px;
          padding: 18px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.1);
        }

        .c3-hero-overlay h3 {
          margin: 0 0 8px;
          font-size: 1.35rem !important;
          letter-spacing: -0.02em;
          font-weight: 700;
        }

        .c3-hero-overlay p {
          margin: 0;
          color: var(--muted);
          line-height: 1.55;
          font-size: 0.95rem;
        }

        .c3-section {
          padding: 68px 0;
        }

        .c3-soft {
          background: #fff;
          border-top: 1px solid rgba(17, 17, 17, 0.05);
          border-bottom: 1px solid rgba(17, 17, 17, 0.05);
        }

        .c3-title {
          text-align: center;
          margin: 0 0 12px;
          font-size: clamp(3.6rem, 6vw, 5.2rem) !important;
          letter-spacing: -0.045em;
          line-height: 1.02;
          font-weight: 700;
        }

        .c3-lead {
          text-align: center;
          color: var(--muted);
          max-width: 74ch;
          margin: 0 auto;
          line-height: 1.65;
          font-size: 1.75rem !important;
          letter-spacing: -0.01em;
        }

        .c3-grid,
        .c3-grid2 {
          display: grid;
          gap: 16px;
          margin-top: 24px;
        }

        .c3-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .c3-grid2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .c3-card {
          background: var(--card);
          border: 1px solid rgba(17, 17, 17, 0.06);
          border-radius: var(--radius);
          padding: 22px;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.05);
        }

        .c3-card h3 {
          margin: 10px 0 8px;
          font-size: 1.35rem !important;
          letter-spacing: -0.02em;
          font-weight: 700;
        }

        .c3-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .c3-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.06);
          border: 1px solid rgba(17, 17, 17, 0.06);
          color: #111;
          font-weight: 700;
          font-size: 1.08rem !important;
          letter-spacing: -0.01em;
        }

        .c3-list {
          margin: 14px 0 0;
          padding: 0;
          list-style: none;
        }

        .c3-list li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 10px 0;
          border-top: 1px dashed rgba(17, 17, 17, 0.08);
          color: var(--muted);
          line-height: 1.5;
        }

        .c3-list li:first-child {
          border-top: none;
        }

        .c3-dot {
          width: 10px;
          height: 10px;
          margin-top: 7px;
          border-radius: 999px;
          background: #111;
          flex: 0 0 10px;
        }

        .c3-compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 26px;
        }

        .c3-compare-card {
          border-radius: 32px;
          padding: 26px;
          background: #fff;
          border: 1px solid rgba(17, 17, 17, 0.06);
          box-shadow: 0 14px 45px rgba(0, 0, 0, 0.05);
        }

        .c3-compare-card h3 {
          margin: 0 0 14px;
          font-size: 1.6rem !important;
          letter-spacing: -0.03em;
        }

        .c3-compare-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
          font-size: 1.05rem;
        }

        .c3-compare-card.bad {
          background: linear-gradient(180deg, #fbfbfc, #f3f3f5);
        }

        .c3-compare-card.good {
          background: linear-gradient(180deg, #fff, #f7f7f8);
        }

        .c3-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .c3-step {
          background: var(--card);
          border: 1px solid rgba(17, 17, 17, 0.06);
          border-radius: var(--radius);
          padding: 22px;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.05);
        }

        .c3-num {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: rgba(17, 17, 17, 0.06);
          border: 1px solid rgba(17, 17, 17, 0.06);
          font-weight: 800;
        }

        .c3-faq {
          max-width: 920px;
          margin: 22px auto 0;
        }

        .c3-faq details {
          border: 1px solid rgba(17, 17, 17, 0.07);
          border-radius: 20px;
          background: #fff;
          padding: 16px 18px;
          margin-bottom: 12px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.04);
        }

        .c3-faq summary {
          cursor: pointer;
          font-weight: 700;
          letter-spacing: -0.01em;
          font-size: 1.1rem;
        }

        .c3-faq p {
          margin: 12px 0 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .c3-sticky {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 12px;
          z-index: 70;
          pointer-events: none;
        }

        .c3-sticky .c3-inner {
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 24px;
        }

        .c3-sticky .c3-bar {
          pointer-events: auto;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(17, 17, 17, 0.06);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          border-radius: 999px;
          padding: 10px;
          box-shadow: var(--shadow);
          flex-wrap: wrap;
        }

        .c3-footer {
          padding: 32px 0 20px;
          background: #fff;
          border-top: 1px solid rgba(17, 17, 17, 0.06);
        }

        .c3-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 24px;
        }

        .c3-footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          color: var(--ink);
        }

        .c3-footer-links {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
        }

        .c3-footer-link {
          color: var(--ink);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .c3-footer-link:hover {
          color: #000;
        }

        .c3-footer-copy {
          color: var(--muted);
          font-size: 1.05rem;
        }

        .c3d-wrap {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
            "Helvetica Neue", Arial, sans-serif;
          color: var(--ink);
          background: transparent;
          line-height: 1.25;
          -webkit-font-smoothing: antialiased;
        }

        .c3d-wrap * {
          box-sizing: border-box;
        }

        .c3d-container {
          max-width: 920px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .c3d-main {
          padding: 12px 0 0;
        }

        .c3d-hero {
          padding: 12px 0 14px;
          text-align: center;
        }

        .c3d-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.8);
          color: var(--muted);
          font-size: 1.05rem !important;
          margin-bottom: 14px;
        }

        .c3d-kicker b {
          color: var(--ink);
        }

        .c3d-hero h1 {
          margin: 0 0 10px;
          font-size: clamp(3.2rem, 6.5vw, 5.5rem) !important;
          letter-spacing: -0.05em;
          line-height: 1.02;
          font-weight: 700;
        }

        .c3d-sub {
          margin: 0 auto;
          color: var(--muted);
          font-size: clamp(1.3rem, 1.8vw, 1.5rem) !important;
          line-height: 1.65;
          max-width: 72ch;
        }

        .c3d-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(17, 17, 17, 0.06);
          border-radius: 32px;
          padding: 22px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(16px);
        }

        .c3d-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(17, 17, 17, 0.06);
          border: 1px solid rgba(17, 17, 17, 0.06);
          color: #111;
          font-weight: 750;
          font-size: 1.05rem;
          margin: 0 auto 10px;
        }

        .c3d-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin: 10px 0 14px;
        }

        .c3d-bar {
          height: 10px;
          flex: 1;
          background: #ededf1;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid var(--line);
        }

        .c3d-bar span {
          display: block;
          height: 100%;
          width: 0%;
          background: linear-gradient(180deg, #1d1d1f, #000);
          transition: width 0.35s ease;
        }

        .c3d-pct {
          color: var(--muted);
          font-size: 0.92rem;
          white-space: nowrap;
        }

        .c3d-q {
          padding: 14px 0;
          border-top: 1px dashed rgba(17, 17, 17, 0.08);
        }

        .c3d-q:first-child {
          border-top: none;
          padding-top: 0;
        }

        .c3d-q.is-hidden,
        .c3d-q.is-locked {
          display: none;
        }

        .c3d-qlabel {
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
          line-height: 1.35;
          text-align: center;
          font-size: 1.35rem !important;
        }

        .c3d-qhelp {
          margin: -4px auto 10px;
          color: var(--muted);
          font-size: 1.05rem;
          line-height: 1.65;
          text-align: center;
          max-width: 74ch;
        }

        .c3d-options {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 780px;
          margin: 0 auto;
        }

        .c3d-opt {
          position: relative;
          border: 1px solid rgba(17, 17, 17, 0.08);
          border-radius: 20px;
          background: #fff;
          padding: 14px 14px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease,
            background 0.15s ease;
          user-select: none;
          min-height: 58px;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.03);
        }

        .c3d-opt:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
          border-color: rgba(17, 17, 17, 0.18);
        }

        .c3d-dot {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2px solid #d2d2d7;
          margin-top: 2px;
          flex: 0 0 18px;
          display: grid;
          place-items: center;
          background: #fff;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .c3d-dot::after {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: transparent;
          transition: background 0.15s ease;
        }

        .c3d-txt {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .c3d-t {
          font-weight: 800;
          letter-spacing: -0.02em;
          font-size: 1.1rem;
        }

        .c3d-d {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.4;
        }

        .c3d-opt.is-on {
          border-color: rgba(17, 17, 17, 0.28);
          background: rgba(17, 17, 17, 0.04);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
        }

        .c3d-opt.is-on .c3d-dot {
          border-color: #111;
          background: rgba(17, 17, 17, 0.06);
        }

        .c3d-opt.is-on .c3d-dot::after {
          background: #111;
        }

        .c3d-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 560px;
          margin: 0 auto;
        }

        .c3d-small {
          color: var(--muted);
          font-size: 0.9rem;
          text-align: left;
        }

        .c3d-wrap input[type="text"],
        .c3d-wrap input[type="tel"] {
          width: 100%;
          padding: 13px 14px;
          border-radius: 16px;
          border: 1px solid rgba(17, 17, 17, 0.08);
          background: #fff;
          font-size: 1rem;
          outline: none;
          transition: box-shadow 0.15s ease, border-color 0.15s ease;
        }

        .c3d-wrap input:focus {
          border-color: rgba(17, 17, 17, 0.22);
          box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.06);
        }

        .c3d-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
          align-items: center;
          justify-content: center;
        }

        .c3d-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 999px;
          font-weight: 800;
          border: 1px solid transparent;
          text-decoration: none !important;
          cursor: pointer;
          user-select: none;
          transition: transform 0.15s ease, filter 0.15s ease, background 0.15s ease;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .c3d-btn:active {
          transform: translateY(1px) scale(0.99);
        }

        .c3d-primary {
          background: linear-gradient(180deg, #1d1d1f, #000);
          color: #fff;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
        }

        .c3d-primary:hover {
          filter: brightness(1.03);
          color: #fff;
        }

        .c3d-btn[disabled] {
          opacity: 0.55;
          cursor: not-allowed;
          filter: saturate(0.7);
          box-shadow: none;
        }

        .c3d-micro {
          color: var(--muted);
          font-size: 0.92rem;
          line-height: 1.6;
          margin: 10px auto 0;
          text-align: center;
          max-width: 84ch;
        }

        .c3d-error {
          display: none;
          margin-top: 12px;
          border: 1px solid rgba(255, 59, 48, 0.2);
          background: rgba(255, 59, 48, 0.06);
          border-radius: 16px;
          padding: 12px 12px;
          color: #8a1f1b;
          line-height: 1.45;
          font-size: 0.95rem;
          text-align: center;
        }

        .c3-reveal,
        .c3d-reveal {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .c3-reveal.is-in,
        .c3d-reveal.is-in {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1020px) {
          .c3-hero-grid {
            grid-template-columns: 1fr;
          }

          .c3-grid,
          .c3-steps,
          .c3-compare {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .c3-grid,
          .c3-grid2,
          .c3-steps,
          .c3d-options {
            grid-template-columns: 1fr;
          }

          .c3-hero {
            padding-top: 52px;
          }

          .c3-navlinks {
            display: none;
          }

          .c3-hero-copy {
            padding: 24px;
          }

          .c3-hero-visual {
            min-height: 420px;
          }

          .c3-sticky {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
