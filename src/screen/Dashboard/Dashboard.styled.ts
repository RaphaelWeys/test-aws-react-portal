import styled from 'styled-components';

export const WrapperApps = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const App = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;

  & + & {
    margin-left: 50px;
  }

  > img {
    height: 20rem;
  }
  
  > div {
    padding: 0 20px;
  }
`;

export const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;
`;

export const TitleNotification = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-top: 25px;
  margin-bottom: 30px;
  letter-spacing: 2px;
`;
