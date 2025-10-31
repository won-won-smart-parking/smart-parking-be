import { DataTypes, Model, type Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../configs/database.ts";

// User 테이블 타입 정의
export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  profileUrl?: string | null;
  name: string;
  birth: Date;
  isLocationAgreed: boolean;
  isAlarmAgreed: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {} //

// User 모델 정의
export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public profileUrl!: string | null;
  public name!: string;
  public birth!: Date;
  public isLocationAgreed!: boolean;
  public isAlarmAgreed!: boolean;
}

// User 테이블 초기화
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profileUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isLocationAgreed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAlarmAgreed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
  },
);
