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

function walk(json: any) {
  
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
            console.log(entry);
            createUnit(entry);
            return
            const xmlFragment = builder.build({
              selectionEntry: entry,
            })
            results.push(xmlFragment)
          }

          stack.push(entry)
        }
      } else if (typeof value === "object") {
        stack.push(value)
      }
    }
  }
  console.log(results.length)
  console.log(results[0])
  return results
}

function createUnit(entry: any){
const entryJSON: Unit = {"name": "", "faction": "", "role": "", "points": 0};
entry["costs"]["cost"].forEach(element => {
  if(element["@_name"] === "pts") entryJSON["points"] = element["@_value"]
});

outputJSON.push(entryJSON);

}




function main() {
  const data = readCatFile(DATA_PATH, 'Aeldari - Aeldari Library.cat');
  const justUnits = walk(data)

  console.log(outputJSON);

}

main()