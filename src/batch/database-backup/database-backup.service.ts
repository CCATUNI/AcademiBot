import { Inject, Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import * as fs from 'fs';
import { FilesystemService } from '../../filesystem/filesystem.service';
import * as child_process from 'child_process';
import SequelizeConfig from '../../database/config/sequelize.config';
import { ConfigType } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class DatabaseBackupService {
  private running: boolean;
  constructor(
    private filesystemService: FilesystemService,
    @Inject(SequelizeConfig.KEY)
    private readonly dbConfig: ConfigType<typeof SequelizeConfig>,
  ) {
    this.running = false;
  }

  start(cronExpression) {
    if (this.running)
      throw new Error("Process already running.");
    const valid = cron.validate(cronExpression);
    if (!valid)
      throw new Error(`Cron expression ${cronExpression} not valid.`);
    cron.schedule(cronExpression,() => this.job(), { timezone: 'America/Lima' });
    this.running = true;
  }

  private async job() {
    const spawn = child_process.spawn;
    const { username, password, port, host, database } = this.dbConfig;
    console.log(`STARTING BACKUP OF ${database} @ ${host}`);
    for (const schema of ['public', 'audit']) {
      const arg1 = `--dbname=postgresql://${username}:${password}@${host}:${port}/${database}`;
      const args = [arg1, '-Fc', '-n', schema, '-a'];
      const dumpProcess = spawn('pg_dump', args, { stdio: ['ignore', 'pipe', 'inherit']});
      dumpProcess.on('exit', code => {
        if (code !== 0) {
          throw new Error("Exited with error " + code);
        }
      });
      dumpProcess.on('error', code => {
        console.error(code);
      })
      const now = (new Date()).toISOString();
      const fileName = `${schema}_${now}.dmp`;
      const key = `backups/${fileName}`;
      const backupPath = path.resolve(process.env.PWD, `./tmp/${fileName}`);
      const write = fs.createWriteStream(backupPath);
      dumpProcess.stdout.pipe(write);
      write.on('finish', () => {
        this.filesystemService.createObject(key, {
          Body: fs.createReadStream(backupPath)
        })
          .then(() => console.log(`Successful backup of schema ${schema}.`))
          .catch(console.error);
      });
    }


  }

}
