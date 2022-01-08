import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Button } from "@shopify/polaris";
import gql from "graphql-tag";
import store from "store-js";
import generateExcelFile from "../GenerateExcel";

const GET_VALUES_BY_IDS = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        totalVariants
        variants(first: 15) {
          edges {
            node {
              sku
              inventoryQuantity
              price
              title
            }
          }
        }
      }
    }
  }
`;

function DiscountSegment() {
  var tempMap = new Map();
  const { error, loading, data } = useQuery(GET_VALUES_BY_IDS, {
    variables: { ids: store.get("ids") },
  });
  if (error) {
    console.log("Error when querying");
    console.log(error);
  }
  if (data) {
    data.nodes.forEach((node) => {
      //Process each product here
      if (node.totalVariants !== 0) {
        var variants = node.variants.edges;
        tempMap.set(node.title, variants);
      }
    });
    generateExcelFile(tempMap);
  }
  return <Button>File Downloaded</Button>;
}

export default DiscountSegment;
