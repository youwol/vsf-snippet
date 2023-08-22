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
    "@youwol/vsf-core": "^0.2.0",
    "@youwol/vsf-canvas": "^0.2.0",
    "rxjs": "^6.5.5",
    "@youwol/flux-view": "^1.1.0",
    "@youwol/cdn-client": "^2.0.6",
    "@youwol/fv-code-mirror-editors": "^0.2.2",
    "@youwol/os-top-banner": "^0.1.1",
}

template = Template(
    path=folder_path,
    type=PackageType.Application,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(runTime=RunTimeDeps(externals=load_dependencies)),
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
    "tsconfig.json",
    "webpack.config.ts",
]:
    shutil.copyfile(src=folder_path / ".template" / file, dst=folder_path / file)
