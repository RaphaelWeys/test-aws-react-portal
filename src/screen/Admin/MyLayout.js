import React from 'react';
import { Layout } from 'react-admin';

const MyLayout = ({ children, ...props }) => <Layout {...props}>{children}</Layout>;

export default MyLayout;
