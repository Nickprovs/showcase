import dimmer from "../styles/dimmer.module.css";

export default function Dimmer(props) {
  let on = false;
  on = props.on;

  console.log("is dimmer on", on);
  const onStyle = on ? dimmer.dimmerOn : dimmer.dimmerOff;

  return <div className={dimmer.dimmer + " " + onStyle} />;
}
