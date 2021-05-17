import * as React from "react";
import { ethers } from "ethers";
import { CopyToClipboard } from "react-copy-to-clipboard";

type ABIFunctionRendererProps = {
  ABI: ethers.utils.Interface;
  ABIFunction: ethers.utils.FunctionFragment;
};

type InputVal = {
  name: string;
  type: string;
  value: string;
};

const ABIFunctionRenderer = ({
  ABIFunction,
  ABI,
}: ABIFunctionRendererProps) => {
  const [inputVals, setInputVals] = React.useState<InputVal[]>(
    ABIFunction.inputs.map((input) => {
      return { name: input.name, type: input.type, value: "" };
    })
  );
  const [callData, setCallData] = React.useState<string>("");

  React.useEffect(() => {
    setInputVals(
      ABIFunction.inputs.map((input) => {
        return { name: input.name, type: input.type, value: "" };
      })
    );
  }, [ABIFunction]);

  React.useEffect(() => {
    let nextState = "";
    try {
      nextState = ABI.encodeFunctionData(
        ABIFunction.name,
        inputVals.map((input) => {
          return input.value;
        })
      );

      setCallData(nextState);
    } catch (error) {
      setCallData("");
      console.log("Invalid or not enough data to generate call data");
    }
  }, [inputVals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = inputVals.map((input) =>
      input.name === e.target.name ? { ...input, value: e.target.value } : input
    );
    setInputVals(nextState);
  };

  return (
    <div>
      <ul>
        {inputVals.map((input, i) => (
          <li key={i + input.name}>
            <label>{input.name || "Input"}</label>
            <input
              type="text"
              value={input.value}
              onChange={handleChange}
              name={input.name}
              data-input-type={input.type}
            />
          </li>
        ))}
      </ul>
      <div>
        <h2>Call Data:</h2>
        <div className="callData">{callData}</div>
        <CopyToClipboard text={callData}>
          <button>Copy</button>
        </CopyToClipboard>
      </div>
      <style jsx>{`
        .callData {
          padding: 1em;
          font-family: monospace;
          background: ghostwhite;
        }
      `}</style>
    </div>
  );
};

export default ABIFunctionRenderer;
