import { Modal as ModalAnt,Space } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { FC } from 'react';
import styled from 'styled-components';

import { HeaderOne } from '../../style/utils';

interface Props extends Omit<ModalProps, 'width'> {
  className?: string;
  icon?: JSX.Element;
  size: 'small' | 'large';
}

const Modal: FC<Props> = ({ className, children, title, icon, size, ...modalProps }) => {
  const width = React.useMemo(() => {
    switch (size) {
      case 'small':
        return 660;
      case 'large':
        return 960;
      default:
        throw new Error(`This size: ${size} is not handled by the modal`);
    }
  }, [size]);

  return (
    <ModalAnt
      centered
      closable
      visible
      className={className}
      footer={false}
      title={
        <Space size="middle">
          {icon && icon}
          {title && <HeaderOne>{title}</HeaderOne>}
        </Space>
      }
      width={width}
      {...modalProps}
    >
      {children}
    </ModalAnt>
  );
};

export default styled(Modal)`
  .ant-modal-header {
    border-radius: 6px 6px 0 0;
    padding: 2.3rem 2.3rem 1rem;
  }

  .ant-modal-body {
    padding: 0 2.3rem 1.5rem;
    border-radius: 6px 6px 0 0;
  }

  .ant-modal-content {
    border-radius: 6px;
  }

  .ant-modal-footer,
  .ant-modal-header {
    border-top: none;
    border-bottom: none;
  }
`;
