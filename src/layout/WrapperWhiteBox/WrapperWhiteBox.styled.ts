import styled, { css } from 'styled-components';
import '../../components/InvisibleButton/InvisibleButton';
import InvisibleButton from '../../components/InvisibleButton';

export const ButtonClose = styled(InvisibleButton)`
  ${({ theme: { colors } }) => css`
    color: ${colors.baseColor};
    font-weight: bold;
  `}
`;

export const NavigationIcon = styled.div<{ align: 'left' | 'right' }>`
  ${({ align }) => css`
    margin-bottom: 20px;
    margin-top: -40px;
    display: flex;
    justify-content: ${align === 'left' ? 'flex-start' : 'flex-end'};
    width: 100%;
  `}
`;
