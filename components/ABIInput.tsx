import * as React from "react";
import { ethers } from "ethers";

type ABIInputProps = {
  setABI: React.Dispatch<React.SetStateAction<string>>;
};

const ABIInput = ({ setABI }: ABIInputProps) => {
  const [rawABI, setRawABI] = React.useState("");

  const parseABI = (rawABI: string) => {
    try {
      console.log(rawABI);
      const parsedABI = new ethers.utils.Interface(rawABI);

      console.log(parsedABI);
    } catch (error) {
      console.log("uh oh: ", error);
    }
  };

  return (
    <div>
      <textarea value={rawABI} onChange={(e) => setRawABI(e.target.value)} />
    </div>
  );
};

export default ABIInput;
