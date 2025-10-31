import { DataTypes, Model, type Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Parking from "./parking.model.ts";
import User from "./user.model.ts";
import { sequelize } from "../configs/database.ts";

export interface BookmarkAttributes {
  id: string;
  user_id: string;
  parking_id: string;
}

interface BookmarkCreationAttributes extends Optional<BookmarkAttributes, "id"> {}

export default class Bookmark
  extends Model<BookmarkAttributes, BookmarkCreationAttributes>
  implements BookmarkAttributes
{
  public id!: string;
  public user_id!: string;
  public parking_id!: string;
}

Bookmark.init(
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
  },
  {
    sequelize,
    modelName: "Bookmark",
    tableName: "bookmarks",
    timestamps: true,
    underscored: true,
  },
);

// 관계 설정
User.belongsToMany(Parking, {
  through: Bookmark,
  foreignKey: "user_id",
  otherKey: "parking_id",
  as: "bookmarkedParkings",
});

Parking.belongsToMany(User, {
  through: Bookmark,
  foreignKey: "parking_id",
  otherKey: "user_id",
  as: "bookmarkedUsers",
});
