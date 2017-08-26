import * as React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { GridList, GridTile } from 'material-ui/GridList';
import Checkbox from 'material-ui/Checkbox';
import { Build } from '../../models/model'

export interface ProductProps {
    name: string,
    buildMask: string,
    onComponentsChange(value: string[]),
    onBuildChange(value: Build)
}

export interface ProductState {
    name: string
    buildMask: string,
    selectedBuild: Build,
    builds: Build[],
    selectedComponents: string[],
    loading: boolean
}

export abstract class ProductBase<TProps extends ProductProps, TState extends ProductState> extends React.Component<TProps, TState> {
    constructor(props: TProps) {
        super();
    }

    protected loadBuilds() {
        fetch(`/api/Reference/Builds?mask=${this.state.buildMask}`)
            .then(response => response.json() as Promise<Build[]>)
            .then(data => {
                let selectedBuild = data[0];
                this.setState({ builds: data, selectedBuild: selectedBuild, loading: false });
                this.props.onBuildChange(selectedBuild);
            });
    }

    protected onBuildChange = (event, index, value) => {
        let selectedBuild = this.state.builds.filter(b => b.url === value)[0];
        this.setState({ selectedBuild: selectedBuild });
        this.props.onBuildChange(selectedBuild);
    }

    public componentDidMount() {
        this.props.onComponentsChange(this.state.selectedComponents);
    }
}
