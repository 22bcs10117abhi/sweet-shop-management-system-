import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Organisation } from "../models/organisation.model.js";

//public apis
const getOrgList = asynchandler(async (req, res) => {
  const { input } = req.query;

  const results = await Organisation.find({
    organisationName: { $regex: input, $options: "i" },
  });

  res
    .status(200)
    .json(
      new ApiResponse(200,"Organisations retrieved successfully", results)
    );
});

const getOrgByRegNo = asynchandler(async (req, res) => {
  const { regNo } = req.params;

  const organisation = await Organisation.findOne({ orgRegId: regNo });

  if (!organisation) {
    throw new ApiError(404,"Organisation not found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      "Organisation retrieved successfully",
      organisation
    )
  );
});


const getMyOrganisation = asynchandler(async (req, res) => {
  const adminAddress = req.user.address.toLowerCase(); // Convert to lowercase
  console.log("Looking for adminAddress:", adminAddress);
  
  const organisation = await Organisation.findOne({ adminAddress });

  console.log("Found organisation:", organisation);

  if (!organisation) {
    throw new ApiError(404, "Organisation not found for this admin.");
  }

  res.status(200).json(new ApiResponse(200, organisation, "Organisation details retrieved successfully"));
});

const getOrganisationById = asynchandler(async (req, res) => {
  const { id } = req.params;
  const organisation = await Organisation.findById(id);

  if (!organisation) {
    throw new ApiError(404, "Organisation not found");
  }

  res.status(200).json(new ApiResponse(200, organisation, "Organisation retrieved successfully"));
});

const createOrg = asynchandler(async (req, res) => {

  const { adminAddress, organisationName, orgRegId, contractAddress } = req.body;

  if (!adminAddress || !organisationName || !orgRegId || !contractAddress) {
    throw new ApiError(400,"All fields are required");
  }

  const organisation = await Organisation.create({
    adminAddress,
    organisationName,
    orgRegId,
    contractAddress,
  });

  res.status(200).json(new ApiResponse(
    201,
    "Organisation created successfully",
    organisation
  ));
});

export { createOrg, getOrgList, getOrgByRegNo, getMyOrganisation, getOrganisationById };
