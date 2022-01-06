import { createGlobalStyle, css } from 'styled-components';

export default createGlobalStyle`
${({ theme: { breakpoints } }) => css`
  #root {
    height: 100%;
  }

  body {
    overscroll-behavior-y: none;
    font-size: 1rem;
    font-family: 'Open Sans', serif;
    background: #fafafa;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .ant-space-vertical {
    width: 100%;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
  }
  h2 {
    font-size: 1.25rem;
    margin: 0;
  }
  p {
    font-size: 1rem;
    margin: 0;
  }

  @media (max-width: ${breakpoints.xs}) {
    html {
      font-size: 12px;
    }
  }

  @media (min-width: ${breakpoints.xs}) {
    html {
      font-size: 13px;
    }
  }

  @media (min-width: ${breakpoints.md}) {
    html {
      font-size: 14px;
    }
  }

  @media (min-width: ${breakpoints.lg}) {
    html {
      font-size: 15px;
    }
  }

  @media (min-width: ${breakpoints.xl}) {
    html {
      font-size: 16px;
    }
  }

  // CUSTOM COLLAPSE ANT DESIGN
  .ant-collapse > .ant-collapse-item,
  .ant-collapse-content {
    border: none;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 16px 0 0;
  }

  // CUSTOM POPOVER HEADER ANT DESIGN
  .ant-popover-placement-bottomRight {
    .ant-popover-title,
    .ant-popover-inner-content {
      padding: 0;
    }
    .ant-popover-inner {
      padding: 33px 30px;
      border-radius: 7px;
    }
  }

  // CUSTOM POPOVER ADMIN TEMPLATE ANT DESIGN
  .ant-popover-placement-bottomLeft {
    .ant-popover-message {
      padding: 4px 0;
    }
  }

  // RESPONSIVE ANT ALERT
  .ant-alert {
    font-size: 0.85rem;
  }

  .ant-modal-title h1 {
    font-size: 1.6rem;
  }
`}
`;
