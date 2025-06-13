/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config, ConfigOptions } from 'karma';
import * as path from 'path';

module.exports = function (config: Config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
        ],
        client: {
            clearContext: false,
        },
        coverageReporter: {
            dir: path.join(__dirname, './coverage'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true,
    } as ConfigOptions);
};
