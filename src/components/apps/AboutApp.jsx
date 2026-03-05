export default function AboutApp() {
  return (
    <div className="window-body">
      <div className="about-header">
        <div className="avatar"><i className="fa-solid fa-user-astronaut"></i></div>
        <div className="about-meta">
          <h1>Madhav Chandok</h1>
          <div className="role">Cloud &amp; Backend Engineer</div>
          <div className="status-badge">
            <div className="status-dot"></div>Available for work
          </div>
        </div>
      </div>
      <div className="about-body">
        <p>I build <strong>scalable backend systems</strong> and <strong>cloud-native integrations</strong> that turn complex
          business workflows into reliable, high-performance services.</p>
        <p>My primary focus lies in <strong>API-first architecture</strong> and <strong>distributed systems on Microsoft Azure</strong>.
          I work across both the <strong>.NET and Python ecosystems</strong>, choosing technologies based on
          performance, maintainability, and long-term scalability.
        </p>
        <p>With hands-on experience in production deployments, CI/CD automation, secure
          authentication, and asynchronous processing, I approach engineering as a
          discipline of <strong>designing systems — not just writing code</strong>.</p>
        <p>I am driven by the challenge of solving real-world problems through clean
          architecture, observable infrastructure, and efficient data flow.</p>
        <p></p>

        <p>Based in <strong>New Delhi, India</strong> · Open to remote worldwide 🌍</p>
      </div>
    </div>
  );
}
