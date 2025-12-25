import React from "react";

const CircularText = () => {
  return (
    <div className="relative w-40 h-40">
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="animate-spin-slow"
      >
        <defs>
          <path
            id="circlePath"
            d="M 100, 100
               m -75, 0
               a 75,75 0 1,1 150,0
               a 75,75 0 1,1 -150,0"
          />
        </defs>
        <text
          fontSize="30"
          fill="#e8e8e8"
          fontFamily="serif"
          letterSpacing="2"
        >
          <textPath
            xlinkHref="#circlePath"
            startOffset="0"
            textLength="471"
          >
             Experience • Fashion • elegant •
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;
