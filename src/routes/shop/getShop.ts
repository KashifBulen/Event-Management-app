import axios from 'axios'; // Assuming you have axios or another HTTP client install
import { Handler } from "../../utils/make-api";
import { Boom } from '@hapi/boom';

const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const CONSUMER_KEY = "ck_8a46063ccec7a775947f4800f1fb040dc2a5af7c";
const CONSUMER_SECRET = "cs_e1227d3a9d8c43d5a8bb483f162c5f741fcb3e1d";
const url = `https://www.mauritsweebers.com/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

const handler: Handler<"getShop"> = async ({ searchTerm, currentPage=1 }) => {
      try {
    console.log("searchTerm:",searchTerm,"currentPage",currentPage)
        const response = await axios.get(url);

        const filteredData = response.data.filter((product:any) =>
        product.name.toLowerCase().includes(searchTerm?.toLowerCase())
      );
    
        if (response.status !== 200) {
          throw new Boom("Failed to fetch data", { statusCode: response.status });
        }
        const pageLimit = 10; 
        const startIndex = (currentPage - 1) * pageLimit;
        const endIndex = currentPage * pageLimit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
     
  

        return   paginatedData;
      } catch (error) {
        console.error('Error in generic handler:', error);
        throw new Boom("Internal Server Error", { statusCode: INTERNAL_SERVER_ERROR });
      }
};
export default handler

