import { Space } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';

import SafeHTMLTranslate from '../SafeHTMLTranslate';

interface Props {
  className?: string;
  title: string;
  description: string;
  extra?: React.ReactNode;
}

const InfoStatusRfo: FC<Props> = ({ className, title, description, extra }) => (
    <Space className={className} direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space direction="vertical">
        <div className="title">{title}</div>
        <SafeHTMLTranslate template={description} />
      </Space>
      {extra && extra}
    </Space>
  );

export default styled(InfoStatusRfo)`
  background: #d3b9a0;
  padding: 20px;
  color: white;

  .title {
    font-size: 2rem;
    color: white;
    font-weight: bold;
  }
`;
