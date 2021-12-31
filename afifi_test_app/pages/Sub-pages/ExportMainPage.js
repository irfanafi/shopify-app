import React from "react";
import {
  Page,
  Layout,
  Card,
  Heading,
  Stack,
  TextStyle,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

class ExportMainPage extends React.Component {
  state = {
    open: false,
    downloaded: false,
    previousImports: [],
    previousExports: [],
    noOfPreviousImports: 0,
    noOfPreviousExports: 0,
  };

  componentDidMount() {
    this.setState({
      previousImports: store.get("previousImports"),
      noOfPreviousImports: store.get("noOfPreviousImports"),
      previousExports: store.get("previousExports"),
      noOfPreviousExports: store.get("noOfPreviousExports"),
    });
  }

  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get("ids");

    const previouseExports = this.state.previousExports.map((exportOrders) => (
      <Card.Section title="Items">
        <Stack>
          <Stack.Item fill>
            <Heading>Export Request #{exportOrders.orderID}</Heading>
          </Stack.Item>
          <Badge>Exported</Badge>
        </Stack>
      </Card.Section>
    ));

    return (
      <Page title="Export">
        <TitleBar
          secondaryActions={[
            {
              content: "Return to Home",
              onAction: () =>
                this.props.onPageChange([true, false, false, false]),
            },
          ]}
        />
        <Layout>
          <Layout.Section>
            <Card
              title="Product Export"
              sectioned
              primaryFooterAction={{
                content: "Export Products",
                onAction: () =>
                  this.props.onPageChange([false, true, false, false]),
              }}
            >
              <p>
                Export your products into excel to be used for tracking orders
                on your live sale
              </p>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card title="Previous Exports" sectioned>
              <p>Choose what you'd like to export from the filters</p>

              {/* This part onwards should be dynamic */}
              <Card.Section>
                <TextStyle variation="subdued">
                  {this.state.noOfPreviousExports} files exported
                </TextStyle>
              </Card.Section>
              {previouseExports}
              {/* This part above should be dynamic */}
            </Card>
          </Layout.Section>

          {/* <Layout.Section>
                <Card 
                    title="Pending Exports" 
                    sectioned
                >
                <p>Schedule exports are listed below</p>
                    <Card.Section>
                        <TextStyle variation="subdued">2 files pending export</TextStyle>
                    </Card.Section>
                    <Card.Section title="Items">
                        <Stack>
                        <Stack.Item fill>
                            <Heading>Request #1136</Heading>
                        </Stack.Item>
                            <Badge>Processing</Badge>
                            <Badge>Downloaded</Badge>
                        </Stack>
                    </Card.Section>
                    <Card.Section title="Items">
                        <Stack>
                        <Stack.Item fill>
                            <Heading>Request #1136</Heading>
                        </Stack.Item>
                            <Badge>Processing</Badge>
                            <Badge>Downloaded</Badge>
                        </Stack>
                    </Card.Section>
                </Card>
            </Layout.Section> */}
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

export default ExportMainPage;
