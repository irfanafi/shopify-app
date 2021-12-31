import React from "react";
import {
  Page,
  Layout,
  EmptyState,
  Card,
  Button,
  OptionList,
} from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ExportButton from "../Components/ExportButton";
import ResourceListWithProducts from "../ResourceList";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

class ExportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      setSelected: [],
    };
  }

  state = { open: false, downloaded: false };
  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get("ids");
    return (
      <Page title="Product Export">
        <TitleBar
          primaryAction={{
            content: "Select products",
            onAction: () => this.setState({ open: true }),
          }}
          secondaryActions={[
            {
              content: "Return to Home",
              onAction: () => this.props.onPageChange([true, false, false]),
            },
          ]}
        />

        <Layout>
          {/* <Layout.Section>
                <Card
                    title="Export Details" 
                    sectioned
                >
                <p><p>Export ID: {store.get("maxExportID")}</p> <p>Time Placed: 12345</p> <p>Time Completed: 12345</p></p>
                </Card>
            </Layout.Section> */}

          <Layout.Section>
            <ResourcePicker
              resourceType="Product"
              showVariants={false}
              open={this.state.open}
              onSelection={(resources) => this.handleSelection(resources)}
              onCancel={() => this.setState({ open: false })}
            />
            <Card>
              <OptionList
                title="Export Filters"
                onChange={(selectedValues) =>
                  this.setState({ selected: selectedValues })
                }
                options={[
                  { value: "inStockOnly", label: "In Stock Only" },
                  { value: "withVariants", label: "With Variants Only" },
                ]}
                selected={this.state.selected}
                allowMultiple
              />
            </Card>

            {emptyState ? ( // Controls the layout of your app's empty state
              <Layout>
                <EmptyState
                  heading="Select products to export"
                  action={{
                    content: "Select products",
                    onAction: () => this.setState({ open: true }),
                  }}
                  image={img}
                >
                  <p>Select products to change their price temporarily.</p>
                </EmptyState>
              </Layout>
            ) : (
              // Uses the new resource list that retrieves products by IDs
              <ResourceListWithProducts />
            )}
            {emptyState ? (
              <></>
            ) : (
              <ExportButton filters={this.state.selected} />
            )}
            {emptyState ? (
              <></>
            ) : (
              <div
                style={{
                  float: "right",
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                <Button onClick={() => this.setState({ open: true })}>
                  Reselect Products
                </Button>
              </div>
            )}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set("ids", idsFromResources);
  };
}

export default ExportPage;
