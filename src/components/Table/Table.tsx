import { Table as TableAnt } from 'antd';
import { TableProps } from 'antd/lib/table';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';

import useDesktop from '../../hooks/useDesktop';
import { Error } from '../../style/utils';
import { getErrorMessage } from '../../utils/input';

type Props = {
  className?: string;
  error?: FieldError;
  hasScroll?: boolean;
} & TableProps<any>;

const Table: FC<Props> = ({ className, error, hasScroll = true, ...tableProps }) => {
  const isDesktop = useDesktop();

  return (
    <div className={className}>
      <TableAnt
        size={isDesktop ? 'middle' : 'small'}
        {...tableProps}
        pagination={{
          hideOnSinglePage: true,
        }}
        scroll={hasScroll && { x: true }}
      />
      {error && <Error data-testid="inputError">{error && getErrorMessage(error, 'table')}</Error>}
    </div>
  );
};

export default styled(Table)<{ isClickable?: boolean }>`
  ${({ theme: { colors, fontSize }, isClickable = true }) => css`
    width: 100%;

    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: unset;
      cursor: ${isClickable ? 'pointer' : 'default'};
    }

    .ant-table-thead > tr {
      font-size: ${fontSize.small};
      & > th {
        color: ${colors.grayDark};
        white-space: nowrap;
        background: unset;
        border-bottom: 1px solid ${colors.gray};
        text-transform: uppercase;
      }
    }

    .ant-table-tbody > tr {
      font-size: ${fontSize.regular};
      & > td {
        color: ${colors.grayDark};
        white-space: nowrap;
        border-bottom: 1px solid ${colors.gray};
        vertical-align: middle;
      }
    }
  `}
`;
