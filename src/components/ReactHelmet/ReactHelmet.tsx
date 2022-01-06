import React from 'react';
import { Helmet } from 'react-helmet';

import defaultFavicon from '../../assets/app-marketplace.svg';
import { useTenant } from '../../context/TenantContext';

const ReactHelmet = () => {
  const { favicon, siteTitle } = useTenant();

  return (
    <div>
      <Helmet>
        <link href={favicon || defaultFavicon} rel="icon" />
        <title>{siteTitle || 'YEM Portal'}</title>
      </Helmet>
    </div>
  );
};
export default ReactHelmet;
