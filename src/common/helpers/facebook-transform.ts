import { Card } from '../interfaces/Cards.interface';
import { Model } from 'sequelize-typescript';
import { University } from '../../core/university/models/university.model';
import { GET_STUDY_MATERIAL, UPDATE_USER } from '../../config/constants';
import { StudyProgram } from '../../core/university/models/study-program.model';
import { StudyPeriod } from '../../core/university/models/study-period.model';
import { QuickReplyButton } from '../interfaces/QuickReply.interface';
import { Course } from '../../core/university/models/course.model';
import { StudyMaterial } from '../../core/study-material/models/study-material.model';
import { ActivityType } from '../../core/study-material/models/activity-type.model';
import { UserAccount } from '../../core/user/models/user-account.model';

export function toCard(model: Model): Card {
  if (model instanceof University) {
    return universityToCard(model);
  } else if (model instanceof StudyProgram) {
    return studyProgramToCard(model);
  } else if (model instanceof Course) {
    return courseToCard(model);
  } else {
    throw new Error("Unsupported class.");
  }

}


export function toQuickReplyButton(model: Model): QuickReplyButton {
  if (model instanceof StudyPeriod) {
    return studyPeriodToQuickReplyButton(model);
  } else if (model instanceof StudyMaterial) {
    return studyMaterialToQuickReplyButton(model);
  } else if (model instanceof ActivityType) {
    return activityTypeToQuickReplyButton(model);
  } else {
    throw new Error("Unsupported class.");
  }
}

export function accountToText(account: UserAccount) {
  const { id, user, createdAt } = account;
  let response = `ID: ${id}\n`;
  response += `CreatedAt: ${createdAt.toLocaleDateString()}`;
  if (user) {
    response += `\n\nUniversity: ${user.universityId}\n`;
    response += `StudyProgram: ${user.studyProgramId}\n`;
    response += `StudyPeriod: ${user.studyPeriodId}\n`;
    response += `Course: ${user.courseId}\n`;
    response += `Requests: ${account.successfulRequests + account.failedRequests}`;
  }
  return response;
}


function courseToCard(model: Course): Card {
  const parameters = {courseId: model.id};
  const payload = JSON.stringify({payload:{command:UPDATE_USER}, parameters});
  return {
    title: model.title,
    subtitle: model.details,
    buttons: [
      { title: `ELEGIR ${model.id}`, payload }
    ]
  }
}

function universityToCard(model: University): Card {
  const parameters = {universityId: model.id};
  const payload = JSON.stringify({payload:{command:UPDATE_USER}, parameters});
  return {
    title: model.name.toUpperCase(),
    subtitle: model.description || 'Universidad',
    buttons: [
      { title: `ELEGIR ${model.id}`, payload }
    ]
  }
}

function studyProgramToCard(model: StudyProgram): Card {
  const parameters = {studyProgramId: model.id};
  const payload = JSON.stringify({payload:{command:UPDATE_USER}, parameters});
  return {
    title: `${model.id} - ${model.universityId}`,
    subtitle: model.title,
    buttons: [
      { title: `ELEGIR ${model.id}`, payload }
    ]
  };
}

function studyPeriodToQuickReplyButton(model: StudyPeriod): QuickReplyButton {
  const parameters = {studyPeriodId: model.id};
  const payload = JSON.stringify({payload:{command:UPDATE_USER}, parameters});
  return {
    content_type: 'text',
    title: model.name,
    payload
  }
}

function studyMaterialToQuickReplyButton(model: StudyMaterial): QuickReplyButton {
  const parameters = {id:model.id};
  const payload = JSON.stringify({payload:{command:GET_STUDY_MATERIAL, parameters}})
  return {
    content_type: 'text',
    title: model.name,
    payload
  }
}

function activityTypeToQuickReplyButton(model: ActivityType): QuickReplyButton {
  const parameters = {activityTypeId:model.id};
  const payload = JSON.stringify({payload:{command:UPDATE_USER}, parameters});
  return {
    content_type: 'text',
    title: model.name,
    payload
  }
}


