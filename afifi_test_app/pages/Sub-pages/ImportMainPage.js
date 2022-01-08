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

class ImportMainPage extends React.Component {
  state = { open: false, downloaded: false };
  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get("ids");
    return (
      <Page title="Orders Import then Export">
        <TitleBar
          secondaryActions={[
            {
              content: "Return to Home",
              onAction: () =>
                this.props.onPageChange([true, false, false, false, false]),
            },
          ]}
        />
        <Layout>
          <Layout.Section>
            <Card
              title="Import"
              sectioned
              primaryFooterAction={{
                content: "Import Orders",
                onAction: () =>
                  this.props.onPageChange([false, false, false, false, true]),
              }}
            >
              <p>
                Import your orders gotten through your live sale and generate a
                link to be sent to your customers.
              </p>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card title="Previous Imports" sectioned>
              <p>Review your previous imports</p>

              {/* This part onwards should be dynamic */}
              <Card.Section>
                <TextStyle variation="subdued">13 files exported</TextStyle>
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
              {/* This part above should be dynamic */}
            </Card>
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

export default ImportMainPage;
