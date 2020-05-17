// import Layout from "../../../components/layout";
// import withAuthAsync from "../../../components/common/withAuthAsync";
// import Form from "../../../components/common/form";
// import CustomJoi from "../../../misc/customJoi";
// import Head from "next/head";
// import { toast, cssTransition } from "react-toastify";
// import Router from "next/router";
// import RouterUtilities from "../../../util/routerUtilities";
// import StringUtilities from "../../../util/stringUtilities";
// import { updateFeaturedPrimaryAsync, getFeaturedPrimaryAsync } from "../../../services/featuredService";

// class Primary extends Form {
//   static async getInitialProps(context) {
//     const { id } = context.query;

//     //Get the blog
//     let data = null;
//     try {
//       const primaryRes = await getFeaturedPrimaryAsync();
//       data = await primaryRes.json();
//     } catch (ex) {
//       data = null;
//     }

//     return { primary: data.primary };
//   }

//   constructor() {
//     super();

//     this.state.data = { markup: "" };
//     this.state.errors = {};
//   }

//   async componentDidMount() {
//     const { primary } = this.props;
//     if (!primary) {
//       toast.error("Couldn't get primary featured content.. Redirecting back.", { autoClose: 1500 });
//       await RouterUtilities.routeInternalWithDelayAsync("/index", 2000);
//       return;
//     }
//     this.getStateDataFromPrimary(primary);
//   }

//   getStateDataFromPrimary(primary) {
//     console.log("hello", primary.markup);
//     this.setState({
//       data: {
//         markup: primary.markup,
//       },
//     });
//   }

//   schema = CustomJoi.object({
//     markup: CustomJoi.string().min(10).required(),
//   });

//   getPrimaryFromPassingState() {
//     let primary = { ...this.state.data };
//     return primary;
//   }

//   doSubmit = async () => {
//     let primary = this.getPrimaryFromPassingState();

//     let res = null;
//     //Try and post the new category
//     try {
//       res = await updateFeaturedPrimaryAsync(primary);
//     } catch (ex) {
//       let errorMessage = `Error: ${ex}`;
//       console.log(errorMessage);
//       toast.error(errorMessage);
//       return;
//     }
//     if (!res.ok) {
//       let body = "";
//       //TODO: Parse Text OR JSON
//       body = await res.text();
//       let errorMessage = `Error: ${res.status} - ${body}`;
//       console.log(errorMessage);
//       toast.error(errorMessage);
//       return;
//     }

//     //TODO: Disallow posting duplicate category at server level.
//     Router.push("/index");
//   };

//   render() {
//     let { user } = this.props;
//     return (
//       <div>
//         <Head>
//           <script key="tinyMCE" type="text/javascript" src="/static/scripts/tinymce/tinymce.min.js"></script>
//         </Head>
//         <Layout user={user}>
//           <div className="standardPadding">
//             <form onSubmit={this.handleSubmit}>
//               {this.renderHtmlEditor("markup", "MARKUP")}
//               {this.renderButton("UPDATE")}
//             </form>
//           </div>
//         </Layout>
//       </div>
//     );
//   }
// }

// export default withAuthAsync(Primary, true);
