import React, { FC } from 'react';
import styled from 'styled-components';
import { ModalProps } from 'antd/lib/modal';

import Modal from '../Modal';

type IProps = {
  className?: string;
  content: string | React.ReactNode;
} & ModalProps;

const ModalPending: FC<IProps> = ({ className, content, ...modalProps }) => {
  return (
    <Modal className={className} closable={false} size="small" {...modalProps}>
      {content}
    </Modal>
  );
};

export default styled(ModalPending)``;
