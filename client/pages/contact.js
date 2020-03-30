import Layout from "../components/layout";
import ContactForm from "../components/contactForm";
import withAuthAsync from "../components/common/withAuthAsync";

function Contact(props) {
  let {user} = props;
  return (
    <Layout user={user}>
      <ContactForm />
    </Layout>
  );
}

export default withAuthAsync(Contact);

