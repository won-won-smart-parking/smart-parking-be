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
  public id!: string;
  public user_id!: string;
  public parking_id!: string;
  public start_date!: Date;
  public end_date!: Date;
  public type!: "daily" | "subscription";
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
