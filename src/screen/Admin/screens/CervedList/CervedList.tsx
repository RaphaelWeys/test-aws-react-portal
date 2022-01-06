import { Space } from 'antd';
import React, { FC, useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

import CommonButton from '../../../../components/CommonButton';
import InputText from '../../../../components/Input/Text';
import ModalPending from '../../../../components/Modal/ModalPending';
import { useGetCerved } from '../../../../endpoints/admin/cerved/useGetCerved';
import { Margin } from '../../../../style/utils';

interface IProps {
  className?: string;
}

interface FormData {
  codiceFiscale: string;
}

const CervedList: FC<IProps> = ({ className }) => {
  const { register, control, errors, handleSubmit, watch } = useForm<FormData>();
  const { codiceFiscale } = watch(['codiceFiscale']);
  const { refetch: getCervedScore, data: scoreResponse, isLoading } = useGetCerved(codiceFiscale);

  useEffect(() => {
    register({ name: 'codiceFiscale' }, { required: true });
  }, [register]);

  const onSubmit = useCallback(() => {
    getCervedScore();
  }, [getCervedScore]);

  return (
    <div className={className}>
      <Space direction="vertical" size="large">
        <div>
          <h2>Cerved Company Score</h2>
          <p>
            <span className="warning">Keep in mind that each request costs about 4 euros</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            as={InputText}
            name="codiceFiscale"
            control={control}
            error={errors.codiceFiscale}
            label="Supplier naTax code (11 digits, just digits, no IT)"
            htmlFor="codiceFiscale"
            autoFocus
          />

          <Margin mt={10}>
            <CommonButton htmlType="submit">Get Score</CommonButton>
          </Margin>
        </form>
        {scoreResponse && (
          <div>
            <h4>Cerved response</h4>
            {!scoreResponse.score && (
              <div>
                <b>No response for this company</b>
              </div>
            )}
            {scoreResponse.score && (
              <Space direction="vertical">
                <p>Name: {scoreResponse.scoreInfo.companyDataPacket.companyData.companyName}</p>
                <p>
                  Score: {scoreResponse.score} - {} {scoreResponse.scoreInfo.creditCheckInfo.trafficLight}
                  <br />
                  {scoreResponse.scoreInfo.creditCheckInfo.scoreCard.classDescription}
                  <br />
                  {scoreResponse.scoreInfo.creditCheckInfo.scoreCard.classDescriptionDetailed}
                </p>
              </Space>
            )}
          </div>
        )}
      </Space>

      {isLoading && <ModalPending content="Please wait..." />}
    </div>
  );
};

export default styled(CervedList)``;
