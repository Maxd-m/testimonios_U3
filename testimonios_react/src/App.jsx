import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import Testimonial from "./components/Testimonial";
import testimonios from "./data";
import Controls from "./components/Controls";
import "./App.css";

function App() {
  /**
   * Estado que guarda el índice del testimonio actual.
   * Inicialmente comienza en 0 (el primer testimonio del array).
   */
  const [index, setIndex] = useState(0);

  /**
   * Estado que define la dirección del movimiento en la animación.
   * Se usa para saber si el slide va hacia la derecha (1) o izquierda (-1).
   */
  const [direction, setDirection] = useState(1);

  /**
   * Longitud total del arreglo de testimonios.
   * Se usa para calcular los límites al avanzar o retroceder.
   */
  const length = testimonios.length;

  /**
   * Referencia mutable donde se almacena el identificador del setInterval.
   * Esto permite pausar o reiniciar el autoplay sin causar re-renderizados.
   */
  const autoplayRef = useRef(null);

  /**
   * Avanza al siguiente testimonio.
   * Usa módulo (%) para volver al inicio cuando llega al final del array.
   * También establece la dirección positiva (slide hacia la derecha).
   */
  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % length);
  };

  /**
   * Retrocede al testimonio anterior.
   * Usa módulo (%) y suma `length` para evitar índices negativos.
   * La dirección se establece en -1 (slide hacia la izquierda).
   */
  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + length) % length);
  };

  /**
   * Selecciona un testimonio aleatorio diferente del actual.
   * Si el número aleatorio coincide con el índice actual, se ajusta al siguiente.
   * La dirección se considera positiva (slide hacia la derecha).
   */
  const random = () => {
    let r = Math.floor(Math.random() * length);
    if (r === index) r = (r + 1) % length;
    setDirection(1);
    setIndex(r);
  };

  /**
   * Efecto que configura la rotación automática de testimonios.
   * Cada 5 segundos, avanza al siguiente.
   * Limpia el intervalo anterior cuando el componente se desmonta o se reinicia.
   */
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % length);
    }, 5000);
    // Limpieza al desmontar o reiniciar
    return () => clearInterval(autoplayRef.current);
  }, [length]);

  /**
   * Maneja las acciones del usuario (siguiente, anterior o aleatorio).
   * Detiene el autoplay, ejecuta la acción correspondiente y reinicia el temporizador.
   */
  const handleUserAction = (actionFn) => {
    clearInterval(autoplayRef.current);
    actionFn(); // Ejecuta acción (next, prev o random)

    autoplayRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % length);
    }, 5000);
  };

  /**
   * Variantes de animación para el movimiento de slide.
   * - enter: posición inicial (fuera de pantalla, según la dirección)
   * - center: posición final (visible en el centro)
   * - exit: movimiento de salida hacia el lado opuesto
   */
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300, // entra desde la derecha o izquierda
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300, // sale hacia el lado contrario
      opacity: 0,
    }),
  };

  return (
    <main className="app">
      <h1>Testimonios</h1>

      {/**
       * Contenedor principal del testimonio.
       * Se utiliza AnimatePresence para gestionar la animación entre montajes/desmontajes.
       * motion.div aplica los efectos de transición con base en la dirección.
       */}
      <div className="card-wrapper overflow-hidden relative w-[300px] h-[250px]">
        <AnimatePresence custom={direction}>
          <motion.div
            key={index} // Cada cambio de índice desencadena una nueva animación
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full"
          >
            <Testimonial item={testimonios[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/**
       * Componente que muestra los controles:
       * - Botón anterior
       * - Botón siguiente
       * - Botón aleatorio
       * Cada uno reinicia el temporizador de autoplay.
       */}
      <Controls
        onPrev={() => handleUserAction(prev)}
        onNext={() => handleUserAction(next)}
        onRandom={() => handleUserAction(random)}
      />

      {/**
       * Contador visual del testimonio actual.
       * Muestra el número humano (por eso se suma 1 al índice).
       */}
      <p className="counter">{index + 1}</p>
    </main>
  );
}

export default App;
