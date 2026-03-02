export default function ContactApp() {
  const links = [
    {
      bg: 'rgba(233,69,96,.15)',
      icon: 'fa-solid fa-envelope',
      text: 'madhav@example.com',
      sub: 'Preferred for project inquiries',
    },
    {
      bg: 'rgba(83,52,131,.20)',
      icon: 'fa-brands fa-linkedin-in',
      text: 'linkedin.com/in/madhavchandok',
      sub: 'Professional network',
    },
    {
      bg: 'rgba(255,255,255,.06)',
      icon: 'fa-brands fa-github',
      text: 'github.com/madhavchandok',
      sub: 'Code & open source',
    },
    {
      bg: 'rgba(0,180,255,.10)',
      icon: 'fa-brands fa-twitter',
      text: '@madhav_builds',
      sub: 'Thoughts & updates',
    },
  ];

  return (
    <div className="window-body">
      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
        Let's build something great 👇
      </p>
      <div className="contact-links">
        {links.map((link, i) => (
          <div className="contact-link" key={i}>
            <div className="contact-icon" style={{ background: link.bg }}>
              <i className={link.icon}></i>
            </div>
            <div className="contact-text">
              {link.text}
              <small>{link.sub}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
