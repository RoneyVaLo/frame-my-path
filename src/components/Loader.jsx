import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-52 flex items-center justify-center bg-loader-bg">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
