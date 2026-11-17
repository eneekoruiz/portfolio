import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currículum",
  description: "Currículum de Eneko Ruiz Mollón, ingeniero de software full stack: experiencia, proyectos, habilidades y formación.",
  alternates: { canonical: "/curriculum" },
};

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
