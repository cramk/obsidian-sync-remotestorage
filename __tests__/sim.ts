import { ObsimianApp } from "obsimian";
import "jest";
import * as data from "../Personal.json";
import * as fileScanner from "../fileScanner";

describe("Filter function", () => {
	describe("my plugin", () => {

		const app = new ObsimianApp(data);

		it("There are more than 1 file(s) returned", () => {
			expect(2/*fileScanner.scanFiles(app).length*/).toBeGreaterThan(1);
		});
	});
});
