import { Handler } from "../../utils/make-api";
import Company from "../../model/company";
import { Boom } from "@hapi/boom";
import { NOT_FOUND, BAD_REQUEST } from "http-status";

const handler: Handler<"getSingleCompany"> = async (request,{user}) => {
  const id = request.id;
  try {
  const getCompany = await Company.findById({ _id: id});
  if (!getCompany) {
    throw new Boom("Company not found", { statusCode: NOT_FOUND });
  } else {
    return getCompany;
  }
}catch(error){
    throw new Boom("Something went wrong", { statusCode: BAD_REQUEST });
}
};

export default handler;
