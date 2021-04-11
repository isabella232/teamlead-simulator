const properties = require("dot-properties");
const fs = require("fs");
const path = require("path");
const { localization, generate_declarations } = require("./builder");

for (const file of localization.files) {
    const full_path = path.join(localization.folder, file);
    const property_tree = properties.parse(fs.readFileSync(full_path, "utf8"), true);
    const module_content = generate_declarations(file, property_tree);

    fs.writeFileSync(path.join(localization.folder, `${file}.d.ts`), module_content);
}

