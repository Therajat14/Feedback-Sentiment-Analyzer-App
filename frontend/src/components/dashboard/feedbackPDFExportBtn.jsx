import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FeedbackPDF from "./FeedbackPDF";

function FeedbackExportButton({ feedbacks }) {
  const [showPDF, setShowPDF] = useState(false);

  const handleExportClick = () => {
    setShowPDF(true);
  };

  return (
    <>
      {!showPDF ? (
        <button
          onClick={handleExportClick}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Export PDF
        </button>
      ) : (
        <PDFDownloadLink
          document={<FeedbackPDF feedbacks={feedbacks} />}
          fileName="feedback-report.pdf"
        >
          {({ loading }) => (
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
              disabled={loading}
              onClick={() => setShowPDF(false)} // Reset if needed
            >
              {loading ? "Generating..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      )}
    </>
  );
}

export default FeedbackExportButton;
