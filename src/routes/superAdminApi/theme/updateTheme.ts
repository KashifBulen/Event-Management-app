import { Handler } from "../../../utils/make-api";
import Theme from "../../../model/theme";
import { Boom } from "@hapi/boom";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

const handler: Handler<"updateTheme"> = async (request) => {

  const {themeName, photoUrl, id} = request;
  const updatedFields = { ...request };

  if(!themeName || !photoUrl){
    throw new Boom("All fields are required", {
        statusCode: BAD_REQUEST,
      });   
}

  const isThemeExist = await Theme.findById({ _id: id });
  if (!isThemeExist) {
    throw new Boom("theme does not Exist", { statusCode: BAD_REQUEST });
  } else {
    const updatedTheme = await Theme.findByIdAndUpdate(
      { _id: id },
      { $set: updatedFields, updatedAt: Date.now(), },
      { new: true }
    );

    if (!updatedTheme) {
      throw new Boom("theme Not Updated, Something went wrong", {
        statusCode: BAD_REQUEST,
      });
    }else{

        return updatedTheme.toObject();
    }

  }
};

export default handler;
