import * as React from "react";
import { ethers } from "ethers";
import Select from "react-select";

type ABIFunctionSelectProps = {
  ABI: ethers.utils.Interface;
  setFunction: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ABIFunctionSelect = ({ ABI, setFunction }: ABIFunctionSelectProps) => {
  const createOptions = (abi: ethers.utils.Interface) => {
    const keys = Object.keys(abi.functions);
    return keys.map((key) => {
      return { value: key, label: abi.functions[key].name };
    });
  };

  return (
    <div>
      <label htmlFor="function-select-input">Select function to render</label>
      <Select
        options={createOptions(ABI)}
        onChange={(selected) => {
          setFunction(selected ? selected.value : undefined);
        }}
        name="function-select"
        inputId="function-select-input"
      />
    </div>
  );
};

export default ABIFunctionSelect;
