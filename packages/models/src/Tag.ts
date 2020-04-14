import { DocumentNode, gql } from '@apollo/client'
import { EnumType } from 'json-to-graphql-query'
import _ from 'lodash'

import { ModelBase } from './ModelBase'
import { slugify } from './utils'

export type TagType =
  | 'lense'
  | 'filter'
  | 'continent'
  | 'country'
  | 'dish'
  | 'restaurant'
  | 'category'
  | 'orphan'
export type TagRecord = Partial<Tag> & Pick<Tag, 'type'>

export class Tag extends ModelBase<Tag> {
  type!: TagType
  name!: string
  displayName!: string
  icon!: string
  rgb?: [number, number, number]
  alternates!: string[]
  parentId!: string
  parent!: Tag
  categories!: { category: Tag }[]
  is_ambiguous!: boolean
  misc!: { [key: string]: any }

  constructor(init?: Partial<Tag>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'Tag'
  }

  static upsert_constraint() {
    return 'tag_parentId_name_key'
  }

  static fields() {
    return [
      'type',
      'name',
      'displayName',
      'icon',
      'rgb',
      'alternates',
      'parentId',
      'parent',
      'categories',
      'is_ambiguous',
      'misc',
    ]
  }

  static essentialFields() {
    return {
      name: true,
      displayName: true,
      icon: true,
      rgb: true,
      id: true,
      is_ambiguous: true,
      misc: true,
    }
  }

  static sub_fields() {
    return {
      parent: this.essentialFields(),
      categories: {
        category: this.essentialFields(),
      },
    }
  }

  static get fieldsQuery(): string {
    return Tag.fields().join(' ')
  }

  static read_only_fields() {
    return ['id', 'parent', 'categories', 'is_ambiguous']
  }

  isOrphan() {
    return this.parentId == '00000000-0000-0000-0000-000000000000'
  }

  slug() {
    return slugify(this.name)
  }

  slugDisambiguated() {
    return `${slugify(this.parent.name)}__${this.slug()}`
  }

  slugs() {
    let parentage: string[] = []
    if (!this.isOrphan()) {
      parentage = [slugify(this.parent.name), this.slugDisambiguated()]
    }
    const category_names = this.categories.map((i) => slugify(i.category.name))
    const all = [this.slug(), ...parentage, ...category_names].flat()
    return _.uniq(all)
  }

  static async findContinents() {
    const res = await ModelBase.query(`{
      tag(where: { type: { _eq: "continent" } }) {
        ${this.fields().join(' ')}
      }
    }`)
    return res.tag.map((data: Partial<Tag>) => new Tag(data))
  }

  static create(next: TagRecord): DocumentNode {
    return gql`
      mutation AddTag {
        insert_tag(objects: {
          name: "${next.name ?? ''}",
          icon: "${next.icon ?? ''}",
          type: "${next.type ?? 'continent'}",
          parentId: ${next.parentId ? next.parentId : null},
          parentType: "${next.parent?.type ?? ''}"
        }) {
          returning {
            id
          }
        }
      }
    `
  }

  static upsert(next: TagRecord): DocumentNode {
    return gql`
      mutation AddTag {
        insert_tag(
          objects: {
            ${next.id ? `id: "${next.id}",` : ''}
            name: "${next.name ?? ''}",
            icon: "${next.icon ?? ''}",
            type: "${next.type ?? 'continent'}",
            parentId: ${next.parentId ? `"${next.parentId}"` : null},
            parentType: "${next.parent?.type ?? ''}"
          },
          on_conflict: {
            constraint: tag_pkey,
            update_columns: [name, icon, type, parentId, parentType]
          }
        ) {
          returning {
            id
          }
        }
      }
    `
  }

  static async allChildren(parents: string[]) {
    const query = {
      query: {
        tag: {
          __args: {
            where: {
              parentId: {
                _in: parents,
              },
            },
          },
          ...Tag.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data.tag.map((data: Partial<Tag>) => new Tag(data))
  }

  static async upsertMany(tags: Partial<Tag>[]) {
    const query = {
      mutation: {
        insert_tag: {
          __args: {
            objects: tags.map((i) => {
              if (typeof i.asObject != 'undefined') {
                return i.asObject()
              } else {
                return i
              }
            }),
            on_conflict: {
              constraint: new EnumType(Tag.upsert_constraint()),
              update_columns: this.updatableColumns(),
            },
          },
          returning: Tag.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data.insert_tag.returning.map(
      (data: Tag) => new Tag(data)
    )
  }

  static async upsertOne(tag: Partial<Tag>) {
    const tags = await Tag.upsertMany([tag])
    return tags[0]
  }

  async upsertCategorizations(tag_ids: string[]) {
    const objects = tag_ids.map((tag_id) => {
      return {
        category_tag_id: tag_id,
        tag_id: this.id,
      }
    })
    const query = {
      mutation: {
        insert_tag_tag: {
          __args: {
            objects: objects,
            on_conflict: {
              constraint: new EnumType('tag_tag_pkey'),
              update_columns: [
                new EnumType('category_tag_id'),
                new EnumType('tag_id'),
              ],
            },
          },
          returning: { tag_id: true },
        },
      },
    }
    await ModelBase.hasura(query)
  }

  async addAlternate(alternate: string) {
    if (alternate != this.name) {
      this.alternates = this.alternates || []
      this.alternates?.push(alternate)
      this.alternates = _.uniq(this.alternates)
    }
  }
}
