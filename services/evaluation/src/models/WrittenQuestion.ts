import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";

@Table
export class WrittenQuestion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  lectureId!: number;

  @AllowNull(false)
  @Column
  question!: string;

  @AllowNull(false)
  @Column
  answer!: string;
}
