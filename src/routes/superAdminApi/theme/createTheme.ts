import { Handler } from "../../../utils/make-api";
import { Boom } from "@hapi/boom";
import Theme from "../../../model/theme";
import { NOT_FOUND, BAD_REQUEST} from "http-status";


const handler: Handler<"createTheme"> = async (request) => {
  

    const { themeName , photoUrl } = request;

    if(!themeName || !photoUrl){
        throw new Boom("All fields are required", {
            statusCode: BAD_REQUEST,
          });   
    }
    const isthemeExist = await Theme.findOne({
        themeName: themeName,
    });

    if (!isthemeExist) {
      const newTheme = await Theme.create({
        ...request,
      });

     
      return newTheme;
    } else {
      throw new Boom("Theme with the same name already exists.", {
        statusCode: BAD_REQUEST,
      });
    }

};

export default handler;
