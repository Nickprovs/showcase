import Layout from "../components/layout";
import Select from "../components/common/select";

export default function Playground() {
  return (
    <Layout>
      <div style={{ height: "500px" }}>
        <div style={{ padding: "5px" }}>
          <Select text="Hey">
            <option>"Yo"</option>
            <option>"What's"</option>
            <option>"Good"</option>
            <option>"Homie"</option>
          </Select>
        </div>
      </div>
    </Layout>
  );
}
