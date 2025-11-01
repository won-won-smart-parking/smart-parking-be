import { DataTypes, Model, type Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Parking from "./parking.model.ts";
import User from "./user.model.ts";
import { sequelize } from "../configs/database.ts";

export interface TicketAttributes {
  id: string;
  user_id: string;
  parking_id: string;
  start_date: Date;
  end_date: Date;
  type: "daily" | "subscription";
}

interface TicketCreationAttributes extends Optional<TicketAttributes, "id"> {}

export default class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  declare id: string;
  declare user_id: string;
  declare parking_id: string;
  declare start_date: Date;
  declare end_date: Date;
  declare type: "daily" | "subscription";
}

Ticket.init(
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
    parking_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("daily", "subscription"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Ticket",
    tableName: "tickets",
    timestamps: true,
    underscored: true,
  },
);

// 관계 설정
User.hasMany(Ticket, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "tickets",
});

Parking.hasMany(Ticket, {
  foreignKey: "parking_id",
  sourceKey: "id",
  as: "tickets",
});

Ticket.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

Ticket.belongsTo(Parking, {
  foreignKey: "parking_id",
  targetKey: "id",
  as: "parking",
});
