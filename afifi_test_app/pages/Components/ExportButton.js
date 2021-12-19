import { Button, EmptyState } from "@shopify/polaris"
import gql from 'graphql-tag';
import { useLazyQuery } from "@apollo/react-hooks";
import store from 'store-js';
import { generateExcelFile } from "../GenerateExcel";

function ExportButton(props) {
    const myQuery = gql`
        query getProducts($ids: [ID!]!) {
        nodes(ids: $ids) {
            ... on Product {
            title
            totalVariants
            variants(first: 10){
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
    let userIds =  store.get('ids')
    const [
        getDatafromDB, 
        { loading, data }
        ] = useLazyQuery(myQuery, {variables: { ids: userIds }});

    if (loading) return (
        <div  style={{ float: "right", marginTop: "10px" }}>
            <p>Loading ...</p>
        </div>
    )
    
    if (data) {
        var tempMap = new Map();
        data.nodes.forEach(node => {
            //Process each product here
            if(node.totalVariants !== 0){
                var variants = node.variants.edges;
                tempMap.set(node.title, variants)
            }
        })
        generateExcelFile(tempMap, props.filters)
        return (
            <div  style={{ float: "right", marginTop: "10px" }}>
                <Button disabled= {true}>Exported</Button>
            </div>
        )
        
    }

    return (
        <div  style={{ float: "right", marginTop: "10px" }}>
            <Button onClick = {getDatafromDB}>Export</Button>
        </div>
    )
}

export default ExportButton
