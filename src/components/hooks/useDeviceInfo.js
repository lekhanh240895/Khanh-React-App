import React, { useState, useEffect } from "react";
import calculateDeviceInfo from "../../services/calculateDeviceInfo";

export default function useDeviceInfo() {
  // DeviceInfo Handler
  const [deviceInfo, setDeviceInfo] = useState(
    calculateDeviceInfo(window.innerWidth)
  );

  const onResize = React.useCallback(() => {
    const newDeviceInfo = calculateDeviceInfo(window.innerWidth);

    if (deviceInfo.device !== newDeviceInfo.device) {
      setDeviceInfo(newDeviceInfo);
    }
  }, [deviceInfo]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [deviceInfo, onResize]);

  return deviceInfo;
}
