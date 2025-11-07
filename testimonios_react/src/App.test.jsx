import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest"; 
import App from "./App";

// Mock de datos
vi.mock("./data", () => ({
  default: [
    { nombre: "A", cargo: "Dev", texto: "Texto A", foto: "a.jpg" },
    { nombre: "B", cargo: "Designer", texto: "Texto B", foto: "b.jpg" },
    { nombre: "C", cargo: "PM", texto: "Texto C", foto: "c.jpg" },
  ],
}));

// simulación de paso de tiempo (fake timers)
vi.useFakeTimers();

describe("App component", () => {
  // Verifica que el primer testimonio (nombre: "A") se muestre al inicio
  test("muestra el primer testimonio por defecto", () => {
    render(<App />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  test("avanza al siguiente testimonio al hacer clic en siguiente", () => {
    render(<App />);
    // Simula un clic en el botón con etiqueta accesible "Siguiente"
    fireEvent.click(screen.getByLabelText("Siguiente"));
    // Comprueba que el testimonio mostrado ahora sea "B"
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  test("retrocede al testimonio anterior al hacer clic en anterior", () => {
    render(<App />);
    // Simula un clic en el botón con etiqueta accesible "Anterior"
    fireEvent.click(screen.getByLabelText("Anterior"));
    // Comprueba que, al retroceder desde el primero, se muestre el último ("C")
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  test("cambia automáticamente cada 5 segundos", () => {
    render(<App />);
    act(() => {
      // Simula el paso de 5 segundos en el tiempo controlado por los fake timers
      vi.advanceTimersByTime(5000);
    });
    // Después de 5 segundos, debería mostrarse el siguiente testimonio ("B")
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  test("random selecciona un índice distinto al actual (mockeando Math.random)", () => {
    const originalRandom = Math.random;
    Math.random = () => 0.9; // Forzar valor para controlar el resultado

    render(<App />);
    // Simula clic en el botón con etiqueta accesible "Aleatorio"
    fireEvent.click(screen.getByLabelText("Aleatorio"));
    // Según el mock forzado, debería seleccionar el testimonio "C"
    expect(screen.getByText("C")).toBeInTheDocument();

    Math.random = originalRandom; // Restaurar
  });
});
