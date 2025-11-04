export type CreateCarRequestBodyType = {
  name: string;
  number: string;
};

export type DynamicPathCarIdType = string;
export type UpdateCarRequestBodyType = Partial<CreateCarRequestBodyType> & { main?: boolean };
