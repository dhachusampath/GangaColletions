import React, { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const BarcodeScanner = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [bulkBarcodes, setBulkBarcodes] = useState([]);
  const [error, setError] = useState("");
  const barcodeCanvasRef = useRef(null);

  // Validate barcode input
  const isValidBarcode = (value) => /^[a-zA-Z0-9-_]+$/.test(value);

  useEffect(() => {
    if (barcodeInput && barcodeCanvasRef.current && isValidBarcode(barcodeInput)) {
      setError("");
      try {
        JsBarcode(barcodeCanvasRef.current, barcodeInput, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
        });
      } catch (err) {
        setError("Failed to generate barcode. Please enter valid data.");
      }
    }
  }, [barcodeInput]);

  const handleBulkInputChange = (e) => {
    const barcodes = e.target.value
      .split("\n")
      .map((item) => item.trim())
      .filter((item, index, self) => item && self.indexOf(item) === index);
    
    if (barcodes.some((barcode) => !isValidBarcode(barcode))) {
      setError("Bulk input contains invalid characters. Only alphanumeric values are allowed.");
      return;
    }
    
    setError("");
    setBulkBarcodes(barcodes);
  };

  const downloadBarcodeImage = (format = "png") => {
    if (!barcodeInput) {
      setError("Please enter a barcode before downloading.");
      return;
    }
    if (barcodeCanvasRef.current) {
      const canvas = barcodeCanvasRef.current;
      const link = document.createElement("a");
      link.href = canvas.toDataURL(`image/${format}`);
      link.download = `${barcodeInput}.${format}`;
      link.click();
    }
  };

  const downloadBulkBarcodesZip = async () => {
    if (bulkBarcodes.length === 0) {
      setError("Please enter bulk barcodes before downloading.");
      return;
    }
    
    setError("");
    const zip = new JSZip();
    const canvas = barcodeCanvasRef.current;

    for (let i = 0; i < bulkBarcodes.length; i++) {
      const barcode = bulkBarcodes[i];
      try {
        JsBarcode(canvas, barcode, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: true,
        });
        const dataUrl = canvas.toDataURL("image/png");
        zip.file(`barcode_${i + 1}.png`, dataUrl.split(",")[1], { base64: true });
      } catch {
        setError(`Failed to generate barcode for: ${barcode}`);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "barcodes.zip");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Barcode Generator</h2>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.section}>
        <h3>Generate Barcode</h3>
        <input
          type="text"
          value={barcodeInput}
          placeholder="Enter text or number"
          onChange={(e) => setBarcodeInput(e.target.value)}
          style={styles.input}
        />
        <div style={{ marginTop: "20px" }}>
          <canvas ref={barcodeCanvasRef} style={{ border: "1px solid #ddd" }}></canvas>
        </div>
        <button onClick={() => downloadBarcodeImage("jpeg")} style={styles.button}>Download JPEG</button>
      </div>

      <div style={styles.section}>
        <h3>Generate Bulk Barcodes</h3>
        <textarea
          rows="5"
          placeholder="Enter barcodes, one per line"
          onChange={handleBulkInputChange}
          style={styles.textarea}
        ></textarea>
        {bulkBarcodes.length > 0 && (
          <button onClick={downloadBulkBarcodesZip} style={styles.button}>Download Bulk as ZIP</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" },
  heading: { textAlign: "center", marginBottom: "20px" },
  error: { color: "red", textAlign: "center" },
  section: { marginBottom: "40px" },
  input: { padding: "10px", width: "300px" },
  textarea: { padding: "10px", width: "100%", resize: "none" },
  button: { marginTop: "20px", padding: "10px 20px", backgroundColor: "#28A745", color: "#fff", border: "none", cursor: "pointer", marginRight: "10px" },
};

export default BarcodeScanner;
