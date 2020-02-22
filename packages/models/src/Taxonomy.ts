import { DocumentNode, gql } from '@apollo/client'

import { ModelBase } from './ModelBase'

export type TaxonomyType = 'continent' | 'country' | 'dish'

export type TaxonomyRecord = {
  id?: string
  type: TaxonomyType
  name?: string
  icon?: string
  alternates?: string[]
  parentId?: string
  parentType?: TaxonomyType
}

export class Taxonomy extends ModelBase<Taxonomy> {
  type!: TaxonomyType
  name!: string
  icon!: string
  alternates!: string[]
  parentId!: string
  parentType!: TaxonomyType

  constructor(init?: Partial<Taxonomy>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'Taxonomy'
  }

  static fields() {
    return ['type', 'name', 'icon', 'alternates', 'parentId', 'parentType']
  }

  static get fieldsQuery(): string {
    return Taxonomy.fields().join(' ')
  }

  static async findContinents() {
    const res = await ModelBase.query(`{
      taxonomy(where: { type: { _eq: "continent" } }) {
        ${this.fields().join(' ')}
      }
    }`)
    return res.taxonomy.map((data: Partial<Taxonomy>) => new Taxonomy(data))
  }

  static create(next: Partial<Taxonomy>): DocumentNode {
    return gql`
      mutation AddTaxonomy {
        insert_taxonomy(objects: {
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
}
