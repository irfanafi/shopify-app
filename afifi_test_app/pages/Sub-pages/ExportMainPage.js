import React from 'react';
import { Page, Layout, EmptyState, Card, Heading, Stack, TextStyle, Badge } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ExportButton from '../Components/ExportButton';
import ResourceListWithProducts from '../ResourceList';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class ExportMainPage extends React.Component {
  state = { open: false, downloaded: false };
  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get('ids');
    return (
      <Page
        title="Export"
      >
        <TitleBar
          secondaryActions={[
            {
              content: 'Return to Home',
              onAction: () => this.props.onPageChange([true,false,false, false]),
            }
          ]}
        />
        <Layout>
            <Layout.Section>
                <Card 
                    title="Product Export" 
                    sectioned
                    primaryFooterAction={{content: 'Export Products', onAction: () => this.props.onPageChange([false,true,false,false])}}
                >
                <p>Export your products into excel to be used for tracking orders on your live sale</p>
                </Card>
            </Layout.Section>
                
            
            <Layout.Section>
                <Card 
                    title="Previous Exports" 
                    sectioned
                >
                <p>Choose what you'd like to export from the filters</p>

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

            <Layout.Section>
                <Card 
                    title="Pending Exports" 
                    sectioned
                >
                <p>Schedule exports are listed below</p>

                    {/* This part onwards should be dynamic */}
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
    store.set('ids', idsFromResources);
  };

}

export default ExportMainPage;
