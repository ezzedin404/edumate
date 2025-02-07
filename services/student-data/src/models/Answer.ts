import {
  AllowNull,
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table
export class Answer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  lectureId!: number;

  @AllowNull(false)
  @Column
  studentId!: number;

  @AllowNull(false)
  @Column
  mcqAnswers!: string;

  @AllowNull(false)
  @Column
  writtenAnswers!: string;
}
