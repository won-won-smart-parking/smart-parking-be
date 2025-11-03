export type SignUpRequestBodyType = {
  email: string;
  password: string;
  name: string;
  birth: Date;
  isLocationAgreed: boolean;
  isAlarmAgreed: boolean;
};
