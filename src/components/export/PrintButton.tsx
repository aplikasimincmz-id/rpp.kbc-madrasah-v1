"use client";

import Button from "@/components/ui/Button";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="outline" onClick={handlePrint}>
      🖨️ Cetak
    </Button>
  );
}
