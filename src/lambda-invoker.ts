import * as core from "@actions/core";
import {InvokeCommand, LambdaClient} from "@aws-sdk/client-lambda";

export async function run(): Promise<void> {
    try {
        const functionName: string = core.getInput("function-name");

        if (!functionName) {
            core.setFailed("function-name is required");
            return;
        }

        const functionVersionInput: string = core.getInput("version");
        const payload = core.getInput("payload");
        const client = new LambdaClient({});

        const functionVersion = functionVersionInput ? functionVersionInput : undefined;

        const encodedPayload = payload ? new TextEncoder().encode(payload) : undefined;

        core.info(`Invoking lambda function ${functionName}${functionVersion ? `:${functionVersion}` : ""}`)
        const response = await client.send(new InvokeCommand({
            FunctionName: functionName,
            Qualifier: functionVersion,
            Payload: encodedPayload
        }));

        core.setOutput("statusCode", response.StatusCode);

        if (response.Payload) {
            const payload = new TextDecoder().decode(response.Payload);
            core.setOutput("payload", payload)

            if (response.LogResult) {
                core.info("Function logs:\n" + response.LogResult);
            }
        }

        if (response.StatusCode !== 200) {
            core.setFailed(`Invoking lambda ${functionName}:${response.ExecutedVersion} failed with: ${response.StatusCode} -  ${response.FunctionError}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
