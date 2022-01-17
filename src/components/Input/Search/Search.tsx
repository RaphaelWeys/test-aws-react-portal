import { Input } from 'antd';
import React from 'react';
import styled, { css } from 'styled-components';

import useDesktop from '../../../hooks/useDesktop';

const InputSearch = ({ className, ...props }) => {
  const isDesktop = useDesktop();
  const { Search } = Input;

  return <Search className={className} size={isDesktop ? 'large' : 'middle'} {...props} />;
};

export default styled(InputSearch)`
  ${({ theme: { colors } }) => css`
    & {
      border-radius: 4px;

      .ant-input {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background: ${colors.whiteDark};
        border: 1px solid #d9d9d9;

        &:focus,
        :hover {
          border-color: #d9d9d9;
          box-shadow: none;
        }
      }

      .ant-input-affix-wrapper {
        background: #fafafa;
      }

      .anticon.ant-input-clear-icon svg {
        fill: ${colors.baseColor};
      }

      button {
        border-radius: 0 4px 4px 0 !important;
        background: ${colors.gray};
        border: 1px solid #d9d9d9;
        border-color: transparent !important;
        pointer-events: none;

        :hover {
          outline: 0;
          border-color: #d9d9d9;
          background: ${colors.gray};
        }
      }

      svg {
        transform: scaleX(-1);
        fill: ${colors.white};
      }
    }
  `}
`;
