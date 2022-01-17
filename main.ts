import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Logger, setLogger } from "./logger";
import {
	LOG_LEVEL

} from "./types";
import * as fileScanner from "./fileScanner";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	showVerboseLog: boolean;
	lessInformationInLog: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	showVerboseLog: true,
	lessInformationInLog:false
}

export default class MyPlugin extends Plugin {
	logMessage: string[] = [];
	settings: MyPluginSettings;
	addLogHook: () => void = null
	notifies: { [key: string]: { notice: Notice; timer: NodeJS.Timeout; count: number } } = {};
	async addLog(message: any, level: LOG_LEVEL = LOG_LEVEL.INFO) {
		if (level < LOG_LEVEL.INFO && this.settings && this.settings.lessInformationInLog) {
				return;
		}
		if (this.settings && !this.settings.showVerboseLog && level == LOG_LEVEL.VERBOSE) {
				return;
		}
		const valutName = this.app.vault.getName();
		const timestamp = new Date().toLocaleString();
		const messagecontent = typeof message == "string" ? message : message instanceof Error ? `${message.name}:${message.message}` : JSON.stringify(message, null, 2);
		const newmessage = timestamp + "->" + messagecontent;

		this.logMessage = [].concat(this.logMessage).concat([newmessage]).slice(-100);
		console.log(valutName + ":" + newmessage);
		// if (this.statusBar2 != null) {
		//     this.statusBar2.setText(newmessage.substring(0, 60));
		// }

		if (level >= LOG_LEVEL.NOTICE) {
				if (messagecontent in this.notifies) {
						clearTimeout(this.notifies[messagecontent].timer);
						this.notifies[messagecontent].count++;
						this.notifies[messagecontent].notice.setMessage(`(${this.notifies[messagecontent].count}):${messagecontent}`);
						this.notifies[messagecontent].timer = setTimeout(() => {
								const notify = this.notifies[messagecontent].notice;
								delete this.notifies[messagecontent];
								try {
										notify.hide();
								} catch (ex) {
										// NO OP
								}
						}, 5000);
				} else {
						const notify = new Notice(messagecontent, 0);
						this.notifies[messagecontent] = {
								count: 0,
								notice: notify,
								timer: setTimeout(() => {
										delete this.notifies[messagecontent];
										notify.hide();
								}, 5000),
						};
				}
		}
		if (this.addLogHook != null) this.addLogHook();
	}

	async onload() {
		
		setLogger(this.addLog.bind(this)); 
		Logger("loading plugin");
		// eslint-disable-next-line no-debugger
		debugger;
		await this.loadSettings();


		//Try to gather list of all documents
		const files = fileScanner.scanFiles(this.app);
		console.log("FILES", files)
		new Notice(`${files.length} Files Found`)





		//---------------------
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
