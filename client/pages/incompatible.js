export default function Incompatible() {
  return (
    <div>
      <h1>This browser isn't compatible.</h1>
      <h2>Sorry about that.</h2>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <object style={{ display: "block", width: "35%", overflow: "none" }} type="image/svg+xml" data="/director_sad.svg"></object>
        </div>
      </div>
    </div>
  );
}
