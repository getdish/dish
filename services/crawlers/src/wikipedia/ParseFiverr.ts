import fs from 'fs'

import {
  Tag,
  tagAddAlternate,
  tagFindOne,
  tagUpsert,
  tagUpsertCategorizations,
} from '@dish/graph'
import { selectFields, tag } from '@dish/graph/_/graphql/new-generated'
import parse from 'csv-parse/lib/sync'
import { pick } from 'lodash'
import _ from 'lodash'
import { transliterate } from 'transliteration'

const MAX_PARALLEL = 5
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
let running_count = 0

export class ParseFiverr {
  category!: Tag
  country!: Tag

  static async start(dirname: string = process.argv[2]) {
    const filenames = fs.readdirSync(dirname)
    let skip = true
    for (const filename of filenames) {
      //if (filename == 'latinamerica-asunci.txt') skip = false
      //if (skip) continue
      if (!filename.endsWith('.txt')) continue
      const content = fs.readFileSync(dirname + '/' + filename, 'utf-8')
      while (running_count > MAX_PARALLEL) {
        await sleep(100)
      }
      console.log(filename)
      if (!dirname.includes('test')) {
        ParseFiverr.parseFile(content)
      } else {
        await ParseFiverr.parseFile(content)
      }
    }
  }

  static async parseFile(text: string) {
    running_count++
    const parser = new ParseFiverr()
    const lines = text.split('\n')
    for (let line of lines) {
      const original = line.trim()
      line = transliterate(original)
      await parser.checkForGeo(line)
      await parser.checkForCategory(line, original)
      await parser.addDish(line, original)
    }
    running_count--
  }

  async checkForGeo(line: string) {
    const single_hash_regex = new RegExp('^#(?!#)')
    if (single_hash_regex.test(line)) {
      const geo_parts = line
        .replace('#', '')
        .split(',')
        .map((i) => i.trim())
      let continent_tag = await tagFindOne({
        name: geo_parts[0],
        type: 'continent',
      })
      if (!continent_tag) {
        throw new Error(`No continent tag`)
      }
      if (!geo_parts[1]) {
        console.error(line)
      }
      const [tag] = await tagUpsert([
        {
          name: geo_parts[1],
          type: 'country',
          parentId: continent_tag.id,
        },
      ])
      this.country = tag
    }
  }

  async checkForCategory(line: string, original: string) {
    const double_hash_regex = new RegExp('^##(?!#)')
    if (double_hash_regex.test(line)) {
      const category = this._cleanCategory(line)
      original = this._cleanCategory(original)
      let [tag] = await tagUpsert(
        [
          {
            name: category,
            type: 'category',
            parentId: this.country.id,
          },
        ],
        undefined,
        (v_t: tag[]) => {
          return v_t.map((v) => {
            return {
              ...selectFields(v, '*', 1),
              alternates: v.alternates(),
            }
          })
        }
      )
      tagAddAlternate(tag, original)
      ;[tag] = await tagUpsert([
        pick(tag, ['name', 'alternates', 'type', 'parentId']),
      ])
      // ;[tag] = await tagUpsert([tag])
      this.category = tag
    }
  }

  _cleanCategory(string: string) {
    return string
      .replace('##', '')
      .replace(/ *\([^)]*\) */g, '')
      .trim()
  }

  async addDish(line: string, original: string) {
    if (line.startsWith('#')) return
    if (line == '') return
    line = line.replace(/ *\([^)]*\) */g, '').replace(/,$/, '')

    let [tag] = await tagUpsert(
      [
        {
          name: line,
          type: 'dish',
          parentId: this.country.id,
        },
      ],
      undefined,
      (v_t: tag[]) => {
        return v_t.map((v) => {
          return {
            ...selectFields(v),
            alternates: v.alternates(),
          }
        })
      }
    )
    tagAddAlternate(tag, original)
    ;[tag] = await tagUpsert([
      pick(tag, ['name', 'alternates', 'type', 'parentId']),
    ])
    // ;[tag] = await tagUpsert([tag])

    if (this.category) {
      await tagUpsertCategorizations(tag, [this.category.id])
    }
  }
}

// Aisha supplied her order as an XLSX file
// I first converted the sheets with `csv-tools`:
// in2csv aisha.xlsx --names | \
//   tr '\n' '\0' |\
//   xargs -0 -n1 -I{} sh -c 'in2csv aisha.xlsx --sheet "$1" > "$1.csv"' -- {}
//
// I then deleted and hand edited some files.
export class ParseAisha {
  output = [] as string[]

  static start(
    source: string = process.argv[2],
    destination: string = process.argv[3]
  ) {
    const aisha = new ParseAisha()
    const filenames = fs.readdirSync(source)
    for (const filename of filenames) {
      if (!filename.endsWith('.csv')) continue
      const content = fs.readFileSync(source + '/' + filename, 'utf-8')
      try {
        aisha.parseFirstLine(content)
        aisha.parseFile(content)
        aisha.writeTxtFile(destination)
      } catch (e) {
        console.error(filename)
        throw new Error(e)
      }
    }
  }

  parseFile(content: string) {
    let sections = {} as { [key: string]: string[] }
    const records = parse(content, {
      comment: '//',
      columns: true,
      from_line: 2,
    })
    for (const record of records) {
      for (const key of Object.keys(record)) {
        sections[key] = sections[key] || []
        if (record[key]) sections[key].push(record[key])
      }
    }
    for (const section of Object.keys(sections)) {
      this.output = [...this.output, '', section, ...sections[section]]
    }
  }

  parseFirstLine(content: string) {
    const records = parse(content, {
      comment: '//',
    })
    this.output.push(records[0][0])
  }

  writeTxtFile(destination: string) {
    const filename = this.output[0]
      .replace('#', '')
      .replace(/\s/g, '')
      .split(',')
      .join('-')
      .toLowerCase()
    fs.writeFileSync(
      destination + '/' + filename + '.txt',
      this.output.join('\n')
    )
    this.output = [] as string[]
  }
}

// Zeeshan and Amna each supplied a huge, single file. I cleaned them up a bit
// by hand first, removing commas, separating "/"s onto separate lines, etc
export class ParseOneBigFile {
  output = [] as string[]

  static start(
    source: string = process.argv[2],
    destination: string = process.argv[3]
  ) {
    const one = new ParseOneBigFile()
    const text = fs.readFileSync(source, 'utf-8')
    const lines = text.split('\n')
    const single_hash_regex = new RegExp('^#(?!#)')
    for (let line of lines) {
      if (one.output.length != 0 && single_hash_regex.test(line)) {
        one.writeTxtFile(destination)
      }
      one.output.push(line)
    }
  }

  writeTxtFile(destination: string) {
    const filename = this.output[0]
      .replace('#', '')
      .replace(/\s/g, '')
      .split(',')
      .join('-')
      .toLowerCase()
    fs.writeFileSync(
      destination + '/' + filename + '.txt',
      this.output.join('\n')
    )
    this.output = [] as string[]
  }
}
