import { asynchandler } from "../utils/asynchandler.js";
import { Notice } from "../models/notice.model.js";
import { Organisation } from "../models/organisation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const getAllNotices = asynchandler(async (req, res) => {
  const { orgId } = req.query;

  if (!orgId) {
    throw new ApiError("Organisation ID is required", 400);
  }

  const notices = await Notice.find({ organisation: orgId });

  res
    .status(200)
    .json(new ApiResponse(200, notices, "Notices retrieved successfully"));
});

const createNotice = asynchandler(async (req, res) => {
  if (!req.user || !req.user.address) {
    throw new ApiError("User not authenticated", 401);
  }

  const { noticeId, ipfsAddress ,noticeTitle} = req.body;

  if (!noticeId || !ipfsAddress || !noticeTitle) {
    throw new ApiError("All fields are required", 400);
  }

  const organisation = await Organisation.findOne({
    adminAddress: req.user.address,
  });

  const notice = await Notice.create({
    organisation: organisation._id,
    noticeId,
    ipfsAddress,
    title:noticeTitle
  });

  res
    .status(200)
    .json(new ApiResponse(201, notice, "Notice created successfully"));
});

 const watermarkPdf = asynchandler(async (req, res) => {
    
    // 1. Get the data from the request
    const { contractAddress, noticeId } = req.body;
    const pdfFileBuffer = req.file?.buffer;

    if (!pdfFileBuffer || !contractAddress || !noticeId) {
        throw new ApiError(400, "PDF file, contractAddress, and noticeId are required.");
    }

    // 2. Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfFileBuffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    // 3. Iterate over each page and add watermarks
    for (const page of pages) {
        const { width, height } = page.getSize();
        
        const watermarkText1 = `Contract: ${contractAddress}`;
        const watermarkText2 = `Notice ID: ${noticeId}`;

        // Draw the first line of text
        page.drawText(watermarkText1, {
            x: 10, // Position from left
            y: height - 10, // Position from top
            font,
            size: 10,
            color: rgb(0.5, 0.5, 0.5), // Gray color
        });

        // Draw the second line of text
        page.drawText(watermarkText2, {
            x: 10,
            y: height - 30, // Position below the first line
            font,
            size: 10,
            color: rgb(0.5, 0.5, 0.5),
        });
    }

    // 4. Save the modified PDF to a new buffer
    const watermarkedPdfBytes = await pdfDoc.save();

    // 5. Send the new PDF back to the client for down  load
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked_notice.pdf');
    res.send(Buffer.from(watermarkedPdfBytes));
});
export { getAllNotices, createNotice, watermarkPdf };
