import React, { FC } from 'react';
import styled from 'styled-components';
import { Space } from 'antd';

import SafeHTMLTranslate from '../SafeHTMLTranslate';

interface Props {
  className?: string;
  title: string;
  description: string;
  extra?: React.ReactNode;
}

const InfoStatusRfo: FC<Props> = ({ className, title, description, extra }) => {
  return (
    <Space className={className} size="middle" direction="vertical" style={{ width: '100%' }}>
      <Space direction="vertical">
        <div className="title">{title}</div>
        <SafeHTMLTranslate template={description} />
      </Space>
      {extra && extra}
    </Space>
  );
};

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
