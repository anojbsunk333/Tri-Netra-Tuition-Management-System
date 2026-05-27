import React from "react";
import QRCode from "qrcode.react";

export default function QRCodeGenerator({ value = "", size = 128 }) {
  return <QRCode value={value} size={size} />;
}
