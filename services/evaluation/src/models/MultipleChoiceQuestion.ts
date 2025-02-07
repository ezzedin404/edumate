import {
  AllowNull,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table
export class MultipleChoiceQuestion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  lectureId!: number;

  @AllowNull(false)
  @Column
  choices!: string;

  @AllowNull(false)
  @Column
  answerId!: number;
}
