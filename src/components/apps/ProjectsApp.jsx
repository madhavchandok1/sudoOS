export default function ProjectsApp() {
  const projects = [
    {
      icon: 'fa-solid fa-meteor',
      name: 'NovaDash',
      desc: 'Real-time analytics for SaaS — tracks 50M+ events/day with live charts and anomaly detection.',
      tags: ['React', 'Node.js', 'ClickHouse', 'WebSocket'],
    },
    {
      icon: 'fa-solid fa-robot',
      name: 'Synthex AI',
      desc: 'AI-powered writing assistant with a custom fine-tuned model, serving 12K active users.',
      tags: ['Python', 'PyTorch', 'FastAPI', 'Next.js'],
    },
    {
      icon: 'fa-solid fa-palette',
      name: 'Chroma Design System',
      desc: 'Open-source design system with 80+ accessible components and Figma token integration.',
      tags: ['TypeScript', 'Storybook', 'CSS Variables'],
    },
    {
      icon: 'fa-solid fa-map-location-dot',
      name: 'Wayfarer',
      desc: 'Collaborative travel planning app with real-time itinerary editing for 5K travelers.',
      tags: ['Vue.js', 'Firebase', 'MapBox'],
    },
  ];

  return (
    <div className="window-body">
      {projects.map((p, i) => (
        <div className="project-card" key={i}>
          <h3><i className={p.icon}></i> {p.name}</h3>
          <p>{p.desc}</p>
          <div className="project-tags">
            {p.tags.map((tag, j) => <span className="tag" key={j}>{tag}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
