import React from "react";


type props = {
  src: string;
};

function QrcodeGen({ src }: props) {
  let imgSrc: string;
  function generate(src) {
    
  }
  generate(src);
  return (
    <div>
      <img src={imgSrc} />
    </div>
  );
}

export default QrcodeGen;
