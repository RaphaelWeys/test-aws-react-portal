import styled, { css } from 'styled-components';
import { WarningOutlined } from '@ant-design/icons';

export const WarningOutlinedStyled = styled(WarningOutlined)`
  ${({ theme: { colors } }) =>
    css`
      color: ${colors.baseColor};
    `}
`;
