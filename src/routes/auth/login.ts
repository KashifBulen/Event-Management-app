import { Handler } from "../../utils/make-api";
import signIn from "../../utils/sign-in";

const handler: Handler<"login"> = async (request) => {
  const { email, idToken,deviceToken } = request;

  return signIn(email as string, idToken as string, deviceToken as string);
};

export default handler;
