/** *******************************************************************
 * copyright (c) 2019-2023 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { By, until } from 'selenium-webdriver';
import { DriverHelper } from '../utils/DriverHelper';
import { CLASSES } from '../configs/inversify.types';
import { Logger } from '../utils/Logger';
import { TIMEOUT_CONSTANTS } from '../constants/TIMEOUT_CONSTANTS';
import { Locators, ModalDialog } from 'monaco-page-objects';
import { CheCodeLocatorLoader } from '../pageobjects/ide/CheCodeLocatorLoader';

const webCheCodeLocators: Locators = new CheCodeLocatorLoader().webCheCodeLocators;

@injectable()
export class ProjectAndFileTests {
	constructor(
		@inject(CLASSES.DriverHelper)
		private readonly driverHelper: DriverHelper
	) {}

	async waitWorkspaceReadinessForCheCodeEditor(): Promise<void> {
		Logger.debug('waiting for editor.');
		try {
			const start: number = new Date().getTime();
			await this.driverHelper
				.getDriver()
				.wait(until.elementLocated(By.className('monaco-workbench')), TIMEOUT_CONSTANTS.TS_SELENIUM_START_WORKSPACE_TIMEOUT);
			const end: number = new Date().getTime();
			Logger.debug(`editor was opened in ${end - start} seconds.`);
		} catch (err) {
			Logger.error(`waiting for workspace readiness failed: ${err}`);
			throw err;
		}
	}

	async performTrustAuthorDialog(): Promise<void> {
		try {
			const buttonYesITrustTheAuthors: string = 'Yes, I trust the authors';
			await this.driverHelper.waitVisibility(
				webCheCodeLocators.WelcomeContent.button,
				TIMEOUT_CONSTANTS.TS_DIALOG_WINDOW_DEFAULT_TIMEOUT
			);
			const trustedProjectDialog: ModalDialog = new ModalDialog();
			Logger.debug(`trustedProjectDialog.pushButton: "${buttonYesITrustTheAuthors}"`);
			await trustedProjectDialog.pushButton(buttonYesITrustTheAuthors);
		} catch (e) {
			Logger.debug(`Welcome modal dialog was not shown: ${e}`);
		}
	}
}
