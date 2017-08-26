import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Deploy } from './components/Deploy';

export const routes = <Layout>
    <Route path='/' component={Deploy} />
</Layout>;
