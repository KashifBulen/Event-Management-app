import { Handler } from "../../utils/make-api";
import Company from "../../model/company";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status";

const handler: Handler<"updateCompany"> = async (request, { user }) => {
  try {
    const updatedFields = { ...request };
    const isCompanyExist = await Company.findOne({ userId: user.userId });

    if (!isCompanyExist) {
      throw new Boom("Company does not exist", { statusCode: BAD_REQUEST });
    } else {
      const updatedCompany = await Company.findOneAndUpdate(
        { userId: user.userId },
        { $set: updatedFields, updatedAt: Date.now(), },
        { new: true }
      );

      if (!updatedCompany) {
        throw new Boom("Not Updated, Something went wrong", {
          statusCode: INTERNAL_SERVER_ERROR,
        });
      }

      return updatedCompany.toObject();
    }
  } catch (error) {
    throw new Boom("Error while updating company profile", {
      statusCode: BAD_REQUEST,
    });
  }
};

export default handler;
