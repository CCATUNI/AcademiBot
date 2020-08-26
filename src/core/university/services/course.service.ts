import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from '../models/course.model';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course) private repository: typeof Course
  ) {}


}