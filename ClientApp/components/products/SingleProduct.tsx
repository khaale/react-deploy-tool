import * as React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { GridList, GridTile } from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import { ProductBase, ProductProps, ProductState } from './ProductBase'

export interface SingleProductProps extends ProductProps {
    isSelected:boolean
}

export class SingleProduct extends ProductBase<SingleProductProps, ProductState> {

    public static components = ['All']

    constructor(props: SingleProductProps) {
        super(props);
        this.state = {
            name: props.name,
            buildMask: props.buildMask,
            selectedBuild: null,
            builds: [],
            selectedComponents: props.isSelected ? SingleProduct.components : [],
            loading: true
        };

        this.loadBuilds();
    }

    public render() {
        let paperStyle = {
            margin: 10,
            padding: 10
        }

        return <Paper style={paperStyle} zDepth={2}>
            <h3>
                <Toggle
                    label={this.state.name}
                    toggled={this.isSelected()}
                    onToggle={this.onSelectedChange}
                />
            </h3>
            <Divider />
            <SelectField
                floatingLabelText={`Select ${this.state.name} build`}
                value={this.state.selectedBuild != null ? this.state.selectedBuild.url : null}
                style={{ width: 300 }}
                disabled={!this.isSelected()}
                onChange={this.onBuildChange}
            >
                {this.state.builds.map(b =>
                    <MenuItem key={b.url} value={b.url} primaryText={b.name} />
                )}
            </SelectField>
        </Paper>;
    }

    private isSelected = () => this.state.selectedComponents.length > 0

    protected onSelectedChange = (event, isChecked) => {
        let newSelectedComponents = isChecked ? SingleProduct.components : [];
        this.setState({ selectedComponents: newSelectedComponents })
        this.props.onComponentsChange(newSelectedComponents)
    };
}
