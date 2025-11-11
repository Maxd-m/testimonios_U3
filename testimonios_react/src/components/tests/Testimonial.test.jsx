import { render, screen } from "@testing-library/react";
import Testimonial from "../Testimonial"; // ubicar correctamente el componente
describe("Componente Testimonial", () => {
  test("muestra correctamente los datos del testimonio", () => {
    const mockData = {
      nombre: "Juan Pérez",
      cargo: "Desarrollador Frontend",
      texto: "React me ayudó a mejorar la estructura de mis proyectos.",
      foto: "juan.jpg",
    };
    // IMPORTANTE: pasar item={mockData} porque el componente espera prop 'item'
    render(<Testimonial item={mockData} />);
    // verificaciones
    expect(screen.getByText(mockData.nombre)).toBeInTheDocument();
    expect(screen.getByText(mockData.cargo)).toBeInTheDocument();
    expect(screen.getByText(mockData.texto)).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockData.foto);
    expect(img).toHaveAttribute("alt", `Foto de ${mockData.nombre}`);
  });
});
