import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { SelectValue } from 'antd/es/select';
import capitalize from 'lodash/capitalize';
import moment, { Moment } from 'moment';
import React, { FC, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';

import InputNumber from '../../../../components/Input/Number';
import InputText from '../../../../components/Input/Text';
import InvisibleButton from '../../../../components/InvisibleButton';
import RangePicker from '../../../../components/RangePicker/RangePicker';
import Select from '../../../../components/Select';
import Table from '../../../../components/Table';
import { useCreateCoupon } from '../../../../endpoints/admin/coupon/useCreateCoupon';
import { useDeleteCoupon } from '../../../../endpoints/admin/coupon/useDeleteCoupon';
import { useGetCoupons } from '../../../../endpoints/admin/coupon/useGetCoupons';
import { useGetUserList } from '../../../../endpoints/admin/coupon/useGetUserList';
import { useUpdateCoupon } from '../../../../endpoints/admin/coupon/useUpdateCoupon';
import { Coupon, CouponOrder, CouponRaw } from '../../../../interface/coupon';
import { UserInfoLight } from '../../../../interface/user';
import { InputStyled, WrapperAction } from './CouponList.styled';

interface Props {
  className?: string;
}
const SHOW_ALL = 'all';
const TRUE = 'true';
const FALSE = 'false';
const ALL = 'all';
const TENDER = 'tender';
const FOLLOW = 'follow';

interface CouponDisplayed {
  id: string;
  key: number;
  app: string | React.ReactElement;
  code: string | React.ReactElement;
  purpose: string | React.ReactElement;
  date: string | React.ReactElement;
  multipleUsage: string | React.ReactElement;
  user?: string | React.ReactElement;
  value: string | React.ReactElement;
}

interface IFormattedCouponOrder {
  app: string;
  purpose: string;
  product: string;
  reference: string;
  date: string;
  amount: string;
  username?: string;
  user: string;
  company?: string;
  key: number;
}

interface IFormData {
  code: string;
  app: string;
  purpose: string;
  value: string;
  user: string;
  date: (Moment | null)[];
  multipleUsage: string;
}

interface IFilterInputValue {
  code: string;
  app: string;
  value: string;
  user: string;
  date: (string | null)[];
  multipleUsage: string;
  order: string;
}

const filterSelectOptions = {
  app: [SHOW_ALL, FOLLOW, TENDER],
  multipleUsage: [SHOW_ALL, TRUE, FALSE],
};

const filterInputValue: IFilterInputValue = {
  code: '',
  app: filterSelectOptions.app[0],
  value: '',
  user: '',
  date: [],
  multipleUsage: filterSelectOptions.multipleUsage[0],
  order: '',
};

const widthTD = [15, 10, 10, 10, 25, 35, 10, 5];
const optionsMultipleNewRow = [FALSE, TRUE];
const optionsAppNewRow = [ALL, TENDER, FOLLOW];

const defaultValues = {
  app: optionsAppNewRow[0],
  multipleUsage: optionsMultipleNewRow[0],
  value: '0',
};

const CouponList: FC<Props> = ({ className }) => {
  const [isAddingRow, setIsAddingRow] = React.useState(false);
  const [selectedOrders, setSelectedOrders] = React.useState<CouponOrder[]>();
  const [selectedCoupon, setSelectedCoupon] = React.useState<CouponRaw>();
  const [rowExpanded, setRowExpanded] = React.useState<number[]>([-1]);
  const [filterInput, setFilterInput] = React.useState(filterInputValue);
  const queryClient = useQueryClient();
  const { data: coupons, isLoading: isGetCouponLoading } = useGetCoupons();
  const { data: userList } = useGetUserList();
  const { mutate: createCouponRequest, isLoading: createCouponLoading } = useCreateCoupon();
  const { mutate: editCouponRequest } = useUpdateCoupon(selectedCoupon?.id);
  const { mutate: deleteCoupon } = useDeleteCoupon();

  const { handleSubmit, register, control, errors, reset: resetForm } = useForm<IFormData>({
    defaultValues,
  });

  useEffect(() => {
    register({ name: 'code' }, { required: true });
    register({ name: 'app' });
    register({ name: 'purpose' });
    register({ name: 'value' }, { required: true });
    register({ name: 'user' });
    register({ name: 'date' });
    register({ name: 'multipleUsage' });
  }, [register]);

  useEffect(() => {
    if (selectedCoupon) {
      const validityStart = selectedCoupon.date?.split?.(' / ')[0];
      const validityEnd = selectedCoupon.date?.split?.(' / ')[1];

      resetForm({
        code: selectedCoupon.code,
        app: selectedCoupon.app,
        purpose: selectedCoupon.purpose,
        value: selectedCoupon.value.replace(' €', ''),
        user: selectedCoupon.userId,
        date: [
          validityStart ? moment(validityStart, 'DD-MM-YYYY') : null,
          validityEnd ? moment(validityEnd, 'DD-MM-YYYY') : null,
        ],
        multipleUsage: selectedCoupon.multipleUsage,
      });
    } else {
      resetForm({});
    }
  }, [resetForm, selectedCoupon]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;

    setFilterInput((fi) => ({ ...fi, [key]: value }));
  };

  const handleChangeRangePicker = (values: [Moment, Moment] | null, formatString: [string, string]) => {
    setFilterInput((fi) => ({
      ...fi,
      date: formatString,
    }));
  };

  const isValidKey = (key: string): key is keyof typeof filterSelectOptions => key in filterSelectOptions;

  const handleChangeSelect = (value: SelectValue, key: string) => {
    if (isValidKey(key))
      return setFilterInput((fi) => ({
        ...fi,
        [key]: value === filterSelectOptions[key][0] ? filterSelectOptions[key][0] : value,
      }));
  };

  const cancelAddRow = () => {
    setIsAddingRow(false);

    if (coupons) {
      queryClient.setQueryData('get-coupons', coupons.slice(1, coupons.length));
    }
  };

  const addCoupon = () => {
    setIsAddingRow(true);
    const newEmptyCoupon = {
      multipleUsage: false,
      _id: '',
      code: '',
      app: '',
      purpose: '',
      value: 0,
      validityStart: '',
      validityEnd: '',
      orders: [],
      createdAt: '',
      updatedAt: '',
      __v: 0,
      id: '',
    };

    if (coupons) {
      queryClient.setQueryData('get-coupons', [newEmptyCoupon, ...coupons]);
    }
    if (selectedCoupon) {
      setSelectedCoupon(undefined);
    }
    setFilterInput(filterInputValue);
  };

  const handleActivateEditMode = (couponSelected: CouponRaw) => {
    if (isAddingRow) {
      setIsAddingRow(false);

      if (coupons) {
        queryClient.setQueryData('get-coupons', coupons.slice(1, coupons.length));
      }
    }

    setSelectedCoupon(couponSelected);
  };

  const onSubmit = (data: IFormData) => {
    const validityStart = data.date?.[0];
    const validityEnd = data.date?.[1];

    const dataToSend = {
      id: '0',
      code: data.code.toUpperCase(),
      app: data.app === ALL ? null : data.app,
      purpose: data.purpose,
      value: parseInt(data.value, 10) || 0,
      user: data.user ? data.user : null,
      multipleUsage: data.multipleUsage === 'true',
      validityStart: validityStart ? moment(data.date?.[0], 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
      validityEnd: validityEnd ? moment(data.date?.[1], 'DD-MM-YYYY').format('YYYY-MM-DD') : null,
    };

    if (isAddingRow)
      createCouponRequest(dataToSend, {
        onSuccess() {
          setIsAddingRow(false);
        },
      });

    if (selectedCoupon) {
      editCouponRequest(dataToSend, {
        onSuccess() {
          setSelectedCoupon(undefined);
        },
      });
    }
  };

  const headerTable = () =>
    ['code', 'app', 'purpose', 'value', 'user', 'date', 'multipleUsage', 'actions'].map((key, index) => {
      let input: React.ReactNode | null = (
        <InputText
          data-testid={`${key}-test`}
          disabled={isAddingRow || !!selectedCoupon}
          label={key}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, key)}
        />
      );

      if (key === 'date') {
        input = (
          <RangePicker
            allowEmpty={[true, true]}
            customOnChange={handleChangeRangePicker}
            disabled={isAddingRow || !!selectedCoupon}
            format="DD-MM-YYYY"
            label={key}
          />
        );
      } else if (key === 'multipleUsage' || key === 'app')
        input = (
          <Select
            data-testid="select-filter-app"
            defaultValue={filterSelectOptions[key][0]}
            disabled={isAddingRow || !!selectedCoupon}
            items={filterSelectOptions[key].map((option) => ({
              label: capitalize(option),
              value: option,
            }))}
            label={key}
            style={{ width: '100px' }}
            onChange={(value: SelectValue) => handleChangeSelect(value, key)}
          />
        );

      return {
        title: key !== 'actions' && input,
        dataIndex: key,
        width: `${widthTD[index]}%`,
        render: (text: string | CouponOrder[] | undefined, record: CouponRaw) => {
          if (key === 'actions' && !text) {
            return (
              <WrapperAction>
                <InvisibleButton onClick={() => handleActivateEditMode(record)}>
                  <EditTwoTone data-testid="edit-icon" style={{ fontSize: '18px' }} twoToneColor="" />
                </InvisibleButton>
                <Popconfirm
                  cancelText="No"
                  okText="Yes"
                  placement="bottomRight"
                  title="Are you sure you want to delete it ?"
                  onConfirm={() => deleteCoupon(record.id)}
                >
                  <DeleteTwoTone data-testid="delete-icon" style={{ fontSize: '18px' }} twoToneColor="#eb2f96" />
                </Popconfirm>
              </WrapperAction>
            );
          }

          return <div>{text}</div>;
        },
      };
    });

  const userListFormatted = useMemo(() => {
    const newList = [...(userList || [])];
    newList.unshift({ _id: '', firstName: 'Any', lastName: 'user', username: '', company: '', id: '' });
    return newList;
  }, [userList]);

  const couponsDisplayed: CouponDisplayed[] = (coupons || []).map((coupon: Coupon, index: number) => {
    if (!coupon.id || coupon.id === selectedCoupon?.id) {
      return {
        key: index,
        id: '0',
        code:
          coupon.id !== selectedCoupon?.id ? (
            <Controller autoFocus as={InputStyled} control={control} error={errors.code} name="code" type="text" />
          ) : (
            selectedCoupon.code
          ),
        app: (
          <Controller
            as={Select}
            control={control}
            items={optionsAppNewRow.map((option) => ({
              label: option,
              value: option,
            }))}
            name="app"
            style={{ width: '100px' }}
          />
        ),
        purpose: <Controller as={InputText} control={control} name="purpose" type="text" />,
        value: <Controller as={InputNumber} control={control} error={errors.value} name="value" type="text" />,
        user: (
          <Controller
            as={Select}
            control={control}
            items={userListFormatted.map((user: UserInfoLight) => ({
              label: capitalize(`${user.firstName} ${user.lastName} ${user.company ? `/ ${user.company}` : ''}`),
              value: user.id,
            }))}
            name="user"
            style={{ width: '250px' }}
          />
        ),
        date: (
          <Controller allowEmpty={[true, true]} as={RangePicker} control={control} format="DD-MM-YYYY" name="date" />
        ),
        multipleUsage: (
          <Controller
            as={Select}
            control={control}
            items={optionsMultipleNewRow.map((option) => ({
              label: option,
              value: option,
            }))}
            name="multipleUsage"
            style={{ width: '100px' }}
          />
        ),
        orders: coupon.orders,
        actions:
          selectedCoupon && coupon.id === selectedCoupon.id ? (
            <WrapperAction>
              <InvisibleButton data-testid="submit-btn" type="submit">
                <CheckCircleTwoTone style={{ fontSize: '18px' }} twoToneColor="#52c41a" />
              </InvisibleButton>
              <InvisibleButton onClick={() => setSelectedCoupon(undefined)}>
                <CloseCircleTwoTone style={{ fontSize: '18px' }} twoToneColor="#eb2f96" />
              </InvisibleButton>
            </WrapperAction>
          ) : (
            <WrapperAction>
              <InvisibleButton data-testid="submit-btn" type="submit">
                <CheckCircleTwoTone style={{ fontSize: '18px' }} twoToneColor="#52c41a" />
              </InvisibleButton>
              <InvisibleButton onClick={cancelAddRow}>
                <CloseCircleTwoTone style={{ fontSize: '18px' }} twoToneColor="#eb2f96" />
              </InvisibleButton>
            </WrapperAction>
          ),
      };
    }

    return {
      id: coupon.id,
      code: coupon.code.toUpperCase(),
      app: coupon.app,
      purpose: coupon.purpose,
      value: `${coupon.value} €`,
      user: coupon.user ? `${coupon.user.firstName} ${coupon.user.lastName}` : '',
      userId: coupon.user?.id,
      date: `${coupon.validityStart ? moment(coupon.validityStart).format('DD-MM-YYYY') : ''} / ${
        coupon.validityEnd ? moment(coupon.validityEnd).format('DD-MM-YYYY') : ''
      }`,
      multipleUsage: `${coupon.multipleUsage ? TRUE : FALSE}`,
      orders: coupon.orders,
      key: index,
    };
  });

  const dataTable = () => {
    if (!couponsDisplayed) return [];

    const fnChecked: { (data: CouponDisplayed): void }[] = [];

    if (filterInput.code)
      fnChecked.push((record) => {
        if (typeof record.code === 'object') return true;
        return (record.code as string).match(new RegExp(filterInput.code, 'gmi'));
      });
    if (filterInput.value)
      fnChecked.push((record) => {
        if (typeof record.value === 'object') return true;

        return (record.value as string).includes(filterInput.value);
      });
    if (filterInput.user)
      fnChecked.push((record) => {
        if (typeof record.user === 'object') return true;

        return (record.user as string)?.match(new RegExp(filterInput.user, 'gmi'));
      });
    if (filterInput.date) {
      fnChecked.push((record) => {
        if ((!filterInput.date[0] && !filterInput.date[1]) || typeof record.date === 'object') {
          return true;
        }
        const filterInputStart = moment(filterInput.date[0], 'DD-MM-YYYY').format('YYYY-MM-DD');
        const validityStart = moment((record.date as string).split('/')[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

        const filterInputEnd = moment(filterInput.date[1], 'DD-MM-YYYY').format('YYYY-MM-DD');
        const validityEnd = moment((record.date as string).split('/')[1], 'DD-MM-YYYY').format('YYYY-MM-DD');

        if (filterInput.date[0] && filterInput.date[1]) {
          return (
            moment(filterInputStart).isSameOrBefore(validityStart) && moment(filterInputEnd).isSameOrAfter(validityEnd)
          );
        }
        if (filterInput.date[0] && moment(filterInputStart).isSameOrBefore(validityStart)) {
          return true;
        }
        return !!(filterInput.date[1] && moment(filterInputEnd).isSameOrAfter(validityEnd));
      });
    }

    fnChecked.push((record) => {
      if (filterInput.app === SHOW_ALL) {
        return true;
      }

      return typeof record.app === 'string' && record.app.toLowerCase() === filterInput.app;
    });

    fnChecked.push((record) => {
      if (filterInput.multipleUsage === SHOW_ALL) {
        return true;
      }

      return (
        typeof record.multipleUsage === 'string' && record.multipleUsage.toLowerCase() === filterInput.multipleUsage
      );
    });

    return couponsDisplayed.filter((record) => fnChecked.every((fn) => fn(record)));
  };

  const expandedRowRender = () => {
    const columns = ['app', 'purpose', 'product', 'reference', 'date', 'amount', 'username', 'user', 'company'].map(
      (key) => ({
        title: key !== 'actions' && <div>{key}</div>,
        dataIndex: key,
      }),
    );

    const data: IFormattedCouponOrder[] = (selectedOrders || []).map((order: CouponOrder, index: number) => ({
      app: order.order.app,
      purpose: order.order.purpose,
      product: order.order.product,
      reference: order.order.reference,
      date: moment(order.date).format('DD-MM-YYYY'),
      amount: `${order.amount} €`,
      username: order.user?.username,
      user: order.user ? `${order.user.firstName} ${order.user.lastName}` : '',
      company: order.user?.company,
      key: index,
    }));

    return <Table bordered columns={columns} data-testid="table-expanded" dataSource={data} pagination={false} />;
  };

  return (
    <div className={className}>
      <Button
        disabled={isAddingRow}
        loading={createCouponLoading}
        style={{ marginBottom: 16 }}
        type="primary"
        onClick={addCoupon}
      >
        Add a coupon
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table
          bordered
          columns={headerTable()}
          dataSource={dataTable()}
          expandable={{
            expandedRowRender,
            expandIcon: ({ expanded, onExpand, record }) => {
              if (typeof record.code !== 'string' || record.orders?.length === 0) {
                return null;
              }
              return expanded ? (
                <MinusCircleTwoTone data-testid="collapse-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <PlusCircleTwoTone data-testid="expand-icon" onClick={(e) => onExpand(record, e)} />
              );
            },
            onExpand: (expanded, record) => {
              setRowExpanded(expanded ? [record.key] : [-1]);
              setSelectedOrders(coupons?.[record.key].orders);
            },
          }}
          expandedRowKeys={rowExpanded}
          loading={isGetCouponLoading}
        />
      </form>
    </div>
  );
};

export default styled(CouponList)`
  .ant-picker {
    min-width: 250px;
  }
`;
