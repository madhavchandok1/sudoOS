import { useState, useEffect } from 'react';
import { playOSSound } from '../utils/sound';

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push({ empty: true, d: i });
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
    days.push({ empty: false, d, isToday });
  }
  return days;
}

export default function CalendarPopup({ visible }) {
  const [calDate, setCalDate] = useState(new Date());

  useEffect(() => {
    if (visible) setCalDate(new Date());
  }, [visible]);

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const monthYearStr = new Date(year, month).toLocaleDateString([], { month: 'long', year: 'numeric' });
  const days = buildCalendar(year, month);

  const calNav = (dir) => {
    playOSSound('click');
    setCalDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  return (
    <div id="calendar-popup" className={visible ? 'visible' : ''}>
      <div className="calendar-header">
        <div id="cal-month-year">{monthYearStr}</div>
        <div className="cal-nav">
          <button onClick={() => calNav(-1)}><i className="fa-solid fa-chevron-up"></i></button>
          <button onClick={() => calNav(1)}><i className="fa-solid fa-chevron-down"></i></button>
        </div>
      </div>
      <div className="calendar-days-header">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div id="calendar-grid">
        {days.map((day, i) => (
          <div key={i} className={`cal-day${day.empty ? ' empty' : ''}${day.isToday ? ' active' : ''}`}>
            {day.empty ? '' : day.d}
          </div>
        ))}
      </div>
    </div>
  );
}
