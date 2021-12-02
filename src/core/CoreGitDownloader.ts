import fs from 'fs';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';

/**
 * 模板地址
 */
const templates: any = {
	pc: {
		url: 'https://github.com/tencent/tdesign-vue-starter.git',
		description: 'TDesign Starter',
		downloadUrl: 'direct:git@github.com:Tencent/tdesign-vue-starter.git#develop'
	}
};

/**
 * 拉取代码
 * @returns 命令行数组
 */
export function getTemplate(options: any): any {
	console.log();
	const spinner = ora('正在构建模板...').start();
	const { downloadUrl } = templates[`${options.type || 'pc'}`];

	download(downloadUrl, options.name, { clone: true }, (err: any) => {
		if (err) {
			spinner.fail(chalk.red('❗错误：下载模板失败')); // 下载失败提示
			console.log(chalk.red('❗错误信息：'), chalk.red(err));
			process.exit();
		}
		console.log();
		spinner.succeed(chalk.green('构建成功！')); // 下载成功提示
		const packagePath = `${options.name}/package.json`;
		const packageContent: any = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
		packageContent.name = options.name;
		packageContent.description = options.description;
		fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2), {
			encoding: 'utf8'
		});
		console.log();
		console.log(chalk.green('👏  初始化项目完成！👏'));
		console.log();
		console.log(chalk.blue('命令提示：'));
		console.log(chalk.blue(`  # 进入项目`));
		console.log(chalk.blue(`  $ cd ./${options.name}`));
		console.log(chalk.blue(`  # 安装依赖`));
		console.log(chalk.blue(`  $ npm install`));
		console.log(chalk.blue(`  # 运行`));
		console.log(chalk.blue(`  $ npm run dev`));
		console.log();
	});
}