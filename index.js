#!/usr/bin/env node
import convertToDockerRunCommands from 'decomposerize';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { parse, stringify } from 'yaml';

const composePath = join(process.cwd(), 'docker-compose.yml');

if (!existsSync(composePath)) {
  console.error('docker-compose.yml not found');
  process.exit(1);
}

const dockerComposeInput = readFileSync(composePath, 'utf8');
const dockerComposeJson = parse(dockerComposeInput);

// 删除restart
for (const service of Object.values(dockerComposeJson.services)) {
  delete service.restart;
}

const dockerComposeOutput = stringify(dockerComposeJson);

const configuration = {
  command: 'wslc run',
  rm: false,
  detach: true,
  multiline: false,
  'long-args': false,
  'arg-value-separator': ' '
};

const dockerRunCommands = convertToDockerRunCommands(dockerComposeOutput, configuration);

console.log(dockerRunCommands);
