import fs from "fs"
import path from "path"
import { XMLParser} from "fast-xml-parser"
import XMLBuilder from "fast-xml-builder"
import { Unit } from "@/src/lib/util"


const parser = new XMLParser({
  ignoreAttributes: false,
})


const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  })


const DATA_PATH = "../wh40k-10e"

const factionObj = {
  "Space Marines": [],
  "Imperium": [],
  "Chaos": [],
  "Xenos": [['Aeldari', 'Aeldari - Aeldari Library.cat']]
}

const outputJSON: Unit[]  = [];

function readAllCatFiles(dir: string): any[] {
  const files = fs.readdirSync(dir)

  return files
    .filter((f) => f.endsWith(".cat"))
    .map((f) => {
      const xml = fs.readFileSync(path.join(dir, f), "utf-8")
      return parser.parse(xml)
    })
}

function readCatFile(dir: string, fileName: string): any[] {
  console.log(path.join(dir, fileName))

  const xml = fs.readFileSync(path.join(dir, fileName), "utf-8")
  return parser.parse(xml);
}

function walk(json: any, faction: string) {
  
  const results: string[] = []

  const stack: any[] = [json]

  console.log(stack.length)


  while (stack.length > 0) {
    const node = stack.pop()

    if (!node || typeof node !== "object") continue

    for (const key of Object.keys(node)) {
      const value = node[key]

      if (key === "selectionEntry") {
        const entries = Array.isArray(value) ? value : [value]

        for (const entry of entries) {
          if (entry["@_type"] === "unit") {
            //build json here
            createUnit(entry, faction);
          }

          stack.push(entry)
        }
      } else if (typeof value === "object") {
        stack.push(value)
      }
    }
  }
}

function createUnit(entry: any, faction: string){
  const entryJSON: Unit = {"name": "", "faction": "", "role": "", "points": 0};
  entryJSON["name"] = entry["@_name"];
  entryJSON["faction"] = faction;
  
    entry["categoryLinks"]["categoryLink"].forEach(element => {
      if(element["@_primary"] === "true") entryJSON["role"] = element["@_name"]
      if(element["@_name"] === 'Faction: Drukhari') entryJSON["faction"] = "Drukhari"
    });
    try{
    if(typeof entry["costs"] !== 'undefined'){
      if(Array.isArray(entry["costs"]["cost"])){
        entry["costs"]["cost"].forEach(element => {
          if(element["@_name"] === "pts") entryJSON["points"] = element["@_value"]
        });
      } else {
          if(entry["costs"]["cost"]["@_name"] === "pts") entryJSON["points"] = entry["costs"]["cost"]["@_value"]
      }
    } else if(typeof entry["selectionEntries"] !== undefined){
      entry["selectionEntries"]["selectionEntry"]["costs"]["cost"].forEach(element => {
          if(element["@_name"] === "pts") entryJSON["points"] = element["@_value"]
      });
    } else {
      console.log("ERROR");
      console.log(entry);
    }
    } catch {
      console.log("ERROR");
      console.log(entry["costs"]["cost"])
    }   

  outputJSON.push(entryJSON);

}




function main() {
  const data = readCatFile(DATA_PATH, 'Aeldari - Aeldari Library.cat');
  walk(data, 'Aeldari')

  const json = JSON.stringify(outputJSON, null, 2)
  fs.writeFileSync("./src/data/units.json", json, "utf-8");

}

main()