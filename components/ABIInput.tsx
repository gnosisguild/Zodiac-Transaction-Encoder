import * as React from "react";
import { ethers } from "ethers";

type ABIInputProps = {
  setABI: React.Dispatch<
    React.SetStateAction<ethers.utils.Interface | undefined>
  >;
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

  const handleBlur = (e: React.FocusEvent) => {
    parseABI(rawABI);
  };

  return (
    <div>
      <textarea
        value={rawABI}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setRawABI(e.target.value)
        }
        onPaste={handlePaste}
        onBlur={handleBlur}
      />
      {ABIError && (
        <div className="error">
          <p>
            That ABI doesn't seem quite right. Is the JSON malformed? To view an
            example ABI{" "}
            <a href="https://etherscan.io/address/0x1c511d88ba898b4D9cd9113D13B9c360a02Fcea1/#code">
              look here.
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ABIInput;
