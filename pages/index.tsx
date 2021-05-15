import Link from "next/link";
import { useState } from "react";

import ABIInput from "../components/ABIInput";
import Layout from "../components/Layout";

const IndexPage = () => {
  const [parsedABI, setParsedABI] = useState("");
  return (
    <Layout title="ABI Explorer">
      <h1>Explore an ABI</h1>
      <ABIInput setABI={setParsedABI} />
      <style jsx>{`
        h1 {
          color: red;
        }
      `}</style>
    </Layout>
  );
};

export default IndexPage;
