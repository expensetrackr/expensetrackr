#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const wayfinderPath = path.join(__dirname, "../resources/js/wayfinder/index.ts");

try {
    if (fs.existsSync(wayfinderPath)) {
        const content = fs.readFileSync(wayfinderPath, "utf8");

        // Check if @ts-nocheck is already present
        if (!content.includes("// @ts-nocheck")) {
            // Add @ts-nocheck at the beginning of the file
            const modifiedContent = "// @ts-nocheck\n" + content;
            fs.writeFileSync(wayfinderPath, modifiedContent);
            console.info("Added @ts-nocheck to wayfinder file");
        } else {
            console.info("@ts-nocheck already present in wayfinder file");
        }
    } else {
        console.warn("Wayfinder file not found");
    }
} catch (error) {
    console.error("Error fixing wayfinder file:", error);
}
