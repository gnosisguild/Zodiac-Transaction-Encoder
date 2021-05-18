import * as React from "react";
import { ethers } from "ethers";

import StackableContainer from "./StackableContainer";

type ABIInputProps = {
  setABI: (parsedABI: ethers.utils.Interface | undefined) => void;
};

const ABIInput = ({ setABI }: ABIInputProps) => {
  const [rawABI, setRawABI] = React.useState("");
  const [ABIError, setABIError] = React.useState(false);

  const parseABI = (rawABI: string) => {
    try {
      const parsedABI = new ethers.utils.Interface(rawABI);
      setABI(parsedABI);
      setABIError(false);
    } catch (error) {
      console.log("ABI parsing error: ", error);
      setABIError(true);
      setABI(undefined);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedVal = e.clipboardData.getData("text");
    parseABI(pastedVal);
  };

  const handleBlur = () => {
    parseABI(rawABI);
  };

  return (
    <StackableContainer lessMargin>
      <StackableContainer lessMargin lessPadding lessRadius>
        <label htmlFor="ABI-input">Paste in ABI JSON here</label>
        <textarea
          id="ABI-input"
          value={rawABI}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setRawABI(e.target.value)
          }
          onPaste={handlePaste}
          onBlur={handleBlur}
        />
      </StackableContainer>
      {ABIError && (
        <StackableContainer lessMargin lessPadding lessRadius>
          <div className="error">
            <p>
              That ABI doesn't seem quite right. Is the JSON malformed?{" "}
              <a href="https://etherscan.io/address/0x1c511d88ba898b4D9cd9113D13B9c360a02Fcea1/#code">
                View an example ABI here
              </a>
              .
            </p>
          </div>
        </StackableContainer>
      )}
    </StackableContainer>
  );
};

export default ABIInput;
