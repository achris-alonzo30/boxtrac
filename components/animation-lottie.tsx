"use client";

import Lottie from "lottie-react";

type AnimationLottieProps = {
    animationPath: any;
    width?: number;
};

export const AnimationLottie = ({ animationPath, width }: AnimationLottieProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: "25%",
    }
  };

  return (
    <Lottie {...defaultOptions} />
  );
};

