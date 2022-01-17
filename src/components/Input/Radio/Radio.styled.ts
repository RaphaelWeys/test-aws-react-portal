import { WarningOutlined } from '@ant-design/icons';
import styled, { css } from 'styled-components';

export const WarningOutlinedStyled = styled(WarningOutlined)`
  ${({ theme: { colors } }) =>
    css`
      color: ${colors.baseColor};
    `}
`;
