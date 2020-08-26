import { ScheduledTask } from 'node-cron';

export interface TaskInterface {
  start(): Promise<ScheduledTask>;
}