import { ethers } from "ethers";
import { useState } from "react";

import ABIFunctionRenderer from "../components/ABIFunctionRenderer";
import ABIFunctionSelect from "../components/ABIFunctionSelect";
import ABIInput from "../components/ABIInput";
import Layout from "../components/Layout";
import StackableContainer from "../components/StackableContainer";

const IndexPage = () => {
  const [parsedABI, setParsedABI] =
    useState<ethers.utils.Interface | undefined>(undefined);

  const [selectedABIFunction, selectABIFunction] =
    useState<string | undefined>(undefined);

  const handleNewAbi = (parsedABI: ethers.utils.Interface | undefined) => {
    selectABIFunction(undefined);
    setParsedABI(parsedABI);
  };

  return (
    <Layout title="ABI Explorer">
      <StackableContainer>
        <h1>ABI Function Encoder</h1>
      </StackableContainer>
      <ABIInput setABI={handleNewAbi} />
      {parsedABI && (
        <ABIFunctionSelect ABI={parsedABI} setFunction={selectABIFunction} />
      )}
      {parsedABI && selectedABIFunction && (
        <ABIFunctionRenderer
          ABI={parsedABI}
          ABIFunction={parsedABI.functions[selectedABIFunction]}
        />
      )}
      <style jsx>{`
        h1 {
        }
      `}</style>
    </Layout>
  );
};

export default IndexPage;
