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
  "Chaos": [['Chaos Daemons', 'Chaos - Chaos Daemons Library.cat'], ['Chaos Knights', 'Chaos - Chaos Knights Library.cat'], ['Chaos Space Marines','Chaos - Chaos Space Marines.cat']],
  "Xenos": [['Aeldari', 'Aeldari - Aeldari Library.cat']]
}

//These terms either are broken for some reason or are excluded
const excludedTerms = ["[Legends]", "[Crucible]", "Beastmaster"];

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
          if(!excludedTerms.some(term => entry["@_name"].includes(term))){
            if (entry["@_type"] === "unit") {
              //build json here
              createUnit(entry, faction);
            } else if(entry["@_type"] === "model"){
              if(entry["categoryLinks"] !== undefined && Array.isArray(entry["categoryLinks"]["categoryLink"])){
                createUnit(entry, faction);
              }
            }

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
  // NAME
  entryJSON["name"] = entry["@_name"];

  // FACTION
  entryJSON["faction"] = faction;
  
    // ROLE
    if(Array.isArray(entry["categoryLinks"]["categoryLink"])){
      entry["categoryLinks"]["categoryLink"].forEach(element => {
        if(element["@_primary"] === "true") entryJSON["role"] = element["@_name"]
        if(element["@_name"] === 'Faction: Drukhari') entryJSON["faction"] = "Drukhari"
      });
    } else {
      console.log(entry);
    }
    

    // COST
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
          if(element["@_name"] === "pts") entryJSON["points"] = parseInt(element["@_value"])
      });
    } else {
      console.log("ERROR");
      console.log(entry);
    }
    } catch {
      console.log("ERROR");
      console.log(entry)
    }
    
  if(entryJSON["name"] == "" || entryJSON["role"] == "" || entryJSON["points"] == 0){
    console.log(entry["name"]);
    return
  }

  outputJSON.push(entryJSON);

}




function main() {
  for(const [greaterFaction, factionList] of Object.entries(factionObj)){
    for(const faction of factionList){
      const data = readCatFile(DATA_PATH, faction[1]);
      walk(data, faction[0])
    }
  }
  

  const json = JSON.stringify(outputJSON, null, 2)
  fs.writeFileSync("./src/data/units.json", json, "utf-8");

}

main()