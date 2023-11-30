"use client";
import React, { useState } from "react";
import PongAnimation from "/Users/yamzil/Desktop/ft_transcendence/frontend/public/img/PongAnimation.json";
import Lottie from "lottie-react";

const PopupRandom = () => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="fixed flex items-center justify-center z-50">
        <div className="w-fit h-fit bg-background p-4">
          <button type="button" className="text-white w-4 h-4 float-right">
            &times;
          </button>
          <div className="flex flex-col justify-center items-center modal-body gap-5">
            <h1 className="text-text font-bold text-2xl not-italic font-sans">
              Hold on
            </h1>
            <p className="text-text text-lg font-normal font-sans">
              we’re trying to find you an opponent...
            </p>
            <Lottie animationData={PongAnimation} />
            <button className="w-64 justify-center text-white py-4 items-center rounded-3xl border-white border">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupRandom;
