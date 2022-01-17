import 'draft-js/dist/Draft.css';

import { Checkbox, Divider, Input, Modal } from 'antd';
import React, { useMemo, useState } from 'react';

import { Translation } from '../../../endpoints/admin/translation/useGetTranslations';
import RichEditorExample from '../../../screen/Admin/components/Wysiwyg';

const { TextArea } = Input;

interface Props {
  translation: Translation;
  onSaveTranslation: (key: string, value: string) => void;
  onClose: () => void;
}

const ModalTranslation = ({ translation, onSaveTranslation, onClose }: Props) => {
  const { key, english, local, custom } = translation;
  const [value, setValue] = useState<string>(custom || '');
  const hasCustomHtmlTag = custom.includes('[html]');
  const isAlertTooltip = custom.includes('[html]!');
  const [checkboxValueHtml, setCheckboxValueHtml] = useState(hasCustomHtmlTag);
  const [checkboxValueTooltip, setCheckboxValueTooltip] = useState(isAlertTooltip);
  const hasCorrectPrefix = useMemo(() => key.endsWith('-info') || key.endsWith('-tooltip') || key.endsWith('-advice'), [
    key,
  ]);
  const isTooltip = useMemo(() => key.endsWith('-tooltip'), [key]);

  const handleSave = () => {
    let content = value;
    if (checkboxValueHtml)
      if (checkboxValueTooltip) content = value.replace('[html]', '[html]!');
      else content = value.replace('[html]!', '[html]');
    onSaveTranslation(key, content);
  };

  return (
    <Modal visible title={`Translate key: ${key}`} width={1000} onCancel={onClose} onOk={() => handleSave()}>
      <p>{`English: ${english}`}</p>
      <Divider />
      <p>{`Default: ${local}`}</p>
      <Divider />
      {isTooltip && (
        <div style={{ marginBottom: '8px' }}>
          <Checkbox checked={checkboxValueTooltip} onChange={(e) => setCheckboxValueTooltip(e.target.checked)}>
            Tooltip is Alert
          </Checkbox>
        </div>
      )}
      {hasCorrectPrefix && (
        <div style={{ marginBottom: '8px' }}>
          <Checkbox checked={checkboxValueHtml} onChange={(e) => setCheckboxValueHtml(e.target.checked)}>
            Html content
          </Checkbox>
        </div>
      )}

      {checkboxValueHtml && hasCorrectPrefix ? (
        <RichEditorExample setValue={setValue} value={value} />
      ) : (
        <TextArea autoFocus autoSize={{ minRows: 2 }} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </Modal>
  );
};

export default ModalTranslation;
