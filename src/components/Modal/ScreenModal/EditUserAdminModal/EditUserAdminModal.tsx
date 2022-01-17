import { Space } from 'antd';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useGetUser } from '../../../../endpoints/admin/users/useGetUser';
import { Margin } from '../../../../style/utils';
import CommonButton from '../../../CommonButton';
import { Input } from '../../../Input';
import Radio from '../../../Input/Radio';
import InputText from '../../../Input/Text';
import Loader from '../../../Loader';
import RangePicker from '../../../RangePicker';
import Modal from '../../Modal';
import { WrapperFooter } from './EditUserAdminModal.styled';

interface IProps {
  className?: string;
  toggleModal: () => void;
  userLight: any;
  deleteUser: () => void;
  updateUser: (user) => void;
}

export interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  companyField: string;
  username: string;

  yopSubsriptionPeriod: any;
  yopContracts: number;
}

const EditUserAdminModal: FC<IProps> = ({ className, toggleModal, userLight, deleteUser, updateUser }) => {
  const [t] = useTranslation();
  const [freemiumOrPremium, setFreemiumOrPremium] = useState('');
  const { isLoading: getUserLoading, data: user } = useGetUser(userLight.id);
  const { register, unregister, control, reset, handleSubmit, errors, setValue } = useForm<FormData>();

  const subscriptionStart = useMemo(() => user?.products?.follow?.subscriptionStart, [user]);
  const subscriptionEnd = useMemo(() => user?.products?.follow?.subscriptionEnd, [user]);
  const maxContracts = useMemo(() => user?.products?.follow?.contracts, [user]);

  useEffect(() => {
    register({ name: 'firstName' }, { required: true });
    register({ name: 'lastName' }, { required: true });
    register({ name: 'company' });
    register({ name: 'companyField' });
    register({ name: 'username' }, { required: true });
  }, [register]);

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        yopSubsriptionPeriod: subscriptionStart ? [moment(subscriptionStart), moment(subscriptionEnd)] : null,
        yopContracts: maxContracts || 0,
      });
    }
  }, [user, reset, subscriptionStart, subscriptionEnd, maxContracts]);

  useEffect(() => {
    if (user) {
      const isPremium = !!user?.products?.follow;
      setFreemiumOrPremium(isPremium ? 'premium' : 'freemium');
    }
  }, [user, setValue]);

  useEffect(() => {
    if (freemiumOrPremium === 'freemium') {
      unregister(['yopSubsriptionPeriod', 'yopContracts']);
    }
    if (freemiumOrPremium === 'premium') {
      register({ name: 'yopContracts' }, { required: true });
      // @ts-ignore
      register(
        { name: 'yopSubsriptionPeriod' },
        {
          validate: (value) => (value ? undefined : 'Period required'),
        },
      );
    }
  }, [freemiumOrPremium, register, unregister]);

  const onSubmit = useCallback(
    (data: FormData) => {
      const products = user.products || {
        follow: undefined,
      };

      if (freemiumOrPremium === 'freemium') {
        if (products) {
          products.follow = undefined;
        }
      }

      if (freemiumOrPremium === 'premium') {
        if (!products.follow) products.follow = {};

        products.follow.contracts = parseInt(data.yopContracts.toString(), 10);
        products.follow.subscriptionStart = data.yopSubsriptionPeriod[0].format('YYYY-MM-DD');
        products.follow.subscriptionEnd = data.yopSubsriptionPeriod[1].format('YYYY-MM-DD');
      }

      const updatedData = {
        ...data,
        products,
      };

      updateUser(updatedData);
    },
    [user.products, freemiumOrPremium, updateUser],
  );

  return (
    <div className={className}>
      <Modal
        visible
        className={className}
        closable={false}
        getContainer={false}
        size="large"
        title={t('modal-edit-user-title')}
        onCancel={(): void => toggleModal()}
      >
        {getUserLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space direction="vertical">
              <Space size="large">
                <Controller
                  autoFocus
                  as={Input}
                  control={control}
                  error={errors.firstName}
                  htmlFor="firstName"
                  label={t('modal-edit-user-input-firstname')}
                  name="firstName"
                  type="text"
                />
                <Controller
                  as={Input}
                  control={control}
                  error={errors.lastName}
                  htmlFor="lastName"
                  label={t('modal-edit-user-input-lastname')}
                  name="lastName"
                  type="text"
                />
              </Space>
              <Space size="large">
                <Controller
                  as={Input}
                  control={control}
                  error={errors.company}
                  htmlFor="company"
                  label={t('modal-edit-user-input-company')}
                  name="company"
                  type="text"
                />
                <Controller
                  as={Input}
                  control={control}
                  htmlFor="companyField"
                  label={t('modal-edit-user-input-companyField')}
                  name="companyField"
                  type="text"
                />
              </Space>
              <Controller
                as={Input}
                control={control}
                error={errors.username}
                htmlFor="username"
                label={t('modal-edit-user-input-username')}
                name="username"
                type="text"
              />
              <div>
                <h3>
                  <b>Marketplace</b>
                </h3>
                <p>Nothing to edit yet.</p>
              </div>
              <div>
                <h3>
                  <b>YEM Optimization</b>
                </h3>
                <Space size="large">
                  <Radio
                    items={[
                      { value: 'freemium', label: 'Freemium', key: 0 },
                      { value: 'premium', label: 'Premium', key: 1 },
                    ]}
                    label="Subscription status"
                    value={freemiumOrPremium}
                    onChange={(e) => setFreemiumOrPremium(e.toString())}
                  />
                  <div>
                    {freemiumOrPremium === 'freemium' ? (
                      <Space size="middle">
                        <div>{t('modal-edit-user-optimization-no-subscription')}</div>
                      </Space>
                    ) : (
                      <div>
                        <Space size="middle">
                          <Controller
                            allowEmpty={[false, false]}
                            as={RangePicker}
                            control={control}
                            error={errors.yopSubsriptionPeriod}
                            format="ll"
                            label="Subscription period"
                            name="yopSubsriptionPeriod"
                          />
                        </Space>
                        <Space size="middle">
                          <Controller
                            as={InputText}
                            control={control}
                            error={errors.yopContracts}
                            label="Contracts allowed"
                            max="100"
                            min="1"
                            name="yopContracts"
                            step="1"
                            type="number"
                          />
                        </Space>
                      </div>
                    )}
                  </div>
                </Space>
              </div>
            </Space>

            <Margin mt={10}>
              <WrapperFooter>
                <CommonButton onClick={deleteUser}>{t('modal-edit-user-delete')}</CommonButton>
                <CommonButton onClick={toggleModal}>{t('modal-edit-user-cancel')}</CommonButton>
                <CommonButton htmlType="submit" type="primary">
                  {t('modal-edit-user-save')}
                </CommonButton>
              </WrapperFooter>
            </Margin>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default styled(EditUserAdminModal)``;
