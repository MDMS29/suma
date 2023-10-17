import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({ currentStep }) => {
  const stepPercentage = (currentStep / 3) * 100; 

  return (
    <div className="bg-black flex justify-center items-center">
      <ProgressBar  percent={stepPercentage} className="flex justify-center items-center" >
        <Step>
          {({ accomplished }) => (
            <div
              className={`step-item w-10 h-10 rounded-full flex items-center justify-center  ${
                accomplished
                  ? "bg-primaryYellow"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`step-item w-10 h-10 rounded-full flex items-center justify-center ${
                accomplished
                  ? "bg-primaryYellow"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
          )}
        </Step>
        <Step>
          {({ accomplished }) => (
            <div
              className={`step-item w-10 h-10 rounded-full flex items-center justify-center ${
                accomplished
                  ? "bg-primaryYellow "
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
          )}
        </Step>
      </ProgressBar>
    </div>
  );
};

export default MultiStepProgressBar;
