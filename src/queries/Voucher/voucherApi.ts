import axios from 'axios';
import apisauce from 'apisauce';
import appConfig from 'src/appConfig';
import { AuthService, stringify } from '@shared';
import { ApiKey } from '@queries/keys';
import { VoucherListParams } from './type';

axios.defaults.withCredentials = true;
const create = (baseURL = `${appConfig.API_URL}`) => {
  //
  // Create and configure an apisauce-based api object.
  //
  const token = AuthService.getTokenFromStorage();
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 0,
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    timeout: appConfig.CONNECTION_TIMEOUT,
  });

  const getVoucherList = (params: VoucherListParams) => {
    const { ...tableParams } = params;
    const queryString = stringify(tableParams);
    return api.get(`${ApiKey.VOUCHER}?${queryString}`);
  };

  const getVoucherDetail = (id: string) => {
    return api.get(`${ApiKey.VOUCHER}/${id}`);
  };

  return {
    getVoucherList,
    getVoucherDetail,
  };
};

export default {
  create,
};
