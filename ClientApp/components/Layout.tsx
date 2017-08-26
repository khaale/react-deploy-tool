import * as React from 'react';
import AppBar from 'material-ui/AppBar';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div>
            <AppBar
                title="Deploy Tool"
            />
            <div>
                { this.props.children }
            </div>
        </div>;
    }
}
