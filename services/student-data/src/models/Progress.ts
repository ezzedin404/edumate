import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript";

@Table
export class Progress extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  studentId!: number;

  @AllowNull(false)
  @Column
  courseId!: number;

  @AllowNull(false)
  @Column
  currentLecture!: number;

  @AllowNull(false)
  @Column
  examSolved!: boolean;
}
