import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import (
    Template,
    PackageType,
    Dependencies,
    RunTimeDeps,
    generate_template,
    DevServer,
    Bundles,
    MainModule,
)
from youwol.utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / "package.json")

load_dependencies = {
    "@youwol/vsf-core": "^0.3.0",
    "@youwol/vsf-canvas": "^0.3.0",
    "rxjs": "^7.5.6",
    "@youwol/rx-vdom": "^1.0.1",
    "@youwol/webpm-client": "^3.0.0",
    "@youwol/rx-code-mirror-editors": "^0.4.0",
    "@youwol/os-top-banner": "^0.2.0",
}

template = Template(
    path=folder_path,
    type=PackageType.Application,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(
        runTime=RunTimeDeps(externals=load_dependencies),
        devTime={
            # `lz-string` required for documentation step
            "lz-string": "^1.4.4"
        },
    ),
    userGuide=True,
    devServer=DevServer(port=3016),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./index.ts", loadDependencies=list(load_dependencies.keys())
        )
    ),
)

generate_template(template)
shutil.copyfile(
    src=folder_path / ".template" / "src" / "auto-generated.ts",
    dst=folder_path / "src" / "auto-generated.ts",
)
for file in [
    "README.md",
    "package.json",
    "jest.config.ts",
    # "tsconfig.json", references `rx-vdom-config.ts`
    "webpack.config.ts",
    ".prettierignore",
    ".gitignore",
    ".npmignore",
]:
    shutil.copyfile(src=folder_path / ".template" / file, dst=folder_path / file)
