import './AcademySections.css';

const programs = [
  {
    age: '12 a 14 años',
    title: 'Exploradores de Matemáticas y Física',
    classes: '2 clases en vivo por semana',
    subjects: [
      ['Matemáticas', 'Aritmética, álgebra básica, geometría y estadística'],
      ['Física', 'Introducción, movimiento, fuerzas y energía'],
    ],
    detail: 'Programa de 4 meses por materia.',
  },
  {
    age: '15 a 17 años',
    title: 'Dominando las Ciencias Exactas',
    classes: '3 clases en vivo por semana, incluido Cálculo',
    subjects: [
      ['Matemáticas', 'Álgebra avanzada, trigonometría, geometría analítica y precálculo'],
      ['Física', 'Mecánica, termodinámica, ondas, electricidad y óptica'],
      ['Cálculo', 'Límites, derivadas, integrales y aplicaciones'],
    ],
    detail: 'Programa de 4 meses por materia. Incluye certificado de finalización con mención en Cálculo.',
  },
];

const included = [
  'Clases en vivo y grabaciones disponibles 24/7',
  'Material descargable: guías, ejercicios y recursos de estudio',
  'Tareas semanales con retroalimentación',
  'Acompañamiento para resolver dudas',
];

function AcademySections() {
  return (
    <>
      <section className="academy-section" id="cursos" aria-labelledby="titulo-catalogo">
        <header className="section-heading">
          <span className="section-eyebrow">CATÁLOGO ACADÉMICO</span>
          <h2 id="titulo-catalogo">Un camino para cada etapa.</h2>
          <p>Programas de ciencias exactas pensados para avanzar con bases sólidas y acompañamiento.</p>
        </header>

        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.age}>
              <span className="program-age">Nivel · {program.age}</span>
              <h3>{program.title}</h3>
              <p className="program-frequency">{program.classes}</p>
              <div className="program-subjects">
                {program.subjects.map(([subject, content]) => (
                  <div className="program-subject" key={subject}>
                    <h4>{subject}</h4>
                    <p>{content}</p>
                  </div>
                ))}
              </div>
              <p className="program-detail">{program.detail}</p>
              <a className="button-primary" href="#contacto">Consultar inscripción <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>

        <ul className="included-list" aria-label="Beneficios académicos incluidos">
          {included.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
        </ul>
      </section>

      <section className="academy-section about-section" id="nosotros" aria-labelledby="titulo-nosotros">
        <header className="section-heading">
          <span className="section-eyebrow">SOBRE LA ACADEMIA</span>
          <h2 id="titulo-nosotros">Aprender ciencias también puede cambiar tu futuro.</h2>
          <p>Fórmula Exacta acompaña a jóvenes para que comprendan las matemáticas y las ciencias con confianza.</p>
        </header>
        <div className="about-grid">
          <article className="about-card">
            <span className="benefit-icon" aria-hidden="true">◎</span>
            <h3>Nuestra misión</h3>
            <p>Empoderar a jóvenes con herramientas matemáticas y científicas para transformar su futuro mediante una educación accesible, innovadora y de calidad.</p>
          </article>
          <article className="about-card">
            <span className="benefit-icon" aria-hidden="true">↗</span>
            <h3>Nuestra visión</h3>
            <p>Ser una academia online de referencia en América Latina, formando pensadores críticos y resolutivos.</p>
          </article>
          <article className="about-card about-values">
            <span className="benefit-icon" aria-hidden="true">✦</span>
            <h3>Lo que nos guía</h3>
            <ul>
              <li>Excelencia académica</li>
              <li>Cercanía y acompañamiento</li>
              <li>Innovación constante</li>
              <li>Compromiso con el progreso</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="academy-section pricing-section" id="precios" aria-labelledby="titulo-precios">
        <header className="section-heading">
          <span className="section-eyebrow">PLANES</span>
          <h2 id="titulo-precios">Elige el ritmo que te conviene.</h2>
          <p>Precios del catálogo actual. Escríbenos para confirmar disponibilidad antes de inscribirte.</p>
        </header>
        <div className="pricing-table-wrap">
          <table className="pricing-table">
            <thead><tr><th scope="col">Plan</th><th scope="col">Nivel 12–14</th><th scope="col">Nivel 15–17</th></tr></thead>
            <tbody>
              <tr><th scope="row">Mensual</th><td>$45 USD/mes</td><td>$60 USD/mes</td></tr>
              <tr><th scope="row">Semestral (5 meses)</th><td>$200 USD</td><td>$270 USD</td></tr>
              <tr><th scope="row">Anual (10 meses)</th><td>$380 USD</td><td>$510 USD</td></tr>
            </tbody>
          </table>
        </div>
        <div className="pricing-notes">
          <div><h3>Incluido en todos los planes</h3><p>Clases en vivo, grabaciones 24/7, materiales de estudio, tareas con seguimiento, atención para dudas y acceso a Microsoft Teams.</p></div>
          <div><h3>Descuentos indicados</h3><p>15% para hermanos y 10% por pago anual anticipado. Consulta condiciones y disponibilidad al contactarnos.</p></div>
        </div>
        <a className="button-primary pricing-cta" href="#contacto">Consultar disponibilidad <span aria-hidden="true">↗</span></a>
      </section>
    </>
  );
}

export default AcademySections;
