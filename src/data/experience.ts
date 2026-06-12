export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
  type: "full-time" | "freelance" | "contract";
  location: string;
}

export const experiences: Experience[] = [
  {
    company: "Vercel",
    role: "Senior Frontend Engineer",
    period: "2023 — Present",
    description:
      "Leading UI infrastructure for Next.js developer experience tooling. Built the Turbopack HMR overlay, contributed to the App Router visual editor, and drove performance improvements that reduced build times by 40% across the platform.",
    tech: ["Next.js", "TypeScript", "Rust", "React", "Tailwind CSS", "Turborepo"],
    type: "full-time",
    location: "Remote (San Francisco, CA)",
  },
  {
    company: "Linear",
    role: "Full-Stack Engineer",
    period: "2021 — 2023",
    description:
      "Core product team member building the project management UI that serves 50k+ engineering teams. Owned the roadmap view, keyboard shortcuts system, and real-time collaborative editing — reducing P95 interaction latency from 320ms to 45ms.",
    tech: ["React", "TypeScript", "GraphQL", "Node.js", "PostgreSQL", "WebSockets"],
    type: "full-time",
    location: "Remote (San Francisco, CA)",
  },
  {
    company: "Self-Employed",
    role: "Freelance Product Engineer",
    period: "2019 — 2021",
    description:
      "Designed and engineered 15+ digital products for VC-backed startups across fintech, edtech, and productivity verticals. Average client NPS of 82. Built two products that reached acquisition within 18 months of launch.",
    tech: ["React", "React Native", "Node.js", "PostgreSQL", "Figma", "AWS"],
    type: "freelance",
    location: "Worldwide",
  },
];

export const stats = [
  { label: "Years of Experience", value: 6, suffix: "+" },
  { label: "Projects Shipped", value: 47, suffix: "+" },
  { label: "Open Source Stars", value: 12, suffix: "k" },
  { label: "Cups of Coffee", value: 3847, suffix: "" },
];
