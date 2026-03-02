export default function SkillsApp() {
  const categories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React / Next.js', pct: 95 },
        { name: 'TypeScript', pct: 90 },
        { name: 'CSS / Animation', pct: 92 },
        { name: 'Vue.js', pct: 75 },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js', pct: 88 },
        { name: 'Python / Django', pct: 82 },
        { name: 'PostgreSQL', pct: 85 },
        { name: 'Docker / DevOps', pct: 70 },
      ],
    },
    {
      title: 'Design',
      skills: [
        { name: 'Figma', pct: 88 },
        { name: 'UI/UX Design', pct: 80 },
      ],
    },
    {
      title: 'Tools',
      skills: [
        { name: 'Git / GitHub', pct: 95 },
        { name: 'AWS / Vercel', pct: 78 },
      ],
    },
  ];

  return (
    <div className="window-body">
      <div className="skills-grid">
        {categories.map((cat, ci) => (
          <div className="skill-category" key={ci}>
            <h3>{cat.title}</h3>
            {cat.skills.map((skill, si) => (
              <div className="skill-item" key={si}>
                <div className="skill-name">
                  {skill.name} <span className="skill-pct">{skill.pct}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{ width: `${skill.pct}%`, '--delay': `${(si + 1) * 0.10}s` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
