import Layout from "../components/layout";
import Select from "../components/common/select";
import Datalist from "../components/common/datalist";

export default function Playground() {
  return (
    <Layout>
      <div style={{ height: "500px" }}>
        <div style={{ padding: "5px" }}>
          <h1>yo</h1>
          <Select text="Hey">
            <option>"Yo"</option>
            <option>"What's"</option>
            <option>"Good"</option>
            <option>"Homie"</option>
          </Select>

          <Datalist style={{ marginTop: "100px" }}>
            <option>"Yo"</option>
            <option>"SUP"</option>
            <option>"DOG"</option>
          </Datalist>
        </div>
      </div>
    </Layout>
  );
}
