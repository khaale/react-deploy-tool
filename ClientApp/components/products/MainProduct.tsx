import * as React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { GridList, GridTile } from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import { ProductBase, ProductProps, ProductState } from './ProductBase';

export interface MainProductProps extends ProductProps {
    isDbSelected: boolean,
    isAppSelected: boolean
}

export interface MainProductState extends ProductState {
    isDbSelected: boolean,
    isAppSelected: boolean
}

export class MainProduct extends ProductBase<MainProductProps, MainProductState> {

    public static dbComponents: string[] = ["Database 1", "Database 2", "Database 3", "Database 4", "Database 5", "Database 6"]
    public static appComponents: string[] = ["Service 1", "Service 2", "Web Portal 1", "Web Portal 2"]

    constructor(props: MainProductProps) {
        super(props);
        this.state = {
            name: props.name,
            isAppSelected: props.isAppSelected,
            isDbSelected: props.isDbSelected,
            buildMask: props.buildMask,
            selectedBuild: null,
            builds: [],
            selectedComponents: MainProduct.dbComponents.concat(MainProduct.appComponents),
            loading: true
        };

        this.loadBuilds();
    }

    private static isDbComponent = (component: string) => MainProduct.dbComponents.some(c => component === c);
    private static isAppComponent = (component: string) => MainProduct.appComponents.some(c => component === c);
    private static isSelected = (component: string, selectedComponents: string[]) => selectedComponents.some(c => c === component)

    public render() {
        const inputStyle = {
            marginLeft: 10,
            paddingLeft: 10
        };

        const paperStyle = {
            margin: 10,
            padding: 10
        };

        return <div>
            <div style={inputStyle}>
                <SelectField
                    floatingLabelText={`Select ${this.state.name} build`}
                    value={this.state.selectedBuild != null ? this.state.selectedBuild.url : null}
                    style={{ width: 300 }}
                    onChange={this.onBuildChange}
                >
                    {this.state.builds.map(b =>
                        <MenuItem key={b.url} value={b.url} primaryText={b.name} />
                    )}
                </SelectField>
            </div>
            <GridList cols={2} style={{ height: 280 }}>
                <Paper style={paperStyle} zDepth={2}>
                    <h3><Toggle label="Databases" toggled={this.state.isDbSelected} onToggle={this.onDbSelectedChange} /></h3>
                    <Divider />
                    <br />
                    <div>
                        {MainProduct.dbComponents.map(c => {
                            return this.renderCheckBox(c, this.state.isDbSelected)
                        })}
                    </div>
                </Paper>
                <Paper style={paperStyle} zDepth={2}>
                    <h3><Toggle label="Applications" toggled={this.state.isAppSelected} onToggle={this.onAppSelectedChange} /></h3>
                    <Divider />
                    <br />
                    <div>
                        {MainProduct.appComponents.map(c => {
                            return this.renderCheckBox(c, this.state.isAppSelected)
                        })}
                    </div>
                </Paper>
            </GridList>
        </div>;
    }

    private renderCheckBox(label: string, enabled: boolean) {
        let checked = MainProduct.isSelected(label, this.state.selectedComponents)
        return <Checkbox
            key={label}
            checked={checked}
            label={label}
            disabled={!enabled}
            onCheck={this.onComponentChanged(label)}
        />;
    }

    protected onDbSelectedChange = (event, value) => {
        this.setState({ isDbSelected: value })

        let newComponents = this.state.selectedComponents.filter(c =>
            (value && MainProduct.isDbComponent(c))
            || (this.state.isAppSelected && MainProduct.isAppComponent(c)));

        this.props.onComponentsChange(newComponents);
    };

    protected onAppSelectedChange = (event, value) => {

        this.setState({ isAppSelected: value })

        let newComponents = this.state.selectedComponents.filter(c =>
            (this.state.isDbSelected && MainProduct.isDbComponent(c))
            || (value && MainProduct.isAppComponent(c)));

        this.props.onComponentsChange(newComponents);
    };

    protected onComponentChanged = (name: string) => (event, value) => {
        let newComponents = value
            ? this.state.selectedComponents.concat([name])
            : this.state.selectedComponents.filter(c => c != name)
        this.setState({ selectedComponents: newComponents });
        this.props.onComponentsChange(newComponents);
    }
}