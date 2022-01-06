import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  template: string;
  Type?: string;
}

const SafeHTMLTranslate: FC<Props> = ({ template, Type = 'div', ...props }) => {
  const [t] = useTranslation();
  let text = t(template, { interpolation: { escapeValue: false } });
  // text = text.split('\n').join('<br />').split('\r').join('<br />');

  return (
    <Type
      // @ts-ignore
      dangerouslySetInnerHTML={{
        __html: text.includes('[html]') ? text.substring(6) : text,
      }}
      {...props}
    />
  );
};

export default SafeHTMLTranslate;
