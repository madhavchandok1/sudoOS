export default function SkillsApp() {
  const categories = [
    {
      title: 'Programming',
      skills: [
        { name: 'Python', pct: 90, level: 'Advanced' },
        { name: 'C#', pct: 75, level: 'Intermediate' },
        { name: 'C/C++', pct: 72, level: 'Intermediate' },
        { name: 'Java', pct: 68, level: 'Intermediate' },
      ],
    },
    {
      title: 'Cloud & DevOps',
      skills: [
        { name: 'Azure', pct: 78, level: 'Intermediate' },
        { name: 'Google Cloud', pct: 45, level: 'Beginner' },
        { name: 'Docker', pct: 72, level: 'Intermediate' },
        { name: 'CI/CD', pct: 45, level: 'Beginner' },
      ],
    },
    {
      title: 'Web & API Development',
      skills: [
        { name: 'ASP.NET Web API', pct: 72, level: 'Intermediate' },
        { name: 'ASP.NET MVC', pct: 72, level: 'Intermediate' },
        { name: 'FastAPI', pct: 88, level: 'Advanced' },
        { name: 'Flask', pct: 72, level: 'Intermediate' },
      ],
    },
  ];

  const miscSkills = [
    'SQLite',
    'MongoDB',
    'Microsoft SQL Server',
    'MySQL',
    'ElasticSearch',
    'Visual Studio Code',
    'Cursor',
    'Visual Studio 2022',
    'Postman',
    'Git',
    'GitHub',
    'Swagger',
    'Google Colab',
    'Azure DevOps',
    'PySpark',
    'GraphQL',
    'Graphene',
  ];

  return (
    <div className="window-body">
      <div className="skills-grid">
        {categories.map((cat, ci) => (
          <div
            className={`skill-category${cat.title === 'Web & API Development' ? ' skill-category-wide' : ''}`}
            key={ci}
          >
            <h3>{cat.title}</h3>
            {cat.skills.map((skill, si) => (
              <div className="skill-item" key={si}>
                <div className="skill-name">
                  {skill.name} <span className="skill-pct">{skill.level}</span>
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
      <div style={{ marginTop: '24px' }}>
        <h3>Miscellaneous · Tools &amp; Frameworks</h3>
        <div className="project-tags">
          {miscSkills.map((name) => (
            <span key={name} className="tag">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
