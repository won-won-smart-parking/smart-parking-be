import { DataTypes, Model, type Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../configs/database.ts";

// 타입 정의
export interface ParkingAttributes {
  id: string;
}

interface ParkingCreationAttributes extends Optional<ParkingAttributes, "id"> {}

// 모델 정의
export default class Parking extends Model<ParkingAttributes, ParkingCreationAttributes> implements ParkingAttributes {
  declare id: string;
}

// 초기화
Parking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "Parking",
    tableName: "parking",
    timestamps: true,
    underscored: true,
  },
);
