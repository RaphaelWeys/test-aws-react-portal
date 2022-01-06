import React from 'react';
import { Layout } from 'react-admin';
import styled from 'styled-components';

import CustomAppBar from './CustomAppBar';
import CustomSideBar from './CustomSideBar';

const WrapperContent = styled.div`
  padding-top: 1.2em;
`;

const MyLayout = ({ children, ...props }) => (
  <Layout {...props} appBar={CustomAppBar} sidebar={CustomSideBar}>
    <WrapperContent>{children}</WrapperContent>
  </Layout>
);

export default MyLayout;
