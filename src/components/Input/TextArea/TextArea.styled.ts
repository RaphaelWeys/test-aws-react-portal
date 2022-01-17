import { Input } from 'antd';
import styled from 'styled-components';

export const WrapperInputText = styled.div`
  flex: 1;
`;

export const InputStyled = styled(Input)`
  height: 2.5rem;
  background: #f7f7f7;
  border: none;
  font-size: 0.87rem;
`;

export const InputPasswordStyled = styled(Input.Password)`
  height: 2.5rem;
  background: #f7f7f7;
  border: none;
  font-size: 0.87rem;

  & > input {
    background: #f7f7f7;
  }
`;

export const PositionRelative = styled.div`
  position: relative;
`;
