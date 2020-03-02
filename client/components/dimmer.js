import dimmer from "../styles/dimmer.module.css";

export default function Dimmer(props) {
  let on = false;
  on = props.on;

  const onStyle = on ? dimmer.dimmerOn : dimmer.dimmerOff;

  return <div className={dimmer.dimmer + " " + onStyle} />;
}
