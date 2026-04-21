"use client";

// import DOMPurify from "dompurify";
import DOMPurify from "isomorphic-dompurify";

export default function ProductDescription({
  text,
}: {
  text: [string, string];
}) {
  const sanitizedDescription1 = DOMPurify.sanitize(text[0]);
  const sanitizedDescription2 = DOMPurify.sanitize(text[1]);
  return (
    <div className="pt-6 overflow-hidden">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">Description</h2>
      </div>
      {/* Display both descriptions */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription1 }} />
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription2 }} />
    </div>
  );
}
