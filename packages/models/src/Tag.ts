import { DocumentNode, gql } from '@apollo/client'

import { ModelBase } from './ModelBase'

export type TagType =
  | 'lense'
  | 'filter'
  | 'continent'
  | 'country'
  | 'dish'
  | 'restaurant'
  | 'orphan'
export type TagRecord = Partial<Tag> & Pick<Tag, 'type'>

export class Tag extends ModelBase<Tag> {
  type!: TagType
  name!: string
  icon!: string
  alternates!: string[]
  parentId!: string
  parentType!: TagType

  constructor(init?: Partial<Tag>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'Tag'
  }

  static upsert_constraint() {
    return 'tag_name_key'
  }

  static fields() {
    return ['type', 'name', 'icon', 'alternates', 'parentId', 'parentType']
  }

  static get fieldsQuery(): string {
    return Tag.fields().join(' ')
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
          parentType: "${next.parentType ?? ''}"
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
            parentType: "${next.parentType ?? ''}"
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
}
