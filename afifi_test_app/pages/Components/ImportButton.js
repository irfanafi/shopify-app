import { Button, EmptyState, Page } from "@shopify/polaris"
import gql from 'graphql-tag';
import { useLazyQuery } from "@apollo/react-hooks";
import store from 'store-js';
import * as XLSX from 'xlsx';
import { useApolloClient } from "react-apollo";
import "@babel/polyfill";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import dotenv from "dotenv";
import next from "next";


function ImportButton(props) {
    const mutationGQL = ``;
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
            <Button onClick = {getDatafromDB}>Import</Button>
        </div>
    )
}

export default ImportButton


function parseExcelFile(file) {
    console.log("Parsing the excel file now")
    var name = file.name;
    const reader = new FileReader();
    var userOverallOrders = new Map();
    reader.onload = (evt) => { // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        /* Get first worksheet */
        const numberOfSheets = wb.SheetNames.length
        for(let i = 0; i<numberOfSheets; i++){
            const wsname = wb.SheetNames[i];
            console.log(wsname)
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_row_object_array(ws, {header:1});
            /* Update state */
            console.log("Data>>>"+data[0]);
            //Get the columns index
            let actualColumnsArr = getIndexOfColumnsWithHeaders(data);
            //Get User names from the sheet
            let userOrdersPerSheet = new Map()
            userOrdersPerSheet = getNameOfUsers(data, actualColumnsArr)
            let userKeys = Array.from(userOrdersPerSheet.keys())
            userKeys.forEach((username) => {
                if(userOverallOrders.has(username)){
                    let orderArr = userOverallOrders.get(username)
                    orderArr = orderArr.concat(userOrdersPerSheet.get(username))
                    userOverallOrders.set(username, orderArr)
                }
                else
                    userOverallOrders.set(username, userOrdersPerSheet.get(username))
            })
        }
        console.log(userOverallOrders)

        importDraftOrders(userOverallOrders)

        
    };
    reader.readAsBinaryString(file);
    console.log(file)
    
}

function getIndexOfColumnsWithHeaders(data) {
    let columnsArr = [];
    let numberOfColumns = data[0].length;
    for(let i =0; i< numberOfColumns; i++){
        if(data[0][i] === null || data[0][i].match(/^ *$/) !== null)
            console.log("Is empty")
        else{
            columnsArr.push(i)
        } 
    }
    return columnsArr;
}

function getNameOfUsers(data, actualColumnsArr){
    let nameOfUsersArr = [];
    for(let i = 3; i<data.length; i++){
        for(let j = 0; j < data[0].length; j++){
            if(actualColumnsArr.includes(j) && !(data[i][j] === null || data[i][j].match(/^ *$/) !== null)){
                console.log(i,j)
                nameOfUsersArr.push(data[i][j])
            }
               
        }
    }
    //Get Unique names
    nameOfUsersArr = [... new Set(nameOfUsersArr)]
    let orderList = new Map();
    nameOfUsersArr.forEach((currentValue, index, arr) =>{
        let eachUserOrder = [];
        for(let i = 3; i<data.length; i++){
            for(let j = 0; j < data[0].length; j++){
                if(actualColumnsArr.includes(j) && data[i][j] === currentValue){
                    eachUserOrder.push(String(data[1][j]))
                }
            }
        }
        orderList.set(currentValue, eachUserOrder)
    })
    console.log(orderList)
    return orderList;
}

function importDraftOrders(ordersMap) {
    let userKeys = Array.from(ordersMap.keys())
    let userOrderArr
    for(let i=0; i< userKeys.length;i++){
        userOrderArr = ordersMap.get(userKeys[i])
        var draftQuery = constructGraphQlQuery(userKeys[i], userOrderArr)
        uploadDraftToShopify(draftQuery)
    }
    
    
}

function constructGraphQlQuery(username, orderArr) {
    let lineItemsArr = [];
    orderArr.forEach((currentValue, index, arr)=>{
        //get VariantID here?

        let lineItem = `{quantity: 1, variantId:"gid://shopify/ProductVariant/41310436196551"}`
        lineItemsArr.push(lineItem)
    })
    return `
        mutation{
            draftOrderCreate(input:{note: ${username}, lineItems:${lineItemsArr})
                    {
                        draftOrder{
                            invoiceUrl
                            },
                                userErrors{
                                message
                                }
                }
        }
    `
}

compose(
  graphql(gql`mutation CreateTodoMutation (...) { ... }`, { name: 'createTodo' }),
  graphql(gql`mutation UpdateTodoMutation (...) { ... }`, { name: 'updateTodo' }),
  graphql(gql`mutation DeleteTodoMutation (...) { ... }`, { name: 'deleteTodo' }),
)(ImportButton);