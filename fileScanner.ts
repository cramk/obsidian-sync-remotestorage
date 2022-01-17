/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObsimianApp } from "obsimian";
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';



export function scanFiles(app: App): Array<TFile> {
  const files = app.vault.getMarkdownFiles()
  console.log("Files", files);
  for (const filex in files) {
    console.log("READING FILE:",filex,app.vault.read(files[filex]))
  }

  return files
}
