export type Service = { title: string; description: string; image?: string };

// Single source of truth for the About page services section and the footer list.
export const services: Service[] = [
  {
    title: "Software Development",
    description: "Off-the-shelf tools make every business look the same. Yours shouldn't.",
    image: "/services/Coding in Cyberpunk Style.png",
  },
  {
    title: "AI Solutions",
    description: "Businesses using AI are already moving faster. This is how you catch up, then pull ahead.",
    image: "/services/Futuristic Portrait of a Young Woman.png",
  },
  {
    title: "Business Automation",
    description: "Every hour spent on repeat tasks is an hour your competitors spend growing.",
    image: "/services/Teamwork in Action.png",
  },
  {
    title: "Technical Consulting",
    description: "The costliest mistake is building the wrong thing. Get the right plan first.",
    image: "/services/Flowchart Creation.png",
  },
  {
    title: "API & System Integration",
    description: "Stop copying data between apps. Make your tools finally talk to each other.",
    image: "/services/Data Visualization Display.png",
  },
];
