#!/usr/bin/env bun
type StringMap = {
  [key: string]: string,
}

type PackageJson = {
  name: string,
  devDependencies: StringMap,
  exports?: StringMap,
  [key: string]: unknown
}
const settingsDevDeps = {
  '@repo/eslint-config': '*',
  '@repo/typescript-config': '*',
  "eslint": "^8.56.7",
  "@types/eslint": "^8.56.7",
}

const BUN_CREATE_SCRIPT = 'create'
const REQUIRED_ARGS = {
  type: ['-t', '--type'], 
  name: ['-n', '--name'],
  typescriptConfig: ['-tc', '--typescriptConfig'],

} as const
// [[type, ['-t', '--type']], [name, ['-n', '--name']]].forEach(([key, value]) => )
const TYPE_VALUES = ['app', 'package', 'a', 'p'] as const
type TypeValues = typeof TYPE_VALUES[number]
const DEFAULT_INIT_TEMPLATE = ["init", "-y"]

type Args = {
  scriptRunner: string;
  template: string[];
  typeValue: TypeValues;
  projectTypeDir: string;
  name: string;
  typescriptConfig: string;
};

const getRepoProject = (projectName: string) => `@repo/${projectName}`

const removeCommentsFromJson = (jsonString: string): string => {
  return jsonString.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
}

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
    typeValue: 'a',
    projectTypeDir: '',
    name: '',
    typescriptConfig: '',
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
        parsed.typeValue = value as TypeValues
        parsed.projectTypeDir = getBasePathDirname(value as TypeValues);
        break;
      case "-n":
      case "--name":
        if (value === undefined) {
          throw new Error(`-n(--name) must be defined`);
        }
        parsed.name = value;
        break;
      case '-tc':
      case '--typescriptConfig':
        if (value === undefined) {
          throw new Error(`-tc(--typescriptConfig) must be defined`);
        }
        parsed.typescriptConfig = value;
        break
    }
    i++; // skip next
  }
  return parsed;
}

const changePackageJson = async (path: string, type: TypeValues) => {
  const file = Bun.file(`${path}/package.json`)
  const parsedPackageJson = await file.json() as PackageJson
  parsedPackageJson.devDependencies = {
    ...parsedPackageJson.devDependencies,
    ...settingsDevDeps,
  }

  if (type === 'p' || type === 'package') {
    parsedPackageJson.name = getRepoProject(parsedPackageJson.name)
    parsedPackageJson.exports = {}
  }

  await Bun.write(file, JSON.stringify(parsedPackageJson, null, 2))
}

const changeTsConfig = async (path: string, typescriptConfig: string) => {
  const file = Bun.file(`${path}/tsconfig.json`)
  let stringifyJsonWithComments = await file.text()
  const extendsProp = `  "extends": "${getRepoProject('typescript-config')}/${typescriptConfig}.json",\n`
  stringifyJsonWithComments = stringifyJsonWithComments.slice(0, 2) + extendsProp + stringifyJsonWithComments.slice(2)
  await Bun.write(file, stringifyJsonWithComments)
}

const addEslintConfig = () => {

}

async function main(): Promise<void> {
  checkRequiredArgs(Bun.argv)
  const { 
    scriptRunner,
    template,
    typeValue,
    typescriptConfig,
    projectTypeDir,
    name,
  } = parseArgs(Bun.argv);
  const path = `./${projectTypeDir}/${name}`;

  // Execute the init script in the target directory
  await Bun.spawn(['mkdir', path])
  const initScript = ['bun', scriptRunner, ...template]
  console.log(...initScript, path)
  Bun.spawnSync(initScript, { cwd: path })

  await Promise.all([
    changePackageJson(path, typeValue),
    changeTsConfig(path, typescriptConfig),
  ])

  // Install dependencies
  await Bun.spawn(["bun", "install"], { cwd: path });
}

main().catch((err: any) => console.error(err));