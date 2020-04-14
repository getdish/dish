import fs from 'fs'

import { Tag } from '@dish/models'
import _ from 'lodash'
import { transliterate } from 'transliteration'

export class ParseFiverr {
  category!: Tag
  country!: Tag

  static async start(dirname: string = process.argv[2]) {
    const parser = new ParseFiverr()
    const filenames = fs.readdirSync(dirname)
    for (const filename of filenames) {
      if (!filename.endsWith('.txt')) continue
      const content = fs.readFileSync(dirname + '/' + filename, 'utf-8')
      await parser.parseFile(content)
    }
  }

  async parseFile(text: string) {
    const lines = text.split('\n')
    for (let line of lines) {
      const original = line.trim()
      line = transliterate(original)
      await this.checkForGeo(line)
      await this.checkForCategory(line, original)
      await this.addDish(line, original)
    }
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
    return string.replace('##', '').trim()
  }

  async addDish(line: string, original: string) {
    if (line.startsWith('#')) return
    if (line == '') return
    let tag = new Tag({
      name: line,
      type: 'dish',
      parentId: this.country.id,
    })
    tag.addAlternate(original)
    tag = await Tag.upsertOne(tag)
    await tag.upsertCategorizations([this.category.id])
  }
}
