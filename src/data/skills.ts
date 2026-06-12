export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "design";
  level: 1 | 2 | 3; // 1=familiar, 2=proficient, 3=expert
}

export const skills: Skill[] = [
  // Languages
  { name: "TypeScript", category: "language", level: 3 },
  { name: "JavaScript", category: "language", level: 3 },
  { name: "Python", category: "language", level: 2 },
  { name: "Rust", category: "language", level: 1 },
  { name: "Go", category: "language", level: 2 },
  { name: "SQL", category: "language", level: 3 },
  { name: "GraphQL", category: "language", level: 2 },
  { name: "HTML5", category: "language", level: 3 },
  { name: "CSS3", category: "language", level: 3 },
  { name: "GLSL", category: "language", level: 1 },

  // Frameworks
  { name: "React", category: "framework", level: 3 },
  { name: "Next.js", category: "framework", level: 3 },
  { name: "React Native", category: "framework", level: 2 },
  { name: "tRPC", category: "framework", level: 3 },
  { name: "Prisma", category: "framework", level: 2 },
  { name: "Three.js", category: "framework", level: 2 },
  { name: "Framer Motion", category: "framework", level: 3 },
  { name: "GSAP", category: "framework", level: 2 },
  { name: "Tailwind CSS", category: "framework", level: 3 },
  { name: "Node.js", category: "framework", level: 3 },
  { name: "Express", category: "framework", level: 2 },
  { name: "Fastify", category: "framework", level: 2 },

  // Tools
  { name: "Git", category: "tool", level: 3 },
  { name: "Docker", category: "tool", level: 2 },
  { name: "Kubernetes", category: "tool", level: 1 },
  { name: "GitHub Actions", category: "tool", level: 2 },
  { name: "Vercel", category: "tool", level: 3 },
  { name: "AWS", category: "tool", level: 2 },
  { name: "PostgreSQL", category: "tool", level: 2 },
  { name: "Redis", category: "tool", level: 2 },
  { name: "Turborepo", category: "tool", level: 2 },
  { name: "Vitest", category: "tool", level: 2 },
  { name: "Playwright", category: "tool", level: 2 },

  // Design
  { name: "Figma", category: "design", level: 3 },
  { name: "Motion Design", category: "design", level: 2 },
  { name: "Typography", category: "design", level: 2 },
  { name: "Design Systems", category: "design", level: 3 },
  { name: "Accessibility", category: "design", level: 2 },
];

export const skillsByCategory = {
  language: skills.filter((s) => s.category === "language"),
  framework: skills.filter((s) => s.category === "framework"),
  tool: skills.filter((s) => s.category === "tool"),
  design: skills.filter((s) => s.category === "design"),
};

export const categoryColors: Record<Skill["category"], string> = {
  language: "#6366f1",
  framework: "#a855f7",
  tool: "#64748b",
  design: "#ec4899",
};

export const levelLabels: Record<Skill["level"], string> = {
  1: "Familiar",
  2: "Proficient",
  3: "Expert",
};
