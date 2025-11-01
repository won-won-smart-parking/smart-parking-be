import { DataTypes, Model, type Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import User from "./user.model.ts";
import { sequelize } from "../configs/database.ts";

// 1. 타입 정의
export interface CarAttributes {
  id: string;
  user_id: string;
  car_number: string;
}

// 2. 생성 시 id는 자동 생성되므로 Optional
interface CarCreationAttributes extends Optional<CarAttributes, "id"> {}

// 3. 모델 클래스 정의
export default class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
  declare id: string;
  declare user_id: string;
  declare car_number: string;
}

// 4. 모델 초기화
Car.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    car_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Car",
    tableName: "cars",
    timestamps: true,
    underscored: true,
  },
);

// 5. 관계 설정 (User 1 : N Car)
User.hasMany(Car, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "cars",
});

Car.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});
