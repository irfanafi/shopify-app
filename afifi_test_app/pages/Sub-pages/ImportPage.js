import React, {useState, useCallback } from 'react';
import { Page, Layout, EmptyState, Card, Button, OptionList, DropZone, Stack, Thumbnail, Caption } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';
import ExportButton from '../Components/ExportButton';
import ImportButton from '../Components/ImportButton';
import { NoteMinor } from '@shopify/polaris-icons';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class ImportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      setSelected: []
    };
  }

  state = { open: false, downloaded: false};
  render() {
    // A constant that defines your app's empty state
    const emptyState = !store.get('ids');
    return (
      <Page
      title="Import Online Orders"
      >
        <TitleBar
          secondaryActions={[
            {
              content: 'Return to Home',
              onAction: () => this.props.onPageChange([true,false,false]),
            }
          ]}
        />

        <Layout>
            <Layout.Section>
                <Card
                    title="Import Details" 
                    sectioned
                >
                <p><p>Export ID: 12345</p> <p>Time Placed: 12345</p> <p>Time Completed: 12345</p></p>
                </Card>
            </Layout.Section>

            <Layout.Section>
                <NestedDropZone setFile={(fileUploaded) => this.setState({file: fileUploaded})}/>
                {this.state.file ? <ImportButton fileUploaded={this.state.file}/> : <></>}
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

export default ImportPage;


function NestedDropZone(props) {
    const [file, setFile] = useState();

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      {
        setFile(() => acceptedFiles[0])
        props.setFile(acceptedFiles[0])
    },
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <Stack>
      <Thumbnail
        size="small"
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteMinor
        }
      />
      <div>
        {file.name} <Caption>{file.size} bytes</Caption>
      </div>
    </Stack>
  );

  return (
    <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
      {uploadedFile}
      {fileUpload}
    </DropZone>
  );
  }