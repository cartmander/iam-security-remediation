import { tagResources } from "../helpers/resourceGroupsTaggingApi.js";
import { getRegionFromArn } from "../helpers/misc.js";
import { parse } from "csv-parse";
import path from "path";
import fs from "fs";


const processPubliclyAccessibleRemediation = async (resources: string, justification: string): Promise<void> => {
    try {
        const arrayResources = [resources];
        const region = getRegionFromArn(resources);
        await tagResources(arrayResources, justification, region);
    }

    catch (error) {
        const errorMessage = `${(error as Error).name} - ${(error as Error).message}`;
        console.error(`Error tagging resources: ${resources}: ${errorMessage}`);
    }
}

const loopCsvRecords = async (error: any, csvRecords: any) => {
    console.log(csvRecords);
    for (let index = 0; index < csvRecords.length; index++) {
        const { Resources, Justification } = csvRecords[index];
        
        console.log("------------------------------------------------------------------------------------------");
        console.log(`\n[${index + 1}] Processing API Gateways: ${Resources}\n`);
        
        Resources
        await processPubliclyAccessibleRemediation(Resources, Justification);
        
        console.log(`\nDone processing API Gateways: ${Resources}\n`);
        console.log("------------------------------------------------------------------------------------------");
    }
}

const main = async (csvPath: string) => {
    const headers = ["Resources", "Justification"];
    const csvFilePath = path.resolve(csvPath);
    const csvContent = fs.readFileSync(csvFilePath);
  
    const csvOptions = {
      delimiter: ",",
      columns: headers,
      from_line: 2
    };
  
    await parse(csvContent, csvOptions, loopCsvRecords);
}
  
main("csvs/publiclyAccessible.csv");