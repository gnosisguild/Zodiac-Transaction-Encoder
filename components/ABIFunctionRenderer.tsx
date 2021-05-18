import * as React from "react";
import { ethers } from "ethers";
import { CopyToClipboard } from "react-copy-to-clipboard";

import StackableContainer from "./StackableContainer";

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
  const [encodeError, setEncodeError] = React.useState<string>("");

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
      setEncodeError("");
      setCallData(nextState);
    } catch (error) {
      // show error if every field has some value
      if (inputVals.filter((input) => input.value.length == 0).length == 0) {
        setEncodeError("Invalid or not enough data to generate call data");
      }
      setCallData("");
    }
  }, [inputVals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = inputVals.map((input) =>
      input.name === e.target.name ? { ...input, value: e.target.value } : input
    );
    setInputVals(nextState);
  };

  const makeId = (input: InputVal, i: Number) => {
    return `input-field-${i}-${input.name ? input.name : "generic"}`;
  };

  return (
    <StackableContainer lessMargin>
      {inputVals.length > 0 && (
        <ul>
          {inputVals.map((input, i) => (
            <li key={makeId(input, i)}>
              <StackableContainer lessMargin lessPadding lessRadius>
                <label htmlFor={makeId(input, i)}>
                  {input.name || "Input"} ({input.type})
                </label>
                <input
                  type="text"
                  value={input.value}
                  onChange={handleChange}
                  name={input.name}
                  id={makeId(input, i)}
                  data-input-type={input.type}
                />
              </StackableContainer>
            </li>
          ))}
        </ul>
      )}
      <StackableContainer lessMargin lessPadding lessRadius>
        <label>Call Data</label>
        <textarea className="callData" disabled value={callData} />
        <CopyToClipboard text={callData}>
          <button className="copy-button">Copy to clipboard</button>
        </CopyToClipboard>
      </StackableContainer>
      {encodeError && (
        <StackableContainer lessMargin lessPadding lessRadius>
          <div className="error">
            <p>{encodeError}</p>
          </div>
        </StackableContainer>
      )}
      <style jsx>{`
        .callData {
          padding: 1em;
        }
        .callData:focus,
        .callData:hover,
        .callData:active {
          border: 1px solid #7240a4;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          margin-top: 20px;
        }
        li:first-child {
          margin-top: 0;
        }
        .copy-button {
          position: absolute;
          top: 10px;
          right: 15px;
          background: #430086;
          color: white;
          border-radius: 10px;
          padding: 5px 8px;
          border: 1px solid #7240a4;
        }
        .copy-button:hover {
          border: 1px solid #8559b0;
        }
      `}</style>
    </StackableContainer>
  );
};

export default ABIFunctionRenderer;
