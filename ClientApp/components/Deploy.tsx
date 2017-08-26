import * as React from 'react';
import 'isomorphic-fetch';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import { GridList, GridTile } from 'material-ui/GridList';
import { SingleProduct } from './products/SingleProduct';
import { MainProduct } from './products/MainProduct';
import { DeployRequest, Environment, Build } from '../models/model';


interface DeployState {
    envs: Environment[];
    mainAppSelected: boolean,
    mainDbSelected: boolean,
    subProduct1Selected: boolean,
    client1Selected: boolean,
    client2Selected: boolean,
    selectedEnv?: string,
    deployRequests: { [id: string]: DeployRequest },
    deployValidating: boolean;
    loading: boolean;
}

export class Deploy extends React.Component<{}, DeployState> {
    constructor() {
        super();
        this.state = {
            envs: [],
            mainAppSelected: true,
            mainDbSelected: true,
            subProduct1Selected: false,
            client1Selected: true,
            client2Selected: false,
            selectedEnv: null,
            deployRequests: {},
            deployValidating: false,
            loading: true
        };
        
        fetch('/api/Reference/Environments')
            .then(response => response.json() as Promise<Environment[]>)
            .then(data => {
                this.setState({ envs: data, loading: false });
            });        
    }

    public render() {       
        const groupStyle = {
            marginLeft: 10,
            paddingLeft: 10
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.onCancelDeploy}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={this.onSendDeploy}
            />,
        ];
        
        return <div style={{ maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={groupStyle}>
                <SelectField
                    value={this.state.selectedEnv}
                    floatingLabelText="Select Environment"
                    style={{ width: 300 }}
                    onChange={this.onEnvChange}
                >
                    {this.state.envs.map(e =>
                        <MenuItem key={e.name} value={e.name} primaryText={e.name} />
                    )}
                </SelectField>
            </div>
            <br />
            <MainProduct
                name="MainProduct"
                buildMask="MainProduct"
                isAppSelected={this.state.mainAppSelected}
                isDbSelected={this.state.mainDbSelected}
                onComponentsChange={this.onComponentsChange('MainProduct')}
                onBuildChange={this.onBuildChange('MainProduct')}
            />
            <GridList cols={3}>
                {this.renderSingleProduct('SubProduct1', this.state.client1Selected)}
                {this.renderSingleProduct('Client1', this.state.subProduct1Selected)}
                {this.renderSingleProduct('Client2', this.state.client2Selected)}
            </GridList>
            <div style={groupStyle}>
                <RaisedButton
                    primary={true}
                    labelColor='#FFFFFF'
                    disabled={this.state.selectedEnv == null}
                    onClick={this.onValidateDeploy}
                >DEPLOY</RaisedButton>
                <Dialog
                    title="Deploy"
                    actions={actions}
                    modal={false}
                    open={this.state.deployValidating}
                    onRequestClose={this.onCancelDeploy}
                >
                    <p>The following items will be deployed to <strong>{this.state.selectedEnv}</strong>:</p>
                    {
                        Object
                            .keys(this.state.deployRequests)
                            .map(x => this.state.deployRequests[x])
                            .filter(x => x.components.length > 0)
                            .map(Deploy.renderDeployRequest)
                    }
        </Dialog>
            </div>
        </div>;
    }

    private renderSingleProduct(name: string, isSelected: boolean) {

        return <SingleProduct
            name={name}
            buildMask={name}
            isSelected={isSelected}
            onComponentsChange={this.onComponentsChange(name)}
            onBuildChange={this.onBuildChange(name)}
        />
    }

    private static renderDeployRequest(req: DeployRequest) {

        if (req.project != 'MainProduct') {
            return <div key={req.project}>
                <h4>{req.project}</h4>
            </div>;
        }

        let wrapperStyle = { display: 'flex', flexWrap: 'wrap' };

        let renderComponent = (cmp: string) => {
            let color = req.components.some(c => c === cmp) ? '#4DD0E1' : null;
            return <Chip
                key={cmp}
                style={{ margin: 4 }}
                backgroundColor={color}

            >{cmp}</Chip>
        }
        return <div key={req.project}>
            <h4>{req.project}</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {MainProduct.dbComponents.map(renderComponent)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {MainProduct.appComponents.map(renderComponent)}
            </div>
            </div>
    }

    private onComponentsChange = (project: string) => (values: string[]) => {

        let deployRequests = this.state.deployRequests;

        let deployRequest = deployRequests[project];
        if (deployRequest == null) {
            deployRequest = new DeployRequest(project);
            deployRequests[project] = deployRequest;
        }

        deployRequest.components = values;

        this.setState({ deployRequests: deployRequests });
    };


    private onBuildChange = (project: string) => (value: Build) => {

        let deployRequests = this.state.deployRequests;

        let deployRequest = deployRequests[project];
        if (deployRequest == null) {
            deployRequest = new DeployRequest(project);
            deployRequests[project] = deployRequest;
        }

        deployRequest.build = value;

        this.setState({ deployRequests: deployRequests });
    };

    private onEnvChange = (event, index, value) => this.setState({ selectedEnv: value });
    private onValidateDeploy = () => { this.setState({ deployValidating: true }) };
    private onCancelDeploy = () => { this.setState({ deployValidating: false }) };
    private onSendDeploy = () => { this.setState({ deployValidating: false }) };
}
