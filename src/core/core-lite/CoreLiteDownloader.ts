import chalk from "chalk";
import ora from "ora";
import path from "path";
import { CoreGitDownloader } from "../CoreGitDownloader";
import { SupportedTemplate } from "../CoreTemplate";
import fs from 'fs';
import fse from'fs-extra';

/**
 * 极简板本生成器
 *
 * @export
 * @class CoreLiteDownloader
 * @extends {CoreGitDownloader}
 */
export class CoreLiteDownloader extends CoreGitDownloader {
  /**
   * 下载工程目录，依据配置选择是否需要筛选不需要目录
   * @returns 命令行数组
   */
  public async syncDownload(options: { type: SupportedTemplate; name: string; description: string }, finalOptions: any = {}) {
    // console.log('options==>', options);
    console.log();
    console.log(chalk.green('👉  开始构建，请稍侯...'));
    console.log();
    const spinner = ora('正在构建模板...').start();

    // 清除测试目录
    await this.clearTestFolder();

    // console.log(options.type, options);
    await this.copyTemplate(options);

    // 执行成功相关操作
    this.executeBuildSuccess(spinner, options);
  }

  /**
   * 复制模板
   *
   * @protected
   * @param {{ type: SupportedTemplate; name: string; description: string; }} options
   *
   * @memberOf CoreLiteDownloader
   */
  protected async copyTemplate(options: { type: SupportedTemplate; name: string; description: string; }): Promise<any> {
      let copyFolderName: string = 'vue-starter';
      const destDir = path.join(`${process.env.PWD}`, options.name);
      // console.log('options.type==>', options.type);
      switch (options.type) {
        case 'vue2':
          copyFolderName = 'vue-starter';
          break;
        case 'vue3':
          copyFolderName = 'vue-next-starter';
          break;
        case 'react':
          copyFolderName = 'react-starter';
          break;
      }
      const srcDir = path.join(__dirname, `template/${copyFolderName}`);

      try {
        await fse.copy(srcDir, destDir);
        console.log(chalk.green('👉  生成代码完毕...'));
      } catch (err) {
        console.error(err)
      }
  }
}

