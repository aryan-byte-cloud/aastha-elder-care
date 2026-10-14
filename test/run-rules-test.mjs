import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const defaultJavaHome = '/Users/aryanmangeshbadhe/Library/Application Support/minecraft/runtime/java-runtime-epsilon/osx-arm64/java-runtime-epsilon/jre.bundle/Contents/Home';

const javaHome = process.env.JAVA_HOME || (fs.existsSync(defaultJavaHome) ? defaultJavaHome : undefined);
const env = { ...process.env };
if (javaHome) {
  env.JAVA_HOME = javaHome;
  env.PATH = `${javaHome}/bin:${process.env.PATH || ''}`;
}

const firebaseBin = path.resolve(process.cwd(), 'node_modules', '.bin', 'firebase');

if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`[Firestore Emulator Active at ${process.env.FIRESTORE_EMULATOR_HOST}]`);
  const testProc = spawn('node', ['--test', 'test/rules.test.mjs'], {
    stdio: 'inherit',
    env,
  });
  testProc.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} else {
  console.log('Starting Firestore Emulator via Firebase CLI and executing tests...\n');
  const proc = spawn(
    firebaseBin,
    ['emulators:exec', '--only', 'firestore', 'node --test test/rules.test.mjs'],
    {
      stdio: 'inherit',
      env,
    }
  );

  proc.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
