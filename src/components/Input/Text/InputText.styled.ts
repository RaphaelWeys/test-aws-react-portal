import { LoadingOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import styled from 'styled-components';

export const WrapperInputText = styled.div`
  flex: 1;
`;

export const InputStyled = styled(Input)`
  background: #fafafa;
  border-radius: 4px;
`;

export const InputPasswordStyled = styled(Input.Password)`
  background: #fafafa;
  border-radius: 4px;
  & > input {
    background: #fafafa;
  }
`;

export const PositionRelative = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const WrapperSpinner = styled(LoadingOutlined)`
  position: absolute;
  right: 1rem;
`;
