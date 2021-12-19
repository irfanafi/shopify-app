


function ImportStatusBar(props) {
    const [importOrders, { data, loading, error }] = useMutation(ADD_TODO);

    if (loading) return 'Importing...';
    if (error) return `Import error! ${error.message}`;
    
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
                <Button disabled= {true}>1 file imported</Button>
            </div>
        )
        
    }

    return (
        <div  style={{ float: "right", marginTop: "10px" }}>
            <Button onClick = {getDatafromDB}>Importing</Button>
        </div>
    )
}

export default ImportStatusBar







