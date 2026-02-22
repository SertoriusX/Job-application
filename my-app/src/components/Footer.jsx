// Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} Your Company Name</p>
        <small>All rights reserved.</small>
      </div>
    </footer>
  );
}
