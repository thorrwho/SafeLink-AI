const { spawn } = require('child_process');
const path = require('path');

const classifyText = (text) => {
    return new Promise((resolve, reject) => {
        const mlModelDir = path.join(__dirname, '..', '..', 'ml-model');
        const pythonScript = 'train_model.py';

        // Log for debugging
        console.log(`Spawning Python script: ${pythonScript} in ${mlModelDir}`);
        console.log(`With input text: "${text.substring(0, 50)}..."`);

        // Spawn the python process, setting the CWD to the script's directory
        const pythonProcess = spawn('python', [pythonScript, text], {
            cwd: mlModelDir 
        });

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        let error = '';
        pythonProcess.stderr.on('data', (data) => {
            // Log the raw error from Python's stderr
            console.error(`Python stderr: ${data}`);
            error += data.toString();
        });

        pythonProcess.on('error', (err) => {
            // This event is emitted if the process could not be spawned
            console.error('Failed to start Python subprocess.', err);
            return reject('Failed to start Python subprocess. Is Python installed and in your PATH?');
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            if (code !== 0) {
                // The process exited with an error
                return reject(`Python script failed with code ${code}. Error: ${error || 'Unknown error'}`);
            }
            
            // The process exited successfully
            try {
                const parsedResult = JSON.parse(result);
                if (parsedResult.error) {
                    return reject(`An error occurred in the Python script: ${parsedResult.error}`);
                }
                resolve(parsedResult);
            } catch (e) {
                console.error('Failed to parse Python script output:', result);
                reject(`Failed to parse Python script output. Raw output: "${result}"`);
            }
        });
    });
};

module.exports = { classifyText };

