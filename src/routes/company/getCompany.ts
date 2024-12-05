import { Handler } from "../../utils/make-api";
import Company from "../../model/company";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

const handler: Handler<"getCompany"> = async (request, { user }) => {
  try {
    const getCompanyDetails = await Company.find({ userId: user.userId });

    if (!getCompanyDetails) {
      throw new Boom("Company not found", { statusCode: NOT_FOUND });
    }

    return getCompanyDetails;
  } catch (error) {
    throw new Boom("Something went wrong", { statusCode: BAD_REQUEST });
  }
};

export default handler;

