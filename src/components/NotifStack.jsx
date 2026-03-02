export default function NotifStack({ notifications, onDismiss }) {
  return (
    <div id="notif-stack">
      {notifications.map(n => (
        <div key={n.id} className={`notif${n.out ? ' out' : ''}`}>
          <div className="notif-header">
            <span className="notif-icon" dangerouslySetInnerHTML={{ __html: n.icon }}></span>
            <span className="notif-title">{n.title}</span>
            <button className="notif-close" onClick={() => onDismiss(n.id)}>✕</button>
          </div>
          <div className="notif-body">{n.body}</div>
        </div>
      ))}
    </div>
  );
}
