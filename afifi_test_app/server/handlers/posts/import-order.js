import {print} from 'graphql'
const importOrder = async (ctx, accessToken, shop) => {
    const queryBody = print(ctx.request.body)
    console.log("Trying noewww")
    console.log(accessToken)
    console.log(shop)
  
    const response = await fetch(
      `https://${shop}//admin/api/2021-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
            query: queryBody
        }),
      }
    );
  
    const responseJson = await response.json();
    console.log("Smart madafucka")
    console.log(responseJson)
    return responseJson;
  };
  
  module.exports = importOrder;