export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail: string;
  video?: string;
  images: string[];
  tags: string[];
  category: "web" | "mobile" | "oss" | "other";
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: number;
  color: string;
  challenge: string;
  solution: string;
}

export const projects: Project[] = [
  {
    slug: "aurora-dashboard",
    title: "Aurora Dashboard",
    tagline: "Real-time analytics with a cinematic dark UI",
    description:
      "A comprehensive SaaS analytics platform built for enterprise teams. Features real-time data streaming, customizable widget grids, advanced charting, and multi-tenant architecture.",
    thumbnail: "/images/projects/aurora-dashboard/thumb.jpg",
    video: "/videos/aurora-dashboard/preview.mp4",
    images: [
      "/images/projects/aurora-dashboard/1.jpg",
      "/images/projects/aurora-dashboard/2.jpg",
      "/images/projects/aurora-dashboard/3.jpg",
    ],
    tags: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Recharts", "WebSockets"],
    category: "web",
    liveUrl: "https://aurora-demo.dev",
    githubUrl: "https://github.com/dev/aurora-dashboard",
    featured: true,
    year: 2024,
    color: "#6366f1",
    challenge:
      "Building a dashboard that handles 50k+ real-time events per second without UI jank, while remaining accessible and performant on lower-end devices.",
    solution:
      "Implemented a custom virtualized grid renderer, WebSocket connection pooling, and a web worker for data aggregation — keeping the main thread free for animations.",
  },
  {
    slug: "luminary-app",
    title: "Luminary",
    tagline: "Cross-platform mobile journaling with AI insights",
    description:
      "A mindful journaling app for iOS and Android. Uses on-device ML to surface emotional patterns, streaks, and personalized writing prompts. 50,000+ downloads in 3 months.",
    thumbnail: "/images/projects/luminary-app/thumb.jpg",
    video: "/videos/luminary-app/preview.mp4",
    images: [
      "/images/projects/luminary-app/1.jpg",
      "/images/projects/luminary-app/2.jpg",
    ],
    tags: ["React Native", "Expo", "TypeScript", "TensorFlow Lite", "SQLite", "Reanimated 3"],
    category: "mobile",
    liveUrl: "https://apps.apple.com",
    githubUrl: "https://github.com/dev/luminary",
    featured: true,
    year: 2024,
    color: "#a855f7",
    challenge:
      "Running ML inference on-device without draining battery, while delivering buttery-smooth 120fps animations on the UI thread.",
    solution:
      "Used TensorFlow Lite with NNAPI delegation, and Reanimated 3's worklet-based animations completely off the JS thread — zero bridge calls in the animation loop.",
  },
  {
    slug: "velox-ui",
    title: "Velox UI",
    tagline: "Open-source component library for dark interfaces",
    description:
      "A headless, themeable component library built for teams who want full design control. 200+ components, full accessibility (WCAG 2.1 AA), dark-first design tokens.",
    thumbnail: "/images/projects/velox-ui/thumb.jpg",
    images: [
      "/images/projects/velox-ui/1.jpg",
      "/images/projects/velox-ui/2.jpg",
    ],
    tags: ["TypeScript", "React", "Radix UI", "CSS Variables", "Storybook", "Vitest"],
    category: "oss",
    liveUrl: "https://velox-ui.dev",
    githubUrl: "https://github.com/dev/velox-ui",
    featured: true,
    year: 2023,
    color: "#ec4899",
    challenge:
      "Creating a component library that feels opinionated enough to be useful out-of-the-box, yet flexible enough to adapt to any brand without forking.",
    solution:
      "Adopted a layered token system (primitive → semantic → component) with CSS custom properties, allowing full theming via a single JSON config file.",
  },
  {
    slug: "forge-cli",
    title: "Forge CLI",
    tagline: "Developer toolchain scaffolder used by 8k+ developers",
    description:
      "A CLI tool that scaffolds production-ready full-stack projects with best practices baked in — auth, CI/CD, testing, Docker, and cloud deployment configs pre-configured.",
    thumbnail: "/images/projects/forge-cli/thumb.jpg",
    images: ["/images/projects/forge-cli/1.jpg"],
    tags: ["Node.js", "TypeScript", "Commander.js", "Inquirer", "Docker", "GitHub Actions"],
    category: "oss",
    liveUrl: "https://www.npmjs.com/package/forge-cli",
    githubUrl: "https://github.com/dev/forge-cli",
    featured: false,
    year: 2023,
    color: "#f59e0b",
    challenge:
      "Making a CLI that works equally well for solo devs and enterprise teams, while keeping generated code maintainable over 12+ months of use.",
    solution:
      "Built a plugin architecture where each feature (auth, Docker, CI) is a composable module. Users can mix and match without touching the core template.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
