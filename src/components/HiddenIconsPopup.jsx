import { useState } from 'react';
import { playOSSound } from '../utils/sound';

export default function HiddenIconsPopup({ visible, triggerNotif, nightLight, setNightLight }) {
  const [bluetooth, setBluetooth] = useState(true);
  const [location, setLocation] = useState(true);
  const [focusAssist, setFocusAssist] = useState(false);
  const [hotspot, setHotspot] = useState(false);
  const [batterySaver, setBatterySaver] = useState(false);

  const toggleFeature = (name, val, setVal) => {
    const newVal = !val;
    setVal(newVal);
    triggerNotif(`<i class="fa-brands fa-bluetooth-b"></i>`, name, `${name} is now ${newVal ? 'enabled' : 'disabled'}.`);
  };

  const toggleNightLight = () => {
    const newVal = !nightLight;
    setNightLight(newVal);
    triggerNotif('<i class="fa-solid fa-moon"></i>', 'Night Light', `Night light is now ${newVal ? 'enabled' : 'disabled'}.`);
  };

  return (
    <div id="hidden-icons-popup" className={visible ? 'visible' : ''}>
      <div className="hidden-icons-grid">
        <div
          className={`hidden-icon-btn${bluetooth ? ' active' : ''}`}
          onClick={() => {
            playOSSound('click');
            toggleFeature('Bluetooth', bluetooth, setBluetooth);
          }}
          title="Bluetooth"
        >
          <i className="fa-brands fa-bluetooth-b"></i>
        </div>
        <div
          className={`hidden-icon-btn${nightLight ? ' active' : ''}`}
          onClick={() => {
            playOSSound('click');
            toggleNightLight();
          }}
          title="Night Light"
        >
          <i className="fa-solid fa-moon"></i>
        </div>
        <div
          className={`hidden-icon-btn${location ? ' active' : ''}`}
          onClick={() => {
            playOSSound('click');
            toggleFeature('Location', location, setLocation);
          }}
          title="Location"
        >
          <i className="fa-solid fa-location-dot"></i>
        </div>
        <div
          className={`hidden-icon-btn${focusAssist ? ' active' : ''}`}
          onClick={() => {
            playOSSound('click');
            toggleFeature('Focus Assist', focusAssist, setFocusAssist);
          }}
          title="Focus Assist"
        >
          <i className="fa-solid fa-bell-slash"></i>
        </div>
        <div
          className={`hidden-icon-btn${hotspot ? ' active' : ''}`}
          onClick={() => {
            playOSSound('click');
            toggleFeature('Mobile Hotspot', hotspot, setHotspot);
          }}
          title="Mobile Hotspot"
        >
          <i className="fa-solid fa-satellite-dish"></i>
        </div>
        <div
          className={`hidden-icon-btn${batterySaver ? ' active' : ''}`}
          onClick={() => {
            playOSSound('click');
            toggleFeature('Battery Saver', batterySaver, setBatterySaver);
          }}
          title="Battery Saver"
        >
          <i className="fa-solid fa-leaf"></i>
        </div>
      </div>
    </div>
  );
}
