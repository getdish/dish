import fs from 'fs'

import { Tag } from '@dish/models'
import parse from 'csv-parse/lib/sync'
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
      let continent_tag = new Tag()
      await continent_tag.findOneByHash({
        name: geo_parts[0],
        type: 'continent',
      })
      if (!geo_parts[1]) {
        console.error(line)
      }
      this.country = await Tag.upsertOne({
        name: geo_parts[1],
        type: 'country',
        parentId: continent_tag.id,
      })
    }
  }

  async checkForCategory(line: string, original: string) {
    const double_hash_regex = new RegExp('^##(?!#)')
    if (double_hash_regex.test(line)) {
      const category = this._cleanCategory(line)
      original = this._cleanCategory(original)
      let tag = new Tag({
        name: category,
        type: 'category',
        parentId: this.country.id,
      })
      tag.addAlternate(original)
      this.category = await Tag.upsertOne(tag)
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
    console.log(line)
    let tag = new Tag({
      name: line,
      type: 'dish',
      parentId: this.country.id,
    })
    tag.addAlternate(original)
    tag = await Tag.upsertOne(tag)
    if (this.category) {
      await tag.upsertCategorizations([this.category.id])
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

// Zeeshan supplied a huge, plain txt file. I cleaned it up a bit by hand first,
// removing commas, separating "/"s onto separate lines, etc
export class ParseZeeshan {
  output = [] as string[]

  static start(
    source: string = process.argv[2],
    destination: string = process.argv[3]
  ) {
    const zeeshan = new ParseZeeshan()
    const text = fs.readFileSync(source, 'utf-8')
    const lines = text.split('\n')
    const single_hash_regex = new RegExp('^#(?!#)')
    for (let line of lines) {
      if (zeeshan.output.length != 0 && single_hash_regex.test(line)) {
        zeeshan.writeTxtFile(destination)
      }
      zeeshan.output.push(line)
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
