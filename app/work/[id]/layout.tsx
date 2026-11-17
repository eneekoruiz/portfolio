import type { Metadata } from "next";
import { PROJECTS_CONTENT } from "../../data/projects";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

// Each project gets its own title, description and canonical URL (the page itself is a client component).
export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { id } = await params;
  const project = PROJECTS_CONTENT[id]?.es;
  if (!project) return {};
  const description = project.objective.length > 160 ? `${project.objective.slice(0, 157).trimEnd()}…` : project.objective;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${id}` },
    openGraph: { title: `${project.title} · Eneko Ruiz`, description, url: `/work/${id}` },
  };
}

export default function ProjectLayout({ children }: Props) {
  return children;
}
