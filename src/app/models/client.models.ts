export interface IClient {
  user_id: number;
  template: string;
  fio: string;
  first_name: string;
  last_name: string;
  pat_name: string;
  phone: string;
  sms_verify: boolean;
  email: string;
  birthday: string;
  gender: string;
  car_number: string;
  discount: string;
  bonus: string;
  bonus_last: string;
  write_off_last: string;
  loyalty_level: string;
  summ: string;
  summ_all: string;
  created_at: Date;
  link: string;
  barcode: string;
  o_s: string;
  telegram: boolean;
}

export interface IClientsResponse {
  meta: {
    size: number;
    limit: number;
    offset: number;
  };
  passes: IClient[];
}
