import React from 'react';
import { Page, Layout, Card, TextStyle, Thumbnail, ResourceList, Stack, Badge, Heading } from "@shopify/polaris";
import { TitleBar } from '@shopify/app-bridge-react';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class IntroPage extends React.Component {
  state = { open: false, downloaded: false };
  
  render() {
    return (
        <Page
            title="Welcome to Afifi's App"
        >
            <TitleBar                />
            <Layout>
                <Layout.Section>
                    <Card title="We speed up work processes" sectioned>
                    <p>View a summary of your online store’s performance.</p>
                    </Card>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card title="Export to Excel" actions={[{content: 'Export', onAction: () => this.props.onPageChange([false,false,false,true])}]}>
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
                    </Card>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card title="Import & Export Draft Orders" actions={[{content: 'Import', onAction: () => this.props.onPageChange([false,false,true,false])}]}>
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
                    </Card>
                </Layout.Section>
            </Layout>
            
        </Page>
      )
  }
}

export default IntroPage;
