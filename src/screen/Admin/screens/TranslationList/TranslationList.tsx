import capitalize from 'lodash/capitalize';
import React from 'react';

import { Translation, useGetTranslations } from '../../../../endpoints/admin/translation/useGetTranslations';
import { useUpdateTranslation } from '../../../../endpoints/admin/translation/useUpdateTranslation';
import { ChoiceFilter, InputStyled } from './TranslationList.styled';
import Table from '../../../../components/Table';
import Select from '../../../../components/Select';
import { Checkbox } from '../../../../components/Input';
import ModalTranslation from '../../../../components/Modal/ModalTranslation';
import { AdminLanguageItems } from '../../../../config/app-config';

const TranslationsList = () => {
  const [lang, setLang] = React.useState<string>('en');
  const [app, setApp] = React.useState<string>('portal');
  const [checkboxValue, setCheckboxValue] = React.useState<boolean>(false);
  const [rowClicked, setRowClicked] = React.useState<Translation>();
  const [filterInput, setFilterInput] = React.useState<Record<string, string>>({
    key: '',
    english: '',
    local: '',
    custom: '',
  });
  const { data: translations, isLoading: translationsIsLoading } = useGetTranslations(app, lang);
  const { mutate: updateTranslation } = useUpdateTranslation(app, lang);

  const onSaveTranslation = (key: string, text: string) => {
    updateTranslation({ key, text });
    setRowClicked(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;

    setFilterInput((fi) => ({
      ...fi,
      [key]: value,
    }));
  };

  const getHeaderTable = () => {
    const defaultHeader = ['key', 'local', 'custom'];

    if (lang !== 'en') {
      defaultHeader.splice(1, 0, 'english');
    }

    return defaultHeader.map((key) => ({
      title: (
        <div>
          <div>{capitalize(key)}</div>
          <InputStyled value={filterInput[key]} onChange={(e) => handleChange(e, key)} />
        </div>
      ),
      dataIndex: key,
      width: `${100 / defaultHeader.length}%`,
    }));
  };

  const filteredData = () => {
    const fnChecked = [] as ((v: Translation) => boolean)[];

    if (checkboxValue) fnChecked.push((record) => record.custom === '');
    if (filterInput.key) fnChecked.push((record) => !!record.key.match(new RegExp(filterInput.key, 'gmi')));
    if (filterInput.english) fnChecked.push((record) => !!record.english.match(new RegExp(filterInput.english, 'gmi')));
    if (filterInput.local) fnChecked.push((record) => !!record.local.match(new RegExp(filterInput.local, 'gmi')));
    if (filterInput.custom) fnChecked.push((record) => !!record.custom.match(new RegExp(filterInput.custom, 'gmi')));

    return (translations || []).filter((translation) => fnChecked.every((fn) => fn(translation)));
  };

  return (
    <>
      <ChoiceFilter>
        <Select
          value={app}
          onChange={setApp}
          items={[
            { label: 'Optimization', value: 'follow', key: '0' },
            { label: 'Portal', value: 'portal', key: '1' },
            { label: 'Marketplace', value: 'tender', key: '2' },
          ]}
          style={{ width: '140px' }}
        />
        <Select value={lang} onChange={setLang} items={AdminLanguageItems} style={{ width: '120px' }} />
        <Checkbox checked={checkboxValue} customOnChange={setCheckboxValue}>
          Show only missing translations
        </Checkbox>
      </ChoiceFilter>

      <Table
        onRow={(record) => ({
          onDoubleClick: () => {
            setRowClicked(record);
          },
        })}
        bordered
        dataSource={filteredData()}
        columns={getHeaderTable()}
        loading={translationsIsLoading}
      />

      {rowClicked && (
        <ModalTranslation
          translation={rowClicked}
          onClose={() => setRowClicked(undefined)}
          onSaveTranslation={onSaveTranslation}
        />
      )}
    </>
  );
};

export default TranslationsList;
