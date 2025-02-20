import * as util from './models/FileUtils';
import { OutputVariableInterface, OutPutVariablesConstants, PostTaskParameters, resultFolder } from "./models/UtilModels";
import * as fs from 'fs';
import * as core from '@actions/core';
import { AuthenticationUtils } from "./models/AuthenticationUtils";
import { YamlConfig } from "./models/TaskModels";
import { APISupport } from "./models/APISupport";

async function run() {
    try {

        let authContext = new AuthenticationUtils();
        let yamlConfig = new YamlConfig();
        let apiSupport = new APISupport(authContext, yamlConfig);

        await authContext.authorize();
        await apiSupport.getResource();
        core.exportVariable(PostTaskParameters.baseUri, apiSupport.baseURL);
        await apiSupport.getTestAPI(false);
        if (fs.existsSync(resultFolder)){
            util.deleteFile(resultFolder);
        }

        fs.mkdirSync(resultFolder);
        await apiSupport.createTestAPI();
        
        let outputVar: OutputVariableInterface = {
            testRunId: yamlConfig.runTimeParams.testRunId
        }

        core.setOutput(`${yamlConfig.outputVariableName}.${OutPutVariablesConstants.testRunId}`, outputVar.testRunId);
    }
    catch (err:any) {
        core.setFailed(err.message);
    }
}

run();