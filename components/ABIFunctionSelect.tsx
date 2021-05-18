import * as React from "react";
import { ethers } from "ethers";
import Select from "react-select";

import StackableContainer from "./StackableContainer";

type ABIFunctionSelectProps = {
  ABI: ethers.utils.Interface;
  setFunction: React.Dispatch<React.SetStateAction<string | undefined>>;
};

interface ThemeSpacing {
  baseUnit: number;
  controlHeight: number;
  menuGutter: number;
}

interface Theme {
  borderRadius: number;
  colors: { [key: string]: string };
  spacing: ThemeSpacing;
}

const ABIFunctionSelect = ({ ABI, setFunction }: ABIFunctionSelectProps) => {
  const createOptions = (abi: ethers.utils.Interface) => {
    const keys = Object.keys(abi.functions);
    return keys.map((key) => {
      return { value: key, label: abi.functions[key].name };
    });
  };

  const theme = (theme: Theme) => ({
    ...theme,
    borderRadius: "10px",
    colors: {
      ...theme.colors,
      neutral0: "#430086",
      neutral5: "#561A93",
      neutral10: "#69339E",
      neutral20: "#7240A4",
      neutral30: "#8559B0",
      neutral40: "#9873BD",
      neutral50: "#AA8CC8",
      neutral60: "#BDA6D5",
      neutral70: "#C7B3DB",
      neutral80: "#D0BFE0",
      neutral90: "#E3D9ED",
      primary: "white",
      primary75: "#AA8CC8",
      primary50: "#7240A4",
      primary25: "#561A93",
    },
  });

  return (
    <StackableContainer lessMargin>
      <StackableContainer lessMargin lessPadding lessRadius>
        <label htmlFor="function-select-input">Select function to encode</label>
        <Select
          theme={theme}
          options={createOptions(ABI)}
          onChange={(selected) => {
            setFunction(selected ? selected.value : undefined);
          }}
          name="function-select"
          inputId="function-select-input"
        />
      </StackableContainer>
    </StackableContainer>
  );
};

export default ABIFunctionSelect;
