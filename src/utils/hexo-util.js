import yaml from 'js-yaml';
import path from 'path';
import fileUtil from './file-util'
import expandTilde from 'expand-tilde'
import pathExists from 'path-exists'
import moment from 'moment'
class HexoUtil {
	loadHexoConfig(hexoRoot) {
		var confPath = path.join(hexoRoot, '_config.yml');

		return fileUtil.readFilePromise(confPath)
			.then((file) => {
				var ymlobj = yaml.safeLoad(file);

				// filter unnecessary fields
				var config = {};
				config.source_dir = ymlobj.source_dir;
				config.date_format = ymlobj.date_format;
				config.time_format = ymlobj.time_format;
				config.new_post_name = ymlobj.new_post_name;

				if (!config.source_dir || !config.date_format || !config.time_format || !config.new_post_name) {
					return Promise.reject(new Error(`Hexo config file is not valid. [${path.join(hexoRoot, '_config.yml')}]`));
				}

				return Promise.resolve(config);
			})
	}

	validHexoRoot(hexoRootPath) {
		var expandPath = expandTilde(hexoRootPath);

		// there is _config.yml in hexo root
		var hexoConfigPath = path.join(expandPath, '_config.yml');

		return pathExists(expandPath)
			.then((exists) => {
				if (!exists) {
					return Promise.reject(new Error(`Input hexo root path is not found. [${hexoRootPath}]`));
				}
				return pathExists(expandTilde(hexoConfigPath));
			})
			.then((exists) => {
				if (!exists) {
					return Promise.reject(new Error(`Input hexo root path will be not hexo root.(Needs _config.yml) [${hexoRootPath}]`));
				}

				return Promise.resolve();
			});
	}

	toHexoPostString(hexoPostObj) {
		var text = [];
		text.push('----');
		text.push(`title: ${hexoPostObj.title}`);
		text.push(`date: ${hexoPostObj.date}`);
		text.push('tags:');
		hexoPostObj.tags.forEach((tag) => {
			text.push(`- ${tag}`);
		});
		text.push('----');
		text.push(hexoPostObj.content);
		return text.join('\n');
	}

	parseFileName(rule,hexoPostObj){
		var date = hexoPostObj.date
		var filenameData = {
			year: date.format('YYYY'),
			month: date.format('MM'),
			i_month: date.format('M'),
			day: date.format('DD'),
			i_day: date.format('D'),
			title: hexoPostObj.title
		};
		for (var key in filenameData){
			rule = rule.replace(new RegExp(":"+key),filenameData[key])
		}
		return rule;
	}
}

export default new HexoUtil();
