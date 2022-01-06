import React from 'react';
import styled from 'styled-components';

const FixedContent = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
`;

const CustomSideBar = ({ children, className }) => {
  return (
    <div className={className}>
      <FixedContent>{children}</FixedContent>
    </div>
  );
};

export default styled(CustomSideBar)`
  height: 100%;
  width: 240px;
`;
