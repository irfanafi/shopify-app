import React from "react";
import {
  Page,
  Layout,
  Card,
  TextStyle,
  Thumbnail,
  ResourceList,
  Stack,
  Badge,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import axios from "axios";
import store from "store-js";

class IntroPage extends React.Component {
  state = {
    open: false,
    downloaded: false,
    previousExports: [],
    previousImports: [],
    noOfPreviousExports: 0,
    noOfPreviousImports: 0,
  };

  componentDidMount() {
    axios
      .get("/getPreviousExports")
      .then((response) => {
        console.log(response);
        this.setState({
          previousExports: response.data,
          noOfPreviousExports: response.data.length,
        });
        store.set("previousExports", response.data);
        store.set("noOfPreviousExports", response.data.length);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("/getPreviousImports")
      .then((response) => {
        console.log(response);
        this.setState({
          previousImports: response.data,
          noOfPreviousImports: response.data.length,
        });
        store.set("previousImports", response.data);
        store.set("noOfPreviousImports", response.data.length);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
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

    const previousImports = this.state.previousImports.map((orders) => (
      <Card.Section title="Items">
        <Stack>
          <Stack.Item fill>
            <Heading>Import Request #{orders.orderID}</Heading>
          </Stack.Item>
          <Badge>Imported</Badge>
        </Stack>
      </Card.Section>
    ));

    return (
      <Page title="Welcome to Afifi's App">
        <TitleBar />
        <Layout>
          <Layout.Section>
            <Card title="We speed up work processes" sectioned>
              <p>View a summary of your online store’s performance.</p>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card
              title="Export to Excel"
              actions={[
                {
                  content: "Export",
                  onAction: () =>
                    this.props.onPageChange([false, false, false, true]),
                },
              ]}
            >
              <Card.Section>
                <TextStyle variation="subdued">
                  {this.state.noOfPreviousExports} files exported
                </TextStyle>
              </Card.Section>
              {previouseExports}
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card
              title="Import & Export Draft Orders"
              actions={[
                {
                  content: "Import",
                  onAction: () =>
                    this.props.onPageChange([false, false, true, false]),
                },
              ]}
            >
              <Card.Section>
                <TextStyle variation="subdued">
                  {this.state.noOfPreviousImports} files imported
                </TextStyle>
              </Card.Section>
              {previousImports}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default IntroPage;
