import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import moment from 'moment';

import { useGetUser } from '../../../../endpoints/admin/users/useGetUser';
import { AlignItems, Margin } from '../../../../style/utils';
import CommonButton from '../../../CommonButton';
import { Input } from '../../../Input';
import Radio from '../../../Input/Radio';
import Loader from '../../../Loader';
import RangePicker from '../../../RangePicker';
import Modal from '../../Modal';
import { WrapperFooter } from './EditUserAdminModal.styled';
import InputText from '../../../Input/Text';

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
        yopContracts: maxContracts ? maxContracts : 0,
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
          validate: (value) => {
            return value ? undefined : 'Period required';
          },
        },
      );
    }
  }, [freemiumOrPremium, register, unregister]);

  const onSubmit = useCallback(
    (data: FormData) => {
      let products = user.products || {
        follow: undefined,
      };

      if (freemiumOrPremium === 'freemium') {
        if (products) {
          products.follow = undefined;
        }
      }

      if (freemiumOrPremium === 'premium') {
        if (!products.follow) products.follow = {};

        products.follow.contracts = parseInt(data.yopContracts.toString());
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
        onCancel={(): void => toggleModal()}
        closable={false}
        title={t('modal-edit-user-title')}
        className={className}
        getContainer={false}
        size="large"
      >
        {getUserLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlignItems direction="column" align="stretch" space={5}>
              <AlignItems space={24}>
                <Controller
                  as={Input}
                  name="firstName"
                  htmlFor="firstName"
                  label={t('modal-edit-user-input-firstname')}
                  control={control}
                  error={errors.firstName}
                  type="text"
                  autoFocus
                />
                <Controller
                  as={Input}
                  name="lastName"
                  htmlFor="lastName"
                  label={t('modal-edit-user-input-lastname')}
                  control={control}
                  error={errors.lastName}
                  type="text"
                />
              </AlignItems>
              <AlignItems space={24}>
                <Controller
                  as={Input}
                  name="company"
                  htmlFor="company"
                  label={t('modal-edit-user-input-company')}
                  control={control}
                  error={errors.company}
                  type="text"
                />
                <Controller
                  as={Input}
                  name="companyField"
                  htmlFor="companyField"
                  label={t('modal-edit-user-input-companyField')}
                  control={control}
                  type="text"
                />
              </AlignItems>
              <Controller
                as={Input}
                name="username"
                htmlFor="username"
                label={t('modal-edit-user-input-username')}
                control={control}
                error={errors.username}
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
                <AlignItems align="flex-start" space={24} flex>
                  <Radio
                    label="Subscription status"
                    items={[
                      { value: 'freemium', label: 'Freemium', key: 0 },
                      { value: 'premium', label: 'Premium', key: 1 },
                    ]}
                    onChange={(e) => setFreemiumOrPremium(e.toString())}
                    value={freemiumOrPremium}
                  />
                  <div>
                    {freemiumOrPremium === 'freemium' ? (
                      <AlignItems space={15}>
                        <div>{t('modal-edit-user-optimization-no-subscription')}</div>
                      </AlignItems>
                    ) : (
                      <div>
                        <AlignItems space={15}>
                          <Controller
                            as={RangePicker}
                            label="Subscription period"
                            name="yopSubsriptionPeriod"
                            allowEmpty={[false, false]}
                            format="ll"
                            control={control}
                            error={errors.yopSubsriptionPeriod}
                          />
                        </AlignItems>
                        <AlignItems space={15}>
                          <Controller
                            as={InputText}
                            name="yopContracts"
                            control={control}
                            error={errors.yopContracts}
                            label="Contracts allowed"
                            type="number"
                            step="1"
                            min="1"
                            max="100"
                          />
                        </AlignItems>
                      </div>
                    )}
                  </div>
                </AlignItems>
              </div>
            </AlignItems>

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
