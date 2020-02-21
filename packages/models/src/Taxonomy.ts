import { ModelBase } from './ModelBase'

export type TaxonomyType = 'continent' | 'country' | 'dish'

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

  static async findContinents() {
    const query = {
      query: {
        taxonomy: {
          __args: {
            where: {
              type: { _eq: 'continent' },
            },
          },
          ...Taxonomy.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data.taxonomy.map(
      (data: Partial<Taxonomy>) => new Taxonomy(data)
    )
  }
}
