import React, { useState } from "react";
import JsBarcode from "jsbarcode";
import { toPng } from "react-html-to-image";

const BarcodeGenerator = () => {
  const [barcodeNumber, setBarcodeNumber] = useState("");

  const generateBarcode = () => {
    const svg = document.createElement("svg");
    JsBarcode(svg, barcodeNumber, { format: "CODE128" });
    const barcodeContainer = document.getElementById("barcodeContainer");
    barcodeContainer.innerHTML = "";
    barcodeContainer.appendChild(svg);
  };

  const downloadBarcode = async () => {
    const barcodeContainer = document.getElementById("barcodeContainer");
    const dataUrl = await toPng(barcodeContainer);
    const link = document.createElement("a");
    link.download = `${barcodeNumber}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Generate Barcode</h2>
      <input
        type="text"
        value={barcodeNumber}
        placeholder="Enter Number"
        onChange={(e) => setBarcodeNumber(e.target.value)}
        style={{ padding: "10px", width: "200px" }}
      />
      <button onClick={generateBarcode} style={{ marginLeft: "10px" }}>
        Generate
      </button>
      <button onClick={downloadBarcode} style={{ marginLeft: "10px" }}>
        Download
      </button>
      <div id="barcodeContainer" style={{ marginTop: "20px" }}></div>
    </div>
  );
};

export default BarcodeGenerator;
