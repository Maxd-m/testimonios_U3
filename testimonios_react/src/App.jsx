import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Testimonial from './components/Testimonial'
import testimonios from './data'
import Controls from './components/Controls'
import './App.css'

function App() {
  /**
   * Estado que guarda el índice del testimonio actual.
   * Inicialmente comienza en 0 (el primer testimonio del array).
   */
  const [index, setIndex] = useState(0);

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
   */
  const next = () => setIndex((prev) => (prev + 1) % length);
  /**
   * Retrocede al testimonio anterior.
   * Usa módulo (%) y suma `length` para evitar índices negativos.
   */
  const prev = () => setIndex((prev) => (prev - 1) % length);
  /**
   * Selecciona un testimonio aleatorio diferente del actual.
   * Si el número aleatorio coincide con el índice actual, se ajusta al siguiente.
   */
  const random = () => {
    let r = Math.floor(Math.random() * length);
    if (r === index) r = (r + 1) % length;
    setIndex(r);
  };

  /**
   * Efecto que configura la rotación automática de testimonios.
   * Cada 5 segundos, avanza al siguiente.
   * Limpia el intervalo anterior cuando el componente se desmonta o se reinicia.
   */
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
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
      setIndex((i) => (i + 1) % length);
    }, 5000);
  };

  return (
    <main className="app">
      <h1>Testimonios</h1>
      <div className="card-wrapper">
        <Testimonial item={testimonios[index]} />
      </div>

      <Controls
        onPrev={() => handleUserAction(prev)}
        onNext={() => handleUserAction(next)}
        onRandom={() => handleUserAction(random)}
      />

      <p className="counter"> {index + 1}</p>
    </main>
  );
}

export default App
