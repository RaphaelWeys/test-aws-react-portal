import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import Cookies from 'js-cookie';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { DisplayErrorType } from '../../style/utils';
import { getErrorMessage } from '../../utils/input';

type Props = {
  className?: string;
  isDesktop?: boolean;
  label?: string;
  error?: FieldError;
} & UploadProps;

const UploadButton: FC<Props> = ({ className, label, error, ...props }) => {
  const tokenName = process.env.REACT_APP_JWT_COOKIE || 'yem_jwt';
  const token = Cookies.get(tokenName);

  return (
    <div className={className}>
      <Upload
        headers={{
          Authorization: `Bearer ${token}`,
        }}
        {...props}
      >
        <Button>
          <UploadOutlined /> {label}
        </Button>
      </Upload>
      {error && <DisplayErrorType data-testid="inputError">{getErrorMessage(error, 'upload')}</DisplayErrorType>}
    </div>
  );
};

export default styled(UploadButton)<Props>`
  ${({ theme: { colors } }) => css`
    .ant-btn {
      color: ${colors.baseColor};
      border-radius: 32px;
      border: 1px solid ${colors.baseColor};
    }
  `}
`;
