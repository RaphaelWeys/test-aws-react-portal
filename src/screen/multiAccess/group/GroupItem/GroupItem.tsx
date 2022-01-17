import { CloseOutlined } from '@material-ui/icons';
import { Col, Row } from 'antd';
import React from 'react';
import styled, { ThemeContext } from 'styled-components';

import InvisibleButton from '../../../../components/InvisibleButton';
import { TextRegular } from '../../../../style/utils';

const Wrapper = styled.div`
  padding: 16px 0;
  padding-left: 10px;
  padding-right: 20px;
  border-top: 1px solid #ced5db;
`;

const GroupItem = ({ name, id, onDelete }) => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <Wrapper>
      <Row justify="space-between">
        <Col>
          <TextRegular>{name}</TextRegular>
        </Col>
        <Col>
          <InvisibleButton onClick={() => onDelete(id)}>
            <CloseOutlined style={{ color: themeContext.colors.baseColor }} />
          </InvisibleButton>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default GroupItem;
