import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import  { AppLayout } from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";


export default function TokenTopup(props) {

  console.log("TokenTopup Props: ", props);

  const handleClick = async () => {
    await fetch('/api/addToken', {
      method: 'POST',
    });
  }

  return (
    <div>
      <h1>This is the token topup page</h1>
      <button onClick={handleClick} className="btn">
        Add 10 tokens
      </button>
    </div>
  );
}


TokenTopup.getLayout = function getLayout(page, pageProps) {
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