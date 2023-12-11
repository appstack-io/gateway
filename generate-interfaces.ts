import { combineProtos, generateInterfaces } from '@appstack-io/proto';
import { exec } from 'child_process';

combineProtos([`${__dirname}/src`], `${__dirname}/src/combined.proto`);
exec(
  `protoc --plugin=$(pwd)/node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=snakeToCamel=true,outputClientImpl=false -I=./src --ts_proto_out=./src combined.proto`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    generateInterfaces(
      `${__dirname}/src/combined.ts`,
      `${__dirname}/src/combined.interfaces.ts`,
    );
  },
);
