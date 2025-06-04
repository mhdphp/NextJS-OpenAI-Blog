import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import  { AppLayout } from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";


export default function Success(props) {

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
    </div>
  );
}


Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}


// export const getServerSideProps = withPageAuthRequired (() => {
//     return {
//         props: {},
//     }
// });

export const getServerSideProps = withPageAuthRequired ({
  // This function will run on the server side before rendering the page
  // It will fetch the necessary data and pass it as props
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    return {
      props
    }
  }
});