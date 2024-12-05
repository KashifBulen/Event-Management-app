import { Handler } from "../../utils/make-api";
import { Boom } from "@hapi/boom";
import Company from "../../model/company";
import { NOT_FOUND, BAD_REQUEST } from "http-status";
import JWT from "jsonwebtoken";

const handler: Handler<"createCompany"> = async (request, { user }) => {
  const {
    email,
    registeredNumber,
  } = request;
  // const companyEmail = await Company.findOne({ email });

  // if (companyEmail) {
  //   throw new Boom("Company Already Registered with this Email", {
  //     statusCode: BAD_REQUEST,
  //   });
  // }

  const companyRegisteredNumber = await Company.findOne({ registeredNumber });
  if (companyRegisteredNumber) {
    throw new Boom(
      "Company Already Registered with this Registration number",
      { statusCode: BAD_REQUEST }
    );
  }

  try {
    const newCompanyAccount = await Company.create({
      userId: user.userId,
      ...request,
    });

    let companyId = newCompanyAccount._id;

    if (newCompanyAccount) {
      // const payload = {
      //   // idToken: user.idToken,
      //   userId: user.userId,
      //   signInType: "professional",
      //   companyId: companyId,
      // };

      // const token = JWT.sign(payload, process.env.TOKEN_SECRET as string, {
      //   expiresIn: "30d",
      // });

      return newCompanyAccount;
      // {
      //   newCompanyAccount,
      //   token,
      //   ...payload,
      // };
      
    } else {
      throw new Boom("Something went wrong, Company not created", { statusCode: BAD_REQUEST });
    }
  } catch (error) {
    throw new Boom("Errro in Company Registeration", {
      statusCode: BAD_REQUEST,
    });
  }
};

export default handler;
