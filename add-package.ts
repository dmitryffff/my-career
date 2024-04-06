#!/usr/bin/env bun
type Args = {
  scriptRunner: string;
  template: string[];
  projectTypeDir: string;
  name: string;
};

const BUN_CREATE_SCRIPT = 'create'
const REQUIRED_ARGS = {
  type: ['-t', '--type'], 
  name: ['-n', '--name'],
} as const
// [[type, ['-t', '--type']], [name, ['-n', '--name']]].forEach(([key, value]) => )
const TYPE_VALUES = ['app', 'package', 'a', 'p'] as const
type TypeValues = typeof TYPE_VALUES[number]
const DEFAULT_INIT_TEMPLATE = ["init", "-y"]

const checkRequiredArgs = (args: string[]) => {
  Object.entries(REQUIRED_ARGS).forEach(([key, value]) => {
    if (!value.some(v => args.includes(v))) {
      throw new Error(`You need to specify a required arg '${key}': ${value.join(', ')}`)
    }
  })
}

const getBasePathDirname = (value: TypeValues): string => {
  let path: string
  switch (value) {
    case "app":
    case "a":
      path = 'apps'
      break
    case "package":
    case "p":
      path = 'packages'
      break
  }

  return path
}

const parseArgs = (args: string[]): Args => {
  const parsed: Args = { 
    scriptRunner: '',
    template: DEFAULT_INIT_TEMPLATE,
    projectTypeDir: '',
    name: '',
  };
  for (let i = 0; i < args.length; i++) {
    const value = args[i + 1]
    switch (args[i]) {
      case "-i":
      case "--initScript":
        if (value === undefined) {
          break;
        }
        parsed.scriptRunner = BUN_CREATE_SCRIPT;
        parsed.template = value.split(' ');
        break;
      case "-t":
      case "--type":
        if (value === undefined || !TYPE_VALUES.includes(value as TypeValues)) {
          throw new Error(`-t(--type) must be a value from the list: ${TYPE_VALUES.join(', ')}`);
        }
        parsed.projectTypeDir = getBasePathDirname(value as TypeValues);
        break;
      case "-n":
      case "--name":
        if (value === undefined) {
          throw new Error(`-n(--name) must be defined`);
        }
        parsed.name = value;
        break;
    }
    i++; // skip next
  }
  return parsed;
}

async function main(): Promise<void> {
  checkRequiredArgs(Bun.argv)
  const { scriptRunner, template, projectTypeDir, name } = parseArgs(Bun.argv);
  const path = `./${projectTypeDir}/${name}`;

  // Execute the init script in the target directory
  await Bun.spawn(['mkdir', path])
  const initScript = ['bun', scriptRunner, ...template]
  console.log(...initScript, path)
  await Bun.spawn(initScript, { cwd: path })

  // Install dependencies
  await Bun.spawn(["bun", "install"], { cwd: path });
}

main().catch((err: any) => console.error(err));