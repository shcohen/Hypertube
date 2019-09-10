import React from 'react';

const Loading = () => {
  return (
    <svg className="loading" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <g transform="translate(25 50)">
        <circle cx="0" cy="0" r="6" fill="#000000" transform="scale(0.969746 0.969746)">
          <animateTransform attributeName="transform" type="scale" begin="-0.3333333333333333s"
                            calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0"
                            keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="6" fill="#000000" transform="scale(0.848152 0.848152)">
          <animateTransform attributeName="transform" type="scale" begin="-0.16666666666666666s"
                            calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0"
                            keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(75 50)">
        <circle cx="0" cy="0" r="6" fill="#000000" transform="scale(0.395739 0.395739)">
          <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  );
};

export default Loading;