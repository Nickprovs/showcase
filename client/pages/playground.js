import Layout from "../components/layout";
import Select from "../components/common/select";
import Datalist from "../components/common/datalist";
import TestForm from "../components/testForm";

export default function Playground() {
  return (
    <Layout>
      <div>
        <div style={{ padding: "5px" }}>
          <h1>Playground</h1>

          {/* Form Controls */}
          <h2>Test Form</h2>
          <TestForm />
        </div>
      </div>
    </Layout>
  );
}
