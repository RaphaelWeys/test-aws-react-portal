import styled from 'styled-components';

export const WrapperFooter = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;

  > :last-child{
    margin-left: 10px;
  }
  
  > :first-child {
    margin-right: auto;

    &:hover {
      color: #ff0000;
      background-color: #fff;
      border-color: #ff0000;
    }
  }
`;
