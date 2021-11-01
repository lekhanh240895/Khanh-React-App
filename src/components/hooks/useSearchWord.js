import React from "react";

//Custom Hook
export const usePersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  const isMounted = React.useRef(false);
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
};
