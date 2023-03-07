import React, {useState} from 'react';
import { useEffect } from 'react';
import {createContext} from 'react';

interface ImageColors {
  primary: string;
  secondary: string;
}

interface IGradientContextProps {
  mainColors: ImageColors;
  previousColors: ImageColors;
  handleBgMainColors: (colors: ImageColors) => void;
  handleBgPreviousColors: (colors: ImageColors) => void;
}

export const GradientContext = createContext({} as IGradientContextProps);

export const GradientProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [mainColors, setMainColors] = useState<ImageColors>({
    primary: 'transparent',
    secondary: 'transparent',
  });
  const [previousColors, setPreviousColors] = useState<ImageColors>({
    primary: 'transparent',
    secondary: 'transparent',
  });

  const handleBgMainColors = (colors: ImageColors) => setMainColors(colors);
  const handleBgPreviousColors = (colors: ImageColors) =>
    setPreviousColors(colors);

  return (
    <GradientContext.Provider
      value={{
        mainColors,
        previousColors,
        handleBgMainColors,
        handleBgPreviousColors,
      }}>
      {children}
    </GradientContext.Provider>
  );
};
