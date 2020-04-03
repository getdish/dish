import axios from 'axios'
import _ from 'lodash'

axios.defaults.validateStatus = () => {
  return true
}

const BASE = 'https://en.wikipedia.org/wiki/'

type Section = {
  title: string
  points: string[]
}

export class DishTaxonomy {
  crawled_countries: string[] = []

  static async start() {
    const crawler = new DishTaxonomy()
    await crawler.getEthnicCuisines()
    const pages = [
      'List of African cuisines',
      'List of cuisines of the Americas',
      'List of Asian cuisines',
      'List of European cuisines',
      'Oceanic cuisine',
    ]
    pages.map(async (i) => await crawler.getDishes(i))
  }

  async api(_page: string) {
    const page = _page.trim().replace(/ /g, '_')
    const response = await axios.get(BASE + page + '?action=raw')
    if (response.status > 299) {
      console.error(response.status, 'for ' + page)
    }
    return response
  }

  async getEthnicCuisines() {
    const response = await this.api('List_of_cuisines')
    const sections = await this.getSections(response.data, true)
    const countries =
      sections.find((i) => i.title.includes('Ethnic')) || <Section>{}
    for (const country of countries.points) {
      await this.getDishes(country)
    }
  }

  async getDishes(country: string) {
    if (this.crawled_countries.includes(country)) return
    this.crawled_countries.push(country)
    console.error('Crawling ' + country)
    const response = await this.api(country)
    const sections = await this.getSections(response.data)
    country = country.replace(/Cuisine of the/i, '')
    country = country.replace(/Cuisine of/i, '')
    country = country.replace(/regional cuisine/i, '')
    country = country.replace(/cuisine/i, '')
    country = country.trim()
    for (const section of sections) {
      for (const point of section.points) {
        console.log(`${country}, ${section.title}, ${point}`)
      }
    }
  }

  async getSections(content: string, override_ignore_rules = false) {
    const lines = content.split('\n')
    let section = <Section>{}
    let sections = <Section[]>[]
    let is_ignored_section = true
    for (const line of lines) {
      if (line.startsWith('=')) {
        if ('title' in section && section.points.length > 0) {
          sections.push(_.cloneDeep(section))
        }
        let title = line.replace(/=*/g, '').trim()
        if (!this._inIgnoredSections(title) || override_ignore_rules) {
          section = {
            title: title,
            points: [],
          }
          is_ignored_section = false
        } else {
          is_ignored_section = true
        }
      }
      const point_regex = RegExp(`^:*\\*+`)
      if (point_regex.test(line)) {
        const point = line.replace(point_regex, '').trim()
        const name = this.extractName(point)
        if (name) {
          if (override_ignore_rules) {
            section.points.push(name)
          }
          if (!is_ignored_section && !this._inIgnoredNames(name)) {
            section.points.push(name)
          }
          if (/cuisine/i.test(name)) {
            await this.getDishes(name)
          }
        }
      }
    }
    if ('points' in section && section.points.length > 0) {
      sections.push(_.cloneDeep(section))
    }
    return sections
  }

  _inIgnoredSections(title: string) {
    return [
      /External links/,
      /References/,
      /See also/,
      /Further reading/,
      /Bibliography/,
      /Nomenclature/,
      /Gallery/i,
      /habits/i,
      /utensils/i,
      /history/i,
      /Background/,
      /Sources/,
      /Restaurant/,
      /Literature/,
      /Citations/,
      /techniques/i,
      /List of/i,
      /cuisine/i,
      /By country/,
      /Related topics/,
      /^Countries$/,
      /Notable food and beverage companies/,
      /Historical/,
      /Anise spirits/,
      / Nation$/,
      /List of American regional and fusion/,
      /By location/,
      /Early ethnic/,
      /Later ethnic/,
      /Works cited/,
      /Roman era/,
      /Roman period/,
      /1914/,
      /Irish chefs/,
      /ancient Indian/,
      /Table manners/,
      /oils & nuts/,
      /Regional variations/,
      /Herbs/i,
      /^Chefs/i,
      /Video links/i,
    ].some((i) => {
      return i.test(title)
    })
  }

  _inIgnoredNames(name: string) {
    if (name.length <= 2) return true
    return [
      /transl/,
      /link multi/,
      /cuisine/i,
      /^lang$/,
      /^Cr$/,
      /^The $/,
      / is /,
    ].some((i) => {
      return i.test(name)
    })
  }

  extractName(line: string) {
    const matches = line.match(/([a-zA-Z -]+)/)
    return matches ? matches[0] : null
  }
}
