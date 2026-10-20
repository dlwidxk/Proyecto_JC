// Cada grupo tiene sus materias, una actividad corta y un video para seguir practicando.
// Los horarios son de ejemplo, tal como acordamos, y se muestran en hora de Ecuador.
export const recursosAlumnoPorNivel = {
  '12-14': {
    horario: 'Martes y jueves · 19:00–21:30',
    materias: [
      {
        id: 'matematicas',
        nombre: 'Matemáticas',
        titulo: 'Geometría: teorema de Pitágoras',
        descripcion: 'Aprende a relacionar los lados de un triángulo rectángulo y a reconocer su hipotenusa.',
        practica: 'Desafío rápido: si los catetos miden 6 y 8, ¿cuánto mide la hipotenusa?',
        video: 'Introducción al teorema de Pitágoras',
        videoId: 'fFA2ChUj1HM',
        videoFuente: 'Aula365',
        url: 'https://es.khanacademy.org/math/geometry-home/geometry/hs-geo-trig/v/the-pythagorean-theorem',
      },
      {
        id: 'fisica',
        nombre: 'Física',
        titulo: 'Movimiento y aceleración',
        descripcion: 'Observa cómo cambia la velocidad de un objeto con el paso del tiempo y cómo se representa ese cambio.',
        practica: 'Desafío rápido: una bicicleta pasa de 0 a 6 m/s en 3 segundos. ¿Cuál es su aceleración promedio?',
        video: 'Aceleración',
        videoId: 'R14V5nGiVqM',
        videoFuente: 'Khan Academy en español',
        url: 'https://es.khanacademy.org/science/ap-college-physics-1/xf557a762645cccc5%3Akinematics-and-introduction-to-dynamics/xf557a762645cccc5%3Aposition-acceleration-and-velocity/v/acceleration',
      },
    ],
  },
  '15-17': {
    horario: 'Lunes, miércoles y viernes · 19:00–21:30',
    materias: [
      {
        id: 'matematicas',
        nombre: 'Matemáticas',
        titulo: 'Álgebra: ecuaciones lineales',
        descripcion: 'Practica cómo despejar variables y entender las soluciones de ecuaciones lineales.',
        practica: 'Desafío rápido: resuelve 3x + 5 = 20 y comprueba el resultado sustituyendo x.',
        video: 'Razonar con ecuaciones lineales',
        videoId: 'cFqN7gUgMGc',
        videoFuente: 'Khan Academy en español',
        url: 'https://es.khanacademy.org/math/algebra/x2f8bb11595b61c86%3Asolve-equations-inequalities/x2f8bb11595b61c86%3Alinear-equations-parentheses/v/reasoning-with-linear-equations',
      },
      {
        id: 'fisica',
        nombre: 'Física',
        titulo: 'Mecánica: primera ley de Newton',
        descripcion: 'Explora la inercia y qué ocurre con el movimiento cuando la fuerza neta sobre un objeto es cero.',
        practica: 'Desafío rápido: si la fuerza neta es cero, ¿qué puede pasar con un objeto que ya está en movimiento?',
        video: 'Aplicar la primera ley del movimiento de Newton',
        videoId: 'whq9PjZON0w',
        videoFuente: 'Khan Academy en español',
        url: 'https://es.khanacademy.org/science/physics/forces-newtons-laws/newtons-laws-of-motion/v/newton-s-first-law-of-motion-concepts',
      },
      {
        id: 'calculo',
        nombre: 'Cálculo',
        titulo: 'Derivadas: reglas para polinomios',
        descripcion: 'Conoce reglas básicas de derivación y úsalas para describir cómo cambia una función.',
        practica: 'Desafío rápido: aplica la regla de la potencia para encontrar la derivada de f(x) = x³.',
        video: 'Reglas básicas de las derivadas',
        videoId: 'HKRd4kg0MdE',
        videoFuente: 'Khan Academy en español',
        url: 'https://es.khanacademy.org/math/new-calculus/taking-derivatives-calc/polynomial-functions-differentiation-calc/v/derivative-properties-and-polynomial-derivatives',
      },
    ],
  },
};
