// @ts-nocheck

import { lazyGetters } from '@gqless/utils'
import {
  Arguments,
  ArgumentsField,
  ArrayNode,
  EnumNode,
  FieldNode,
  InputNode,
  InputNodeField,
  ObjectNode,
  ScalarNode,
} from '@o/gqless'

import * as extensions from '../extensions'

export const schema = {
  get Boolean() {
    return new ScalarNode({
      name: 'Boolean',
      extension: ((extensions as any) || {}).Boolean,
    })
  },
  get Boolean_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _gt() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _gte() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.Boolean, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lte() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _neq() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.Boolean, true), true)
        },
      },
      { name: 'Boolean_comparison_exp' }
    )
  },
  get Float() {
    return new ScalarNode({
      name: 'Float',
      extension: ((extensions as any) || {}).Float,
    })
  },
  get ID() {
    return new ScalarNode({
      name: 'ID',
      extension: ((extensions as any) || {}).ID,
    })
  },
  get Int() {
    return new ScalarNode({
      name: 'Int',
      extension: ((extensions as any) || {}).Int,
    })
  },
  get Int_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.Int, true)
        },
        get _gt() {
          return new InputNodeField(schema.Int, true)
        },
        get _gte() {
          return new InputNodeField(schema.Int, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.Int, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.Int, true)
        },
        get _lte() {
          return new InputNodeField(schema.Int, true)
        },
        get _neq() {
          return new InputNodeField(schema.Int, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.Int, true), true)
        },
      },
      { name: 'Int_comparison_exp' }
    )
  },
  get String() {
    return new ScalarNode({
      name: 'String',
      extension: ((extensions as any) || {}).String,
    })
  },
  get String_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.String, true)
        },
        get _gt() {
          return new InputNodeField(schema.String, true)
        },
        get _gte() {
          return new InputNodeField(schema.String, true)
        },
        get _ilike() {
          return new InputNodeField(schema.String, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _like() {
          return new InputNodeField(schema.String, true)
        },
        get _lt() {
          return new InputNodeField(schema.String, true)
        },
        get _lte() {
          return new InputNodeField(schema.String, true)
        },
        get _neq() {
          return new InputNodeField(schema.String, true)
        },
        get _nilike() {
          return new InputNodeField(schema.String, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get _nlike() {
          return new InputNodeField(schema.String, true)
        },
        get _nsimilar() {
          return new InputNodeField(schema.String, true)
        },
        get _similar() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'String_comparison_exp' }
    )
  },
  get __Directive() {
    return new ObjectNode(
      {
        get args() {
          return new FieldNode(
            new ArrayNode(schema.__InputValue, false),
            undefined,
            false
          )
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get locations() {
          return new FieldNode(
            new ArrayNode(schema.__DirectiveLocation, false),
            undefined,
            false
          )
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
      },
      {
        name: '__Directive',
        extension: ((extensions as any) || {}).__Directive,
      }
    )
  },
  get __DirectiveLocation() {
    return new EnumNode({ name: '__DirectiveLocation' })
  },
  get __EnumValue() {
    return new ObjectNode(
      {
        get deprecationReason() {
          return new FieldNode(schema.String, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get isDeprecated() {
          return new FieldNode(schema.Boolean, undefined, false)
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
      },
      {
        name: '__EnumValue',
        extension: ((extensions as any) || {}).__EnumValue,
      }
    )
  },
  get __Field() {
    return new ObjectNode(
      {
        get args() {
          return new FieldNode(
            new ArrayNode(schema.__InputValue, false),
            undefined,
            false
          )
        },
        get deprecationReason() {
          return new FieldNode(schema.String, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get isDeprecated() {
          return new FieldNode(schema.Boolean, undefined, false)
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
        get type() {
          return new FieldNode(schema.__Type, undefined, false)
        },
      },
      { name: '__Field', extension: ((extensions as any) || {}).__Field }
    )
  },
  get __InputValue() {
    return new ObjectNode(
      {
        get defaultValue() {
          return new FieldNode(schema.String, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
        get type() {
          return new FieldNode(schema.__Type, undefined, false)
        },
      },
      {
        name: '__InputValue',
        extension: ((extensions as any) || {}).__InputValue,
      }
    )
  },
  get __Schema() {
    return new ObjectNode(
      {
        get directives() {
          return new FieldNode(
            new ArrayNode(schema.__Directive, false),
            undefined,
            false
          )
        },
        get mutationType() {
          return new FieldNode(schema.__Type, undefined, true)
        },
        get queryType() {
          return new FieldNode(schema.__Type, undefined, false)
        },
        get subscriptionType() {
          return new FieldNode(schema.__Type, undefined, true)
        },
        get types() {
          return new FieldNode(
            new ArrayNode(schema.__Type, false),
            undefined,
            false
          )
        },
      },
      { name: '__Schema', extension: ((extensions as any) || {}).__Schema }
    )
  },
  get __Type() {
    return new ObjectNode(
      {
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get enumValues() {
          return new FieldNode(
            new ArrayNode(schema.__EnumValue, true),
            new Arguments({
              get includeDeprecated() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get fields() {
          return new FieldNode(
            new ArrayNode(schema.__Field, true),
            new Arguments({
              get includeDeprecated() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get inputFields() {
          return new FieldNode(
            new ArrayNode(schema.__InputValue, true),
            undefined,
            true
          )
        },
        get interfaces() {
          return new FieldNode(
            new ArrayNode(schema.__Type, true),
            undefined,
            true
          )
        },
        get kind() {
          return new FieldNode(schema.__TypeKind, undefined, false)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get ofType() {
          return new FieldNode(schema.__Type, undefined, true)
        },
        get possibleTypes() {
          return new FieldNode(
            new ArrayNode(schema.__Type, true),
            undefined,
            true
          )
        },
      },
      { name: '__Type', extension: ((extensions as any) || {}).__Type }
    )
  },
  get __TypeKind() {
    return new EnumNode({ name: '__TypeKind' })
  },
  get geography() {
    return new ScalarNode({
      name: 'geography',
      extension: ((extensions as any) || {}).geography,
    })
  },
  get geography_cast_exp() {
    return new InputNode(
      {
        get geometry() {
          return new InputNodeField(schema.geometry_comparison_exp, true)
        },
      },
      { name: 'geography_cast_exp' }
    )
  },
  get geography_comparison_exp() {
    return new InputNode(
      {
        get _cast() {
          return new InputNodeField(schema.geography_cast_exp, true)
        },
        get _eq() {
          return new InputNodeField(schema.geography, true)
        },
        get _gt() {
          return new InputNodeField(schema.geography, true)
        },
        get _gte() {
          return new InputNodeField(schema.geography, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.geography, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.geography, true)
        },
        get _lte() {
          return new InputNodeField(schema.geography, true)
        },
        get _neq() {
          return new InputNodeField(schema.geography, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.geography, true), true)
        },
        get _st_d_within() {
          return new InputNodeField(schema.st_d_within_geography_input, true)
        },
        get _st_intersects() {
          return new InputNodeField(schema.geography, true)
        },
      },
      { name: 'geography_comparison_exp' }
    )
  },
  get geometry() {
    return new ScalarNode({
      name: 'geometry',
      extension: ((extensions as any) || {}).geometry,
    })
  },
  get geometry_cast_exp() {
    return new InputNode(
      {
        get geography() {
          return new InputNodeField(schema.geography_comparison_exp, true)
        },
      },
      { name: 'geometry_cast_exp' }
    )
  },
  get geometry_comparison_exp() {
    return new InputNode(
      {
        get _cast() {
          return new InputNodeField(schema.geometry_cast_exp, true)
        },
        get _eq() {
          return new InputNodeField(schema.geometry, true)
        },
        get _gt() {
          return new InputNodeField(schema.geometry, true)
        },
        get _gte() {
          return new InputNodeField(schema.geometry, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.geometry, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.geometry, true)
        },
        get _lte() {
          return new InputNodeField(schema.geometry, true)
        },
        get _neq() {
          return new InputNodeField(schema.geometry, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.geometry, true), true)
        },
        get _st_contains() {
          return new InputNodeField(schema.geometry, true)
        },
        get _st_crosses() {
          return new InputNodeField(schema.geometry, true)
        },
        get _st_d_within() {
          return new InputNodeField(schema.st_d_within_input, true)
        },
        get _st_equals() {
          return new InputNodeField(schema.geometry, true)
        },
        get _st_intersects() {
          return new InputNodeField(schema.geometry, true)
        },
        get _st_overlaps() {
          return new InputNodeField(schema.geometry, true)
        },
        get _st_touches() {
          return new InputNodeField(schema.geometry, true)
        },
        get _st_within() {
          return new InputNodeField(schema.geometry, true)
        },
      },
      { name: 'geometry_comparison_exp' }
    )
  },
  get jsonb() {
    return new ScalarNode({
      name: 'jsonb',
      extension: ((extensions as any) || {}).jsonb,
    })
  },
  get jsonb_comparison_exp() {
    return new InputNode(
      {
        get _contained_in() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _contains() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _eq() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _gt() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _gte() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _has_key() {
          return new InputNodeField(schema.String, true)
        },
        get _has_keys_all() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get _has_keys_any() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.jsonb, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _lte() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _neq() {
          return new InputNodeField(schema.jsonb, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.jsonb, true), true)
        },
      },
      { name: 'jsonb_comparison_exp' }
    )
  },
  get menu_item() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get image() {
          return new FieldNode(schema.String, undefined, true)
        },
        get location() {
          return new FieldNode(schema.geometry, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
        get price() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
      },
      { name: 'menu_item', extension: ((extensions as any) || {}).menu_item }
    )
  },
  get menu_item_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(
            schema.menu_item_aggregate_fields,
            undefined,
            true
          )
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.menu_item, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'menu_item_aggregate',
        extension: ((extensions as any) || {}).menu_item_aggregate,
      }
    )
  },
  get menu_item_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.menu_item_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.menu_item_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.menu_item_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.menu_item_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(
            schema.menu_item_stddev_pop_fields,
            undefined,
            true
          )
        },
        get stddev_samp() {
          return new FieldNode(
            schema.menu_item_stddev_samp_fields,
            undefined,
            true
          )
        },
        get sum() {
          return new FieldNode(schema.menu_item_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(schema.menu_item_var_pop_fields, undefined, true)
        },
        get var_samp() {
          return new FieldNode(
            schema.menu_item_var_samp_fields,
            undefined,
            true
          )
        },
        get variance() {
          return new FieldNode(
            schema.menu_item_variance_fields,
            undefined,
            true
          )
        },
      },
      {
        name: 'menu_item_aggregate_fields',
        extension: ((extensions as any) || {}).menu_item_aggregate_fields,
      }
    )
  },
  get menu_item_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.menu_item_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.menu_item_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.menu_item_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.menu_item_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.menu_item_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(schema.menu_item_stddev_samp_order_by, true)
        },
        get sum() {
          return new InputNodeField(schema.menu_item_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.menu_item_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.menu_item_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.menu_item_variance_order_by, true)
        },
      },
      { name: 'menu_item_aggregate_order_by' }
    )
  },
  get menu_item_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.menu_item_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.menu_item_on_conflict, true)
        },
      },
      { name: 'menu_item_arr_rel_insert_input' }
    )
  },
  get menu_item_avg_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_avg_fields',
        extension: ((extensions as any) || {}).menu_item_avg_fields,
      }
    )
  },
  get menu_item_avg_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_avg_order_by' }
    )
  },
  get menu_item_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.menu_item_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.menu_item_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.menu_item_bool_exp, true),
            true
          )
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get description() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get image() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get location() {
          return new InputNodeField(schema.geometry_comparison_exp, true)
        },
        get name() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get price() {
          return new InputNodeField(schema.Int_comparison_exp, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
      },
      { name: 'menu_item_bool_exp' }
    )
  },
  get menu_item_constraint() {
    return new EnumNode({ name: 'menu_item_constraint' })
  },
  get menu_item_inc_input() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'menu_item_inc_input' }
    )
  },
  get menu_item_insert_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get description() {
          return new InputNodeField(schema.String, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get image() {
          return new InputNodeField(schema.String, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get name() {
          return new InputNodeField(schema.String, true)
        },
        get price() {
          return new InputNodeField(schema.Int, true)
        },
        get restaurant() {
          return new InputNodeField(
            schema.restaurant_obj_rel_insert_input,
            true
          )
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'menu_item_insert_input' }
    )
  },
  get menu_item_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get image() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get price() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'menu_item_max_fields',
        extension: ((extensions as any) || {}).menu_item_max_fields,
      }
    )
  },
  get menu_item_max_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get image() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_max_order_by' }
    )
  },
  get menu_item_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get image() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get price() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'menu_item_min_fields',
        extension: ((extensions as any) || {}).menu_item_min_fields,
      }
    )
  },
  get menu_item_min_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get image() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_min_order_by' }
    )
  },
  get menu_item_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.menu_item, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'menu_item_mutation_response',
        extension: ((extensions as any) || {}).menu_item_mutation_response,
      }
    )
  },
  get menu_item_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.menu_item_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.menu_item_on_conflict, true)
        },
      },
      { name: 'menu_item_obj_rel_insert_input' }
    )
  },
  get menu_item_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.menu_item_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.menu_item_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.menu_item_bool_exp, true)
        },
      },
      { name: 'menu_item_on_conflict' }
    )
  },
  get menu_item_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get image() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_order_by' }
    )
  },
  get menu_item_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'menu_item_pk_columns_input' }
    )
  },
  get menu_item_select_column() {
    return new EnumNode({ name: 'menu_item_select_column' })
  },
  get menu_item_set_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get description() {
          return new InputNodeField(schema.String, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get image() {
          return new InputNodeField(schema.String, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get name() {
          return new InputNodeField(schema.String, true)
        },
        get price() {
          return new InputNodeField(schema.Int, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'menu_item_set_input' }
    )
  },
  get menu_item_stddev_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_stddev_fields',
        extension: ((extensions as any) || {}).menu_item_stddev_fields,
      }
    )
  },
  get menu_item_stddev_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_stddev_order_by' }
    )
  },
  get menu_item_stddev_pop_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_stddev_pop_fields',
        extension: ((extensions as any) || {}).menu_item_stddev_pop_fields,
      }
    )
  },
  get menu_item_stddev_pop_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_stddev_pop_order_by' }
    )
  },
  get menu_item_stddev_samp_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_stddev_samp_fields',
        extension: ((extensions as any) || {}).menu_item_stddev_samp_fields,
      }
    )
  },
  get menu_item_stddev_samp_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_stddev_samp_order_by' }
    )
  },
  get menu_item_sum_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Int, undefined, true)
        },
      },
      {
        name: 'menu_item_sum_fields',
        extension: ((extensions as any) || {}).menu_item_sum_fields,
      }
    )
  },
  get menu_item_sum_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_sum_order_by' }
    )
  },
  get menu_item_update_column() {
    return new EnumNode({ name: 'menu_item_update_column' })
  },
  get menu_item_var_pop_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_var_pop_fields',
        extension: ((extensions as any) || {}).menu_item_var_pop_fields,
      }
    )
  },
  get menu_item_var_pop_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_var_pop_order_by' }
    )
  },
  get menu_item_var_samp_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_var_samp_fields',
        extension: ((extensions as any) || {}).menu_item_var_samp_fields,
      }
    )
  },
  get menu_item_var_samp_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_var_samp_order_by' }
    )
  },
  get menu_item_variance_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'menu_item_variance_fields',
        extension: ((extensions as any) || {}).menu_item_variance_fields,
      }
    )
  },
  get menu_item_variance_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'menu_item_variance_order_by' }
    )
  },
  get mutation_root() {
    return new ObjectNode(
      {
        get delete_menu_item() {
          return new FieldNode(
            schema.menu_item_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.menu_item_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_menu_item_by_pk() {
          return new FieldNode(
            schema.menu_item,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_opening_hours() {
          return new FieldNode(
            schema.opening_hours_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(
                    schema.opening_hours_bool_exp,
                    false
                  )
                },
              },
              true
            ),
            true
          )
        },
        get delete_opening_hours_by_pk() {
          return new FieldNode(
            schema.opening_hours,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_photo() {
          return new FieldNode(
            schema.photo_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.photo_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_photo_by_pk() {
          return new FieldNode(
            schema.photo,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_photo_xref() {
          return new FieldNode(
            schema.photo_xref_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.photo_xref_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_photo_xref_by_pk() {
          return new FieldNode(
            schema.photo_xref,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_restaurant() {
          return new FieldNode(
            schema.restaurant_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.restaurant_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_restaurant_by_pk() {
          return new FieldNode(
            schema.restaurant,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_restaurant_tag() {
          return new FieldNode(
            schema.restaurant_tag_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(
                    schema.restaurant_tag_bool_exp,
                    false
                  )
                },
              },
              true
            ),
            true
          )
        },
        get delete_restaurant_tag_by_pk() {
          return new FieldNode(
            schema.restaurant_tag,
            new Arguments(
              {
                get restaurant_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_review() {
          return new FieldNode(
            schema.review_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.review_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_review_by_pk() {
          return new FieldNode(
            schema.review,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_review_tag_sentence() {
          return new FieldNode(
            schema.review_tag_sentence_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(
                    schema.review_tag_sentence_bool_exp,
                    false
                  )
                },
              },
              true
            ),
            true
          )
        },
        get delete_review_tag_sentence_by_pk() {
          return new FieldNode(
            schema.review_tag_sentence,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_setting() {
          return new FieldNode(
            schema.setting_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.setting_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_setting_by_pk() {
          return new FieldNode(
            schema.setting,
            new Arguments(
              {
                get key() {
                  return new ArgumentsField(schema.String, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_tag() {
          return new FieldNode(
            schema.tag_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.tag_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_tag_by_pk() {
          return new FieldNode(
            schema.tag,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_tag_tag() {
          return new FieldNode(
            schema.tag_tag_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.tag_tag_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_tag_tag_by_pk() {
          return new FieldNode(
            schema.tag_tag,
            new Arguments(
              {
                get category_tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_user() {
          return new FieldNode(
            schema.user_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.user_bool_exp, false)
                },
              },
              true
            ),
            true
          )
        },
        get delete_user_by_pk() {
          return new FieldNode(
            schema.user,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get insert_menu_item() {
          return new FieldNode(
            schema.menu_item_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.menu_item_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_menu_item_one() {
          return new FieldNode(
            schema.menu_item,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.menu_item_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.menu_item_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_opening_hours() {
          return new FieldNode(
            schema.opening_hours_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(
                  schema.opening_hours_on_conflict,
                  true
                )
              },
            }),
            true
          )
        },
        get insert_opening_hours_one() {
          return new FieldNode(
            schema.opening_hours,
            new Arguments({
              get object() {
                return new ArgumentsField(
                  schema.opening_hours_insert_input,
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(
                  schema.opening_hours_on_conflict,
                  true
                )
              },
            }),
            true
          )
        },
        get insert_photo() {
          return new FieldNode(
            schema.photo_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.photo_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_photo_one() {
          return new FieldNode(
            schema.photo,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.photo_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.photo_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_photo_xref() {
          return new FieldNode(
            schema.photo_xref_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.photo_xref_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_photo_xref_one() {
          return new FieldNode(
            schema.photo_xref,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.photo_xref_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.photo_xref_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_restaurant() {
          return new FieldNode(
            schema.restaurant_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.restaurant_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_restaurant_one() {
          return new FieldNode(
            schema.restaurant,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.restaurant_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.restaurant_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_restaurant_tag() {
          return new FieldNode(
            schema.restaurant_tag_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(
                  schema.restaurant_tag_on_conflict,
                  true
                )
              },
            }),
            true
          )
        },
        get insert_restaurant_tag_one() {
          return new FieldNode(
            schema.restaurant_tag,
            new Arguments({
              get object() {
                return new ArgumentsField(
                  schema.restaurant_tag_insert_input,
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(
                  schema.restaurant_tag_on_conflict,
                  true
                )
              },
            }),
            true
          )
        },
        get insert_review() {
          return new FieldNode(
            schema.review_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.review_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_review_one() {
          return new FieldNode(
            schema.review,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.review_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.review_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_review_tag_sentence() {
          return new FieldNode(
            schema.review_tag_sentence_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(
                  schema.review_tag_sentence_on_conflict,
                  true
                )
              },
            }),
            true
          )
        },
        get insert_review_tag_sentence_one() {
          return new FieldNode(
            schema.review_tag_sentence,
            new Arguments({
              get object() {
                return new ArgumentsField(
                  schema.review_tag_sentence_insert_input,
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(
                  schema.review_tag_sentence_on_conflict,
                  true
                )
              },
            }),
            true
          )
        },
        get insert_setting() {
          return new FieldNode(
            schema.setting_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.setting_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_setting_one() {
          return new FieldNode(
            schema.setting,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.setting_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.setting_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_tag() {
          return new FieldNode(
            schema.tag_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.tag_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_tag_one() {
          return new FieldNode(
            schema.tag,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.tag_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.tag_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_tag_tag() {
          return new FieldNode(
            schema.tag_tag_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.tag_tag_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_tag_tag_one() {
          return new FieldNode(
            schema.tag_tag,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.tag_tag_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.tag_tag_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_user() {
          return new FieldNode(
            schema.user_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.user_on_conflict, true)
              },
            }),
            true
          )
        },
        get insert_user_one() {
          return new FieldNode(
            schema.user,
            new Arguments({
              get object() {
                return new ArgumentsField(schema.user_insert_input, false)
              },
              get on_conflict() {
                return new ArgumentsField(schema.user_on_conflict, true)
              },
            }),
            true
          )
        },
        get update_menu_item() {
          return new FieldNode(
            schema.menu_item_mutation_response,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.menu_item_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.menu_item_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_menu_item_by_pk() {
          return new FieldNode(
            schema.menu_item,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.menu_item_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.menu_item_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.menu_item_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_opening_hours() {
          return new FieldNode(
            schema.opening_hours_mutation_response,
            new Arguments({
              get _set() {
                return new ArgumentsField(schema.opening_hours_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.opening_hours_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_opening_hours_by_pk() {
          return new FieldNode(
            schema.opening_hours,
            new Arguments({
              get _set() {
                return new ArgumentsField(schema.opening_hours_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.opening_hours_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_photo() {
          return new FieldNode(
            schema.photo_mutation_response,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.photo_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.photo_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.photo_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_photo_by_pk() {
          return new FieldNode(
            schema.photo,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.photo_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.photo_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(schema.photo_pk_columns_input, false)
              },
            }),
            true
          )
        },
        get update_photo_xref() {
          return new FieldNode(
            schema.photo_xref_mutation_response,
            new Arguments({
              get _set() {
                return new ArgumentsField(schema.photo_xref_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.photo_xref_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_photo_xref_by_pk() {
          return new FieldNode(
            schema.photo_xref,
            new Arguments({
              get _set() {
                return new ArgumentsField(schema.photo_xref_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.photo_xref_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_restaurant() {
          return new FieldNode(
            schema.restaurant_mutation_response,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.restaurant_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.restaurant_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(
                  schema.restaurant_delete_elem_input,
                  true
                )
              },
              get _delete_key() {
                return new ArgumentsField(
                  schema.restaurant_delete_key_input,
                  true
                )
              },
              get _inc() {
                return new ArgumentsField(schema.restaurant_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.restaurant_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.restaurant_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.restaurant_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_restaurant_by_pk() {
          return new FieldNode(
            schema.restaurant,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.restaurant_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.restaurant_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(
                  schema.restaurant_delete_elem_input,
                  true
                )
              },
              get _delete_key() {
                return new ArgumentsField(
                  schema.restaurant_delete_key_input,
                  true
                )
              },
              get _inc() {
                return new ArgumentsField(schema.restaurant_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.restaurant_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.restaurant_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.restaurant_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_restaurant_tag() {
          return new FieldNode(
            schema.restaurant_tag_mutation_response,
            new Arguments({
              get _append() {
                return new ArgumentsField(
                  schema.restaurant_tag_append_input,
                  true
                )
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.restaurant_tag_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(
                  schema.restaurant_tag_delete_elem_input,
                  true
                )
              },
              get _delete_key() {
                return new ArgumentsField(
                  schema.restaurant_tag_delete_key_input,
                  true
                )
              },
              get _inc() {
                return new ArgumentsField(schema.restaurant_tag_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(
                  schema.restaurant_tag_prepend_input,
                  true
                )
              },
              get _set() {
                return new ArgumentsField(schema.restaurant_tag_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_restaurant_tag_by_pk() {
          return new FieldNode(
            schema.restaurant_tag,
            new Arguments({
              get _append() {
                return new ArgumentsField(
                  schema.restaurant_tag_append_input,
                  true
                )
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.restaurant_tag_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(
                  schema.restaurant_tag_delete_elem_input,
                  true
                )
              },
              get _delete_key() {
                return new ArgumentsField(
                  schema.restaurant_tag_delete_key_input,
                  true
                )
              },
              get _inc() {
                return new ArgumentsField(schema.restaurant_tag_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(
                  schema.restaurant_tag_prepend_input,
                  true
                )
              },
              get _set() {
                return new ArgumentsField(schema.restaurant_tag_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.restaurant_tag_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_review() {
          return new FieldNode(
            schema.review_mutation_response,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.review_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.review_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(schema.review_delete_elem_input, true)
              },
              get _delete_key() {
                return new ArgumentsField(schema.review_delete_key_input, true)
              },
              get _inc() {
                return new ArgumentsField(schema.review_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.review_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.review_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_review_by_pk() {
          return new FieldNode(
            schema.review,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.review_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.review_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(schema.review_delete_elem_input, true)
              },
              get _delete_key() {
                return new ArgumentsField(schema.review_delete_key_input, true)
              },
              get _inc() {
                return new ArgumentsField(schema.review_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.review_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.review_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(schema.review_pk_columns_input, false)
              },
            }),
            true
          )
        },
        get update_review_tag_sentence() {
          return new FieldNode(
            schema.review_tag_sentence_mutation_response,
            new Arguments({
              get _inc() {
                return new ArgumentsField(
                  schema.review_tag_sentence_inc_input,
                  true
                )
              },
              get _set() {
                return new ArgumentsField(
                  schema.review_tag_sentence_set_input,
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  false
                )
              },
            }),
            true
          )
        },
        get update_review_tag_sentence_by_pk() {
          return new FieldNode(
            schema.review_tag_sentence,
            new Arguments({
              get _inc() {
                return new ArgumentsField(
                  schema.review_tag_sentence_inc_input,
                  true
                )
              },
              get _set() {
                return new ArgumentsField(
                  schema.review_tag_sentence_set_input,
                  true
                )
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.review_tag_sentence_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_setting() {
          return new FieldNode(
            schema.setting_mutation_response,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.setting_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.setting_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(
                  schema.setting_delete_elem_input,
                  true
                )
              },
              get _delete_key() {
                return new ArgumentsField(schema.setting_delete_key_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.setting_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.setting_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.setting_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_setting_by_pk() {
          return new FieldNode(
            schema.setting,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.setting_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.setting_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(
                  schema.setting_delete_elem_input,
                  true
                )
              },
              get _delete_key() {
                return new ArgumentsField(schema.setting_delete_key_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.setting_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.setting_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.setting_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_tag() {
          return new FieldNode(
            schema.tag_mutation_response,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.tag_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(schema.tag_delete_at_path_input, true)
              },
              get _delete_elem() {
                return new ArgumentsField(schema.tag_delete_elem_input, true)
              },
              get _delete_key() {
                return new ArgumentsField(schema.tag_delete_key_input, true)
              },
              get _inc() {
                return new ArgumentsField(schema.tag_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.tag_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.tag_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.tag_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_tag_by_pk() {
          return new FieldNode(
            schema.tag,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.tag_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(schema.tag_delete_at_path_input, true)
              },
              get _delete_elem() {
                return new ArgumentsField(schema.tag_delete_elem_input, true)
              },
              get _delete_key() {
                return new ArgumentsField(schema.tag_delete_key_input, true)
              },
              get _inc() {
                return new ArgumentsField(schema.tag_inc_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.tag_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.tag_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(schema.tag_pk_columns_input, false)
              },
            }),
            true
          )
        },
        get update_tag_tag() {
          return new FieldNode(
            schema.tag_tag_mutation_response,
            new Arguments({
              get _set() {
                return new ArgumentsField(schema.tag_tag_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_tag_tag_by_pk() {
          return new FieldNode(
            schema.tag_tag,
            new Arguments({
              get _set() {
                return new ArgumentsField(schema.tag_tag_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(
                  schema.tag_tag_pk_columns_input,
                  false
                )
              },
            }),
            true
          )
        },
        get update_user() {
          return new FieldNode(
            schema.user_mutation_response,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.user_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.user_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.user_bool_exp, false)
              },
            }),
            true
          )
        },
        get update_user_by_pk() {
          return new FieldNode(
            schema.user,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.user_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.user_set_input, true)
              },
              get pk_columns() {
                return new ArgumentsField(schema.user_pk_columns_input, false)
              },
            }),
            true
          )
        },
      },
      {
        name: 'mutation_root',
        extension: ((extensions as any) || {}).mutation_root,
      }
    )
  },
  get numeric() {
    return new ScalarNode({
      name: 'numeric',
      extension: ((extensions as any) || {}).numeric,
    })
  },
  get numeric_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.numeric, true)
        },
        get _gt() {
          return new InputNodeField(schema.numeric, true)
        },
        get _gte() {
          return new InputNodeField(schema.numeric, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.numeric, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.numeric, true)
        },
        get _lte() {
          return new InputNodeField(schema.numeric, true)
        },
        get _neq() {
          return new InputNodeField(schema.numeric, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.numeric, true), true)
        },
      },
      { name: 'numeric_comparison_exp' }
    )
  },
  get opening_hours() {
    return new ObjectNode(
      {
        get hours() {
          return new FieldNode(schema.tsrange, undefined, false)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
      },
      {
        name: 'opening_hours',
        extension: ((extensions as any) || {}).opening_hours,
      }
    )
  },
  get opening_hours_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(
            schema.opening_hours_aggregate_fields,
            undefined,
            true
          )
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.opening_hours, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'opening_hours_aggregate',
        extension: ((extensions as any) || {}).opening_hours_aggregate,
      }
    )
  },
  get opening_hours_aggregate_fields() {
    return new ObjectNode(
      {
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.opening_hours_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.opening_hours_min_fields, undefined, true)
        },
      },
      {
        name: 'opening_hours_aggregate_fields',
        extension: ((extensions as any) || {}).opening_hours_aggregate_fields,
      }
    )
  },
  get opening_hours_aggregate_order_by() {
    return new InputNode(
      {
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.opening_hours_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.opening_hours_min_order_by, true)
        },
      },
      { name: 'opening_hours_aggregate_order_by' }
    )
  },
  get opening_hours_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.opening_hours_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.opening_hours_on_conflict, true)
        },
      },
      { name: 'opening_hours_arr_rel_insert_input' }
    )
  },
  get opening_hours_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.opening_hours_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.opening_hours_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.opening_hours_bool_exp, true),
            true
          )
        },
        get hours() {
          return new InputNodeField(schema.tsrange_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
      },
      { name: 'opening_hours_bool_exp' }
    )
  },
  get opening_hours_constraint() {
    return new EnumNode({ name: 'opening_hours_constraint' })
  },
  get opening_hours_insert_input() {
    return new InputNode(
      {
        get hours() {
          return new InputNodeField(schema.tsrange, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get restaurant() {
          return new InputNodeField(
            schema.restaurant_obj_rel_insert_input,
            true
          )
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'opening_hours_insert_input' }
    )
  },
  get opening_hours_max_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'opening_hours_max_fields',
        extension: ((extensions as any) || {}).opening_hours_max_fields,
      }
    )
  },
  get opening_hours_max_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'opening_hours_max_order_by' }
    )
  },
  get opening_hours_min_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'opening_hours_min_fields',
        extension: ((extensions as any) || {}).opening_hours_min_fields,
      }
    )
  },
  get opening_hours_min_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'opening_hours_min_order_by' }
    )
  },
  get opening_hours_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.opening_hours, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'opening_hours_mutation_response',
        extension: ((extensions as any) || {}).opening_hours_mutation_response,
      }
    )
  },
  get opening_hours_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.opening_hours_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.opening_hours_on_conflict, true)
        },
      },
      { name: 'opening_hours_obj_rel_insert_input' }
    )
  },
  get opening_hours_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.opening_hours_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.opening_hours_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.opening_hours_bool_exp, true)
        },
      },
      { name: 'opening_hours_on_conflict' }
    )
  },
  get opening_hours_order_by() {
    return new InputNode(
      {
        get hours() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'opening_hours_order_by' }
    )
  },
  get opening_hours_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'opening_hours_pk_columns_input' }
    )
  },
  get opening_hours_select_column() {
    return new EnumNode({ name: 'opening_hours_select_column' })
  },
  get opening_hours_set_input() {
    return new InputNode(
      {
        get hours() {
          return new InputNodeField(schema.tsrange, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'opening_hours_set_input' }
    )
  },
  get opening_hours_update_column() {
    return new EnumNode({ name: 'opening_hours_update_column' })
  },
  get order_by() {
    return new EnumNode({ name: 'order_by' })
  },
  get photo() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get origin() {
          return new FieldNode(schema.String, undefined, true)
        },
        get quality() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get url() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      { name: 'photo', extension: ((extensions as any) || {}).photo }
    )
  },
  get photo_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.photo_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.photo, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'photo_aggregate',
        extension: ((extensions as any) || {}).photo_aggregate,
      }
    )
  },
  get photo_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.photo_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.photo_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.photo_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.photo_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(schema.photo_stddev_pop_fields, undefined, true)
        },
        get stddev_samp() {
          return new FieldNode(schema.photo_stddev_samp_fields, undefined, true)
        },
        get sum() {
          return new FieldNode(schema.photo_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(schema.photo_var_pop_fields, undefined, true)
        },
        get var_samp() {
          return new FieldNode(schema.photo_var_samp_fields, undefined, true)
        },
        get variance() {
          return new FieldNode(schema.photo_variance_fields, undefined, true)
        },
      },
      {
        name: 'photo_aggregate_fields',
        extension: ((extensions as any) || {}).photo_aggregate_fields,
      }
    )
  },
  get photo_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.photo_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.photo_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.photo_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.photo_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.photo_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(schema.photo_stddev_samp_order_by, true)
        },
        get sum() {
          return new InputNodeField(schema.photo_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.photo_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.photo_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.photo_variance_order_by, true)
        },
      },
      { name: 'photo_aggregate_order_by' }
    )
  },
  get photo_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.photo_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.photo_on_conflict, true)
        },
      },
      { name: 'photo_arr_rel_insert_input' }
    )
  },
  get photo_avg_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_avg_fields',
        extension: ((extensions as any) || {}).photo_avg_fields,
      }
    )
  },
  get photo_avg_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_avg_order_by' }
    )
  },
  get photo_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.photo_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.photo_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.photo_bool_exp, true),
            true
          )
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get origin() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get quality() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get url() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
      },
      { name: 'photo_bool_exp' }
    )
  },
  get photo_constraint() {
    return new EnumNode({ name: 'photo_constraint' })
  },
  get photo_inc_input() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'photo_inc_input' }
    )
  },
  get photo_insert_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get origin() {
          return new InputNodeField(schema.String, true)
        },
        get quality() {
          return new InputNodeField(schema.numeric, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get url() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'photo_insert_input' }
    )
  },
  get photo_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get origin() {
          return new FieldNode(schema.String, undefined, true)
        },
        get quality() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get url() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      {
        name: 'photo_max_fields',
        extension: ((extensions as any) || {}).photo_max_fields,
      }
    )
  },
  get photo_max_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get origin() {
          return new InputNodeField(schema.order_by, true)
        },
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get url() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_max_order_by' }
    )
  },
  get photo_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get origin() {
          return new FieldNode(schema.String, undefined, true)
        },
        get quality() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get url() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      {
        name: 'photo_min_fields',
        extension: ((extensions as any) || {}).photo_min_fields,
      }
    )
  },
  get photo_min_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get origin() {
          return new InputNodeField(schema.order_by, true)
        },
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get url() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_min_order_by' }
    )
  },
  get photo_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.photo, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'photo_mutation_response',
        extension: ((extensions as any) || {}).photo_mutation_response,
      }
    )
  },
  get photo_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.photo_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.photo_on_conflict, true)
        },
      },
      { name: 'photo_obj_rel_insert_input' }
    )
  },
  get photo_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.photo_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.photo_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.photo_bool_exp, true)
        },
      },
      { name: 'photo_on_conflict' }
    )
  },
  get photo_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get origin() {
          return new InputNodeField(schema.order_by, true)
        },
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get url() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_order_by' }
    )
  },
  get photo_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'photo_pk_columns_input' }
    )
  },
  get photo_select_column() {
    return new EnumNode({ name: 'photo_select_column' })
  },
  get photo_set_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get origin() {
          return new InputNodeField(schema.String, true)
        },
        get quality() {
          return new InputNodeField(schema.numeric, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get url() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'photo_set_input' }
    )
  },
  get photo_stddev_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_stddev_fields',
        extension: ((extensions as any) || {}).photo_stddev_fields,
      }
    )
  },
  get photo_stddev_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_stddev_order_by' }
    )
  },
  get photo_stddev_pop_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_stddev_pop_fields',
        extension: ((extensions as any) || {}).photo_stddev_pop_fields,
      }
    )
  },
  get photo_stddev_pop_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_stddev_pop_order_by' }
    )
  },
  get photo_stddev_samp_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_stddev_samp_fields',
        extension: ((extensions as any) || {}).photo_stddev_samp_fields,
      }
    )
  },
  get photo_stddev_samp_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_stddev_samp_order_by' }
    )
  },
  get photo_sum_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'photo_sum_fields',
        extension: ((extensions as any) || {}).photo_sum_fields,
      }
    )
  },
  get photo_sum_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_sum_order_by' }
    )
  },
  get photo_update_column() {
    return new EnumNode({ name: 'photo_update_column' })
  },
  get photo_var_pop_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_var_pop_fields',
        extension: ((extensions as any) || {}).photo_var_pop_fields,
      }
    )
  },
  get photo_var_pop_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_var_pop_order_by' }
    )
  },
  get photo_var_samp_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_var_samp_fields',
        extension: ((extensions as any) || {}).photo_var_samp_fields,
      }
    )
  },
  get photo_var_samp_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_var_samp_order_by' }
    )
  },
  get photo_variance_fields() {
    return new ObjectNode(
      {
        get quality() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'photo_variance_fields',
        extension: ((extensions as any) || {}).photo_variance_fields,
      }
    )
  },
  get photo_variance_order_by() {
    return new InputNode(
      {
        get quality() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_variance_order_by' }
    )
  },
  get photo_xref() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get photo() {
          return new FieldNode(schema.photo, undefined, false)
        },
        get photo_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      { name: 'photo_xref', extension: ((extensions as any) || {}).photo_xref }
    )
  },
  get photo_xref_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(
            schema.photo_xref_aggregate_fields,
            undefined,
            true
          )
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.photo_xref, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'photo_xref_aggregate',
        extension: ((extensions as any) || {}).photo_xref_aggregate,
      }
    )
  },
  get photo_xref_aggregate_fields() {
    return new ObjectNode(
      {
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.photo_xref_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.photo_xref_min_fields, undefined, true)
        },
      },
      {
        name: 'photo_xref_aggregate_fields',
        extension: ((extensions as any) || {}).photo_xref_aggregate_fields,
      }
    )
  },
  get photo_xref_aggregate_order_by() {
    return new InputNode(
      {
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.photo_xref_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.photo_xref_min_order_by, true)
        },
      },
      { name: 'photo_xref_aggregate_order_by' }
    )
  },
  get photo_xref_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.photo_xref_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.photo_xref_on_conflict, true)
        },
      },
      { name: 'photo_xref_arr_rel_insert_input' }
    )
  },
  get photo_xref_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.photo_xref_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.photo_xref_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.photo_xref_bool_exp, true),
            true
          )
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get photo() {
          return new InputNodeField(schema.photo_bool_exp, true)
        },
        get photo_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get type() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
      },
      { name: 'photo_xref_bool_exp' }
    )
  },
  get photo_xref_constraint() {
    return new EnumNode({ name: 'photo_xref_constraint' })
  },
  get photo_xref_insert_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get photo() {
          return new InputNodeField(schema.photo_obj_rel_insert_input, true)
        },
        get photo_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get type() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'photo_xref_insert_input' }
    )
  },
  get photo_xref_max_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get photo_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      {
        name: 'photo_xref_max_fields',
        extension: ((extensions as any) || {}).photo_xref_max_fields,
      }
    )
  },
  get photo_xref_max_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get photo_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_xref_max_order_by' }
    )
  },
  get photo_xref_min_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get photo_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      {
        name: 'photo_xref_min_fields',
        extension: ((extensions as any) || {}).photo_xref_min_fields,
      }
    )
  },
  get photo_xref_min_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get photo_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_xref_min_order_by' }
    )
  },
  get photo_xref_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.photo_xref, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'photo_xref_mutation_response',
        extension: ((extensions as any) || {}).photo_xref_mutation_response,
      }
    )
  },
  get photo_xref_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.photo_xref_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.photo_xref_on_conflict, true)
        },
      },
      { name: 'photo_xref_obj_rel_insert_input' }
    )
  },
  get photo_xref_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.photo_xref_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.photo_xref_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.photo_xref_bool_exp, true)
        },
      },
      { name: 'photo_xref_on_conflict' }
    )
  },
  get photo_xref_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get photo() {
          return new InputNodeField(schema.photo_order_by, true)
        },
        get photo_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'photo_xref_order_by' }
    )
  },
  get photo_xref_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'photo_xref_pk_columns_input' }
    )
  },
  get photo_xref_select_column() {
    return new EnumNode({ name: 'photo_xref_select_column' })
  },
  get photo_xref_set_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get photo_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get type() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'photo_xref_set_input' }
    )
  },
  get photo_xref_update_column() {
    return new EnumNode({ name: 'photo_xref_update_column' })
  },
  get query_root() {
    return new ObjectNode(
      {
        get menu_item() {
          return new FieldNode(
            new ArrayNode(schema.menu_item, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, true)
              },
            }),
            false
          )
        },
        get menu_item_aggregate() {
          return new FieldNode(
            schema.menu_item_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, true)
              },
            }),
            false
          )
        },
        get menu_item_by_pk() {
          return new FieldNode(
            schema.menu_item,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get opening_hours() {
          return new FieldNode(
            new ArrayNode(schema.opening_hours, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.opening_hours_bool_exp, true)
              },
            }),
            false
          )
        },
        get opening_hours_aggregate() {
          return new FieldNode(
            schema.opening_hours_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.opening_hours_bool_exp, true)
              },
            }),
            false
          )
        },
        get opening_hours_by_pk() {
          return new FieldNode(
            schema.opening_hours,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get photo() {
          return new FieldNode(
            new ArrayNode(schema.photo, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_aggregate() {
          return new FieldNode(
            schema.photo_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_by_pk() {
          return new FieldNode(
            schema.photo,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get photo_xref() {
          return new FieldNode(
            new ArrayNode(schema.photo_xref, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_xref_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_xref_aggregate() {
          return new FieldNode(
            schema.photo_xref_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_xref_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_xref_by_pk() {
          return new FieldNode(
            schema.photo_xref,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get restaurant() {
          return new FieldNode(
            new ArrayNode(schema.restaurant, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_aggregate() {
          return new FieldNode(
            schema.restaurant_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_by_pk() {
          return new FieldNode(
            schema.restaurant,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get restaurant_tag() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_tag_aggregate() {
          return new FieldNode(
            schema.restaurant_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_tag_by_pk() {
          return new FieldNode(
            schema.restaurant_tag,
            new Arguments(
              {
                get restaurant_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get review() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get review_aggregate() {
          return new FieldNode(
            schema.review_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get review_by_pk() {
          return new FieldNode(
            schema.review,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get review_tag_sentence() {
          return new FieldNode(
            new ArrayNode(schema.review_tag_sentence, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get review_tag_sentence_aggregate() {
          return new FieldNode(
            schema.review_tag_sentence_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get review_tag_sentence_by_pk() {
          return new FieldNode(
            schema.review_tag_sentence,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get setting() {
          return new FieldNode(
            new ArrayNode(schema.setting, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.setting_bool_exp, true)
              },
            }),
            false
          )
        },
        get setting_aggregate() {
          return new FieldNode(
            schema.setting_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.setting_bool_exp, true)
              },
            }),
            false
          )
        },
        get setting_by_pk() {
          return new FieldNode(
            schema.setting,
            new Arguments(
              {
                get key() {
                  return new ArgumentsField(schema.String, false)
                },
              },
              true
            ),
            true
          )
        },
        get tag() {
          return new FieldNode(
            new ArrayNode(schema.tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_aggregate() {
          return new FieldNode(
            schema.tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_by_pk() {
          return new FieldNode(
            schema.tag,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get tag_tag() {
          return new FieldNode(
            new ArrayNode(schema.tag_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_tag_aggregate() {
          return new FieldNode(
            schema.tag_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_tag_by_pk() {
          return new FieldNode(
            schema.tag_tag,
            new Arguments(
              {
                get category_tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get user() {
          return new FieldNode(
            new ArrayNode(schema.user, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.user_bool_exp, true)
              },
            }),
            false
          )
        },
        get user_aggregate() {
          return new FieldNode(
            schema.user_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.user_bool_exp, true)
              },
            }),
            false
          )
        },
        get user_by_pk() {
          return new FieldNode(
            schema.user,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
      },
      { name: 'query_root', extension: ((extensions as any) || {}).query_root }
    )
  },
  get restaurant() {
    return new ObjectNode(
      {
        get address() {
          return new FieldNode(schema.String, undefined, true)
        },
        get city() {
          return new FieldNode(schema.String, undefined, true)
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get geocoder_id() {
          return new FieldNode(schema.String, undefined, true)
        },
        get headlines() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get hours() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get image() {
          return new FieldNode(schema.String, undefined, true)
        },
        get is_open_now() {
          return new FieldNode(schema.Boolean, undefined, true)
        },
        get location() {
          return new FieldNode(schema.geometry, undefined, false)
        },
        get menu_items() {
          return new FieldNode(
            new ArrayNode(schema.menu_item, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, true)
              },
            }),
            false
          )
        },
        get menu_items_aggregate() {
          return new FieldNode(
            schema.menu_item_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, true)
              },
            }),
            false
          )
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
        get photos() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get price_range() {
          return new FieldNode(schema.String, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get rating_factors() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get reviews() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get reviews_aggregate() {
          return new FieldNode(
            schema.review_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score_breakdown() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get slug() {
          return new FieldNode(schema.String, undefined, false)
        },
        get sources() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get state() {
          return new FieldNode(schema.String, undefined, true)
        },
        get tag_names() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get tags() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tags_aggregate() {
          return new FieldNode(
            schema.restaurant_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get telephone() {
          return new FieldNode(schema.String, undefined, true)
        },
        get top_tags() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, true),
            new Arguments({
              get args() {
                return new ArgumentsField(
                  schema.restaurant_top_tags_args,
                  false
                )
              },
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            true
          )
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get website() {
          return new FieldNode(schema.String, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      { name: 'restaurant', extension: ((extensions as any) || {}).restaurant }
    )
  },
  get restaurant_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(
            schema.restaurant_aggregate_fields,
            undefined,
            true
          )
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.restaurant, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'restaurant_aggregate',
        extension: ((extensions as any) || {}).restaurant_aggregate,
      }
    )
  },
  get restaurant_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.restaurant_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.restaurant_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.restaurant_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.restaurant_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(
            schema.restaurant_stddev_pop_fields,
            undefined,
            true
          )
        },
        get stddev_samp() {
          return new FieldNode(
            schema.restaurant_stddev_samp_fields,
            undefined,
            true
          )
        },
        get sum() {
          return new FieldNode(schema.restaurant_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(
            schema.restaurant_var_pop_fields,
            undefined,
            true
          )
        },
        get var_samp() {
          return new FieldNode(
            schema.restaurant_var_samp_fields,
            undefined,
            true
          )
        },
        get variance() {
          return new FieldNode(
            schema.restaurant_variance_fields,
            undefined,
            true
          )
        },
      },
      {
        name: 'restaurant_aggregate_fields',
        extension: ((extensions as any) || {}).restaurant_aggregate_fields,
      }
    )
  },
  get restaurant_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.restaurant_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.restaurant_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.restaurant_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.restaurant_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.restaurant_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(
            schema.restaurant_stddev_samp_order_by,
            true
          )
        },
        get sum() {
          return new InputNodeField(schema.restaurant_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.restaurant_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.restaurant_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.restaurant_variance_order_by, true)
        },
      },
      { name: 'restaurant_aggregate_order_by' }
    )
  },
  get restaurant_append_input() {
    return new InputNode(
      {
        get headlines() {
          return new InputNodeField(schema.jsonb, true)
        },
        get hours() {
          return new InputNodeField(schema.jsonb, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.jsonb, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
        get sources() {
          return new InputNodeField(schema.jsonb, true)
        },
        get tag_names() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'restaurant_append_input' }
    )
  },
  get restaurant_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.restaurant_on_conflict, true)
        },
      },
      { name: 'restaurant_arr_rel_insert_input' }
    )
  },
  get restaurant_avg_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_avg_fields',
        extension: ((extensions as any) || {}).restaurant_avg_fields,
      }
    )
  },
  get restaurant_avg_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_avg_order_by' }
    )
  },
  get restaurant_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_bool_exp, true),
            true
          )
        },
        get address() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get city() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get description() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get geocoder_id() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get headlines() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get hours() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get image() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get location() {
          return new InputNodeField(schema.geometry_comparison_exp, true)
        },
        get menu_items() {
          return new InputNodeField(schema.menu_item_bool_exp, true)
        },
        get name() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get price_range() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get reviews() {
          return new InputNodeField(schema.review_bool_exp, true)
        },
        get score() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get slug() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get sources() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get state() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get tag_names() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get tags() {
          return new InputNodeField(schema.restaurant_tag_bool_exp, true)
        },
        get telephone() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get website() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get zip() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
      },
      { name: 'restaurant_bool_exp' }
    )
  },
  get restaurant_constraint() {
    return new EnumNode({ name: 'restaurant_constraint' })
  },
  get restaurant_delete_at_path_input() {
    return new InputNode(
      {
        get headlines() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get hours() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get photos() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get rating_factors() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get score_breakdown() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get sources() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get tag_names() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
      },
      { name: 'restaurant_delete_at_path_input' }
    )
  },
  get restaurant_delete_elem_input() {
    return new InputNode(
      {
        get headlines() {
          return new InputNodeField(schema.Int, true)
        },
        get hours() {
          return new InputNodeField(schema.Int, true)
        },
        get photos() {
          return new InputNodeField(schema.Int, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.Int, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.Int, true)
        },
        get sources() {
          return new InputNodeField(schema.Int, true)
        },
        get tag_names() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'restaurant_delete_elem_input' }
    )
  },
  get restaurant_delete_key_input() {
    return new InputNode(
      {
        get headlines() {
          return new InputNodeField(schema.String, true)
        },
        get hours() {
          return new InputNodeField(schema.String, true)
        },
        get photos() {
          return new InputNodeField(schema.String, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.String, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.String, true)
        },
        get sources() {
          return new InputNodeField(schema.String, true)
        },
        get tag_names() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'restaurant_delete_key_input' }
    )
  },
  get restaurant_inc_input() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get score() {
          return new InputNodeField(schema.numeric, true)
        },
        get zip() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'restaurant_inc_input' }
    )
  },
  get restaurant_insert_input() {
    return new InputNode(
      {
        get address() {
          return new InputNodeField(schema.String, true)
        },
        get city() {
          return new InputNodeField(schema.String, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get description() {
          return new InputNodeField(schema.String, true)
        },
        get geocoder_id() {
          return new InputNodeField(schema.String, true)
        },
        get headlines() {
          return new InputNodeField(schema.jsonb, true)
        },
        get hours() {
          return new InputNodeField(schema.jsonb, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get image() {
          return new InputNodeField(schema.String, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get menu_items() {
          return new InputNodeField(schema.menu_item_arr_rel_insert_input, true)
        },
        get name() {
          return new InputNodeField(schema.String, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get price_range() {
          return new InputNodeField(schema.String, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.jsonb, true)
        },
        get reviews() {
          return new InputNodeField(schema.review_arr_rel_insert_input, true)
        },
        get score() {
          return new InputNodeField(schema.numeric, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
        get slug() {
          return new InputNodeField(schema.String, true)
        },
        get sources() {
          return new InputNodeField(schema.jsonb, true)
        },
        get state() {
          return new InputNodeField(schema.String, true)
        },
        get tag_names() {
          return new InputNodeField(schema.jsonb, true)
        },
        get tags() {
          return new InputNodeField(
            schema.restaurant_tag_arr_rel_insert_input,
            true
          )
        },
        get telephone() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get website() {
          return new InputNodeField(schema.String, true)
        },
        get zip() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'restaurant_insert_input' }
    )
  },
  get restaurant_max_fields() {
    return new ObjectNode(
      {
        get address() {
          return new FieldNode(schema.String, undefined, true)
        },
        get city() {
          return new FieldNode(schema.String, undefined, true)
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get geocoder_id() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get image() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get price_range() {
          return new FieldNode(schema.String, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get slug() {
          return new FieldNode(schema.String, undefined, true)
        },
        get state() {
          return new FieldNode(schema.String, undefined, true)
        },
        get telephone() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get website() {
          return new FieldNode(schema.String, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'restaurant_max_fields',
        extension: ((extensions as any) || {}).restaurant_max_fields,
      }
    )
  },
  get restaurant_max_order_by() {
    return new InputNode(
      {
        get address() {
          return new InputNodeField(schema.order_by, true)
        },
        get city() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get geocoder_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get image() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get price_range() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get slug() {
          return new InputNodeField(schema.order_by, true)
        },
        get state() {
          return new InputNodeField(schema.order_by, true)
        },
        get telephone() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get website() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_max_order_by' }
    )
  },
  get restaurant_min_fields() {
    return new ObjectNode(
      {
        get address() {
          return new FieldNode(schema.String, undefined, true)
        },
        get city() {
          return new FieldNode(schema.String, undefined, true)
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get geocoder_id() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get image() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get price_range() {
          return new FieldNode(schema.String, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get slug() {
          return new FieldNode(schema.String, undefined, true)
        },
        get state() {
          return new FieldNode(schema.String, undefined, true)
        },
        get telephone() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get website() {
          return new FieldNode(schema.String, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'restaurant_min_fields',
        extension: ((extensions as any) || {}).restaurant_min_fields,
      }
    )
  },
  get restaurant_min_order_by() {
    return new InputNode(
      {
        get address() {
          return new InputNodeField(schema.order_by, true)
        },
        get city() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get geocoder_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get image() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get price_range() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get slug() {
          return new InputNodeField(schema.order_by, true)
        },
        get state() {
          return new InputNodeField(schema.order_by, true)
        },
        get telephone() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get website() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_min_order_by' }
    )
  },
  get restaurant_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.restaurant, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'restaurant_mutation_response',
        extension: ((extensions as any) || {}).restaurant_mutation_response,
      }
    )
  },
  get restaurant_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.restaurant_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.restaurant_on_conflict, true)
        },
      },
      { name: 'restaurant_obj_rel_insert_input' }
    )
  },
  get restaurant_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.restaurant_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
      },
      { name: 'restaurant_on_conflict' }
    )
  },
  get restaurant_order_by() {
    return new InputNode(
      {
        get address() {
          return new InputNodeField(schema.order_by, true)
        },
        get city() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get geocoder_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get headlines() {
          return new InputNodeField(schema.order_by, true)
        },
        get hours() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get image() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get menu_items_aggregate() {
          return new InputNodeField(schema.menu_item_aggregate_order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get photos() {
          return new InputNodeField(schema.order_by, true)
        },
        get price_range() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.order_by, true)
        },
        get reviews_aggregate() {
          return new InputNodeField(schema.review_aggregate_order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.order_by, true)
        },
        get slug() {
          return new InputNodeField(schema.order_by, true)
        },
        get sources() {
          return new InputNodeField(schema.order_by, true)
        },
        get state() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_names() {
          return new InputNodeField(schema.order_by, true)
        },
        get tags_aggregate() {
          return new InputNodeField(
            schema.restaurant_tag_aggregate_order_by,
            true
          )
        },
        get telephone() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get website() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_order_by' }
    )
  },
  get restaurant_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'restaurant_pk_columns_input' }
    )
  },
  get restaurant_prepend_input() {
    return new InputNode(
      {
        get headlines() {
          return new InputNodeField(schema.jsonb, true)
        },
        get hours() {
          return new InputNodeField(schema.jsonb, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.jsonb, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
        get sources() {
          return new InputNodeField(schema.jsonb, true)
        },
        get tag_names() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'restaurant_prepend_input' }
    )
  },
  get restaurant_select_column() {
    return new EnumNode({ name: 'restaurant_select_column' })
  },
  get restaurant_set_input() {
    return new InputNode(
      {
        get address() {
          return new InputNodeField(schema.String, true)
        },
        get city() {
          return new InputNodeField(schema.String, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get description() {
          return new InputNodeField(schema.String, true)
        },
        get geocoder_id() {
          return new InputNodeField(schema.String, true)
        },
        get headlines() {
          return new InputNodeField(schema.jsonb, true)
        },
        get hours() {
          return new InputNodeField(schema.jsonb, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get image() {
          return new InputNodeField(schema.String, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get name() {
          return new InputNodeField(schema.String, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get price_range() {
          return new InputNodeField(schema.String, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get rating_factors() {
          return new InputNodeField(schema.jsonb, true)
        },
        get score() {
          return new InputNodeField(schema.numeric, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
        get slug() {
          return new InputNodeField(schema.String, true)
        },
        get sources() {
          return new InputNodeField(schema.jsonb, true)
        },
        get state() {
          return new InputNodeField(schema.String, true)
        },
        get tag_names() {
          return new InputNodeField(schema.jsonb, true)
        },
        get telephone() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get website() {
          return new InputNodeField(schema.String, true)
        },
        get zip() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'restaurant_set_input' }
    )
  },
  get restaurant_stddev_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_stddev_fields',
        extension: ((extensions as any) || {}).restaurant_stddev_fields,
      }
    )
  },
  get restaurant_stddev_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_stddev_order_by' }
    )
  },
  get restaurant_stddev_pop_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_stddev_pop_fields',
        extension: ((extensions as any) || {}).restaurant_stddev_pop_fields,
      }
    )
  },
  get restaurant_stddev_pop_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_stddev_pop_order_by' }
    )
  },
  get restaurant_stddev_samp_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_stddev_samp_fields',
        extension: ((extensions as any) || {}).restaurant_stddev_samp_fields,
      }
    )
  },
  get restaurant_stddev_samp_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_stddev_samp_order_by' }
    )
  },
  get restaurant_sum_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'restaurant_sum_fields',
        extension: ((extensions as any) || {}).restaurant_sum_fields,
      }
    )
  },
  get restaurant_sum_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_sum_order_by' }
    )
  },
  get restaurant_tag() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get photos() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get rank() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get review_mentions_count() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get reviews() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get reviews_aggregate() {
          return new FieldNode(
            schema.review_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score_breakdown() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get sentences() {
          return new FieldNode(
            new ArrayNode(schema.review_tag_sentence, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get sentences_aggregate() {
          return new FieldNode(
            schema.review_tag_sentence_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get tag() {
          return new FieldNode(schema.tag, undefined, false)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
      },
      {
        name: 'restaurant_tag',
        extension: ((extensions as any) || {}).restaurant_tag,
      }
    )
  },
  get restaurant_tag_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(
            schema.restaurant_tag_aggregate_fields,
            undefined,
            true
          )
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'restaurant_tag_aggregate',
        extension: ((extensions as any) || {}).restaurant_tag_aggregate,
      }
    )
  },
  get restaurant_tag_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(
            schema.restaurant_tag_avg_fields,
            undefined,
            true
          )
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(
            schema.restaurant_tag_max_fields,
            undefined,
            true
          )
        },
        get min() {
          return new FieldNode(
            schema.restaurant_tag_min_fields,
            undefined,
            true
          )
        },
        get stddev() {
          return new FieldNode(
            schema.restaurant_tag_stddev_fields,
            undefined,
            true
          )
        },
        get stddev_pop() {
          return new FieldNode(
            schema.restaurant_tag_stddev_pop_fields,
            undefined,
            true
          )
        },
        get stddev_samp() {
          return new FieldNode(
            schema.restaurant_tag_stddev_samp_fields,
            undefined,
            true
          )
        },
        get sum() {
          return new FieldNode(
            schema.restaurant_tag_sum_fields,
            undefined,
            true
          )
        },
        get var_pop() {
          return new FieldNode(
            schema.restaurant_tag_var_pop_fields,
            undefined,
            true
          )
        },
        get var_samp() {
          return new FieldNode(
            schema.restaurant_tag_var_samp_fields,
            undefined,
            true
          )
        },
        get variance() {
          return new FieldNode(
            schema.restaurant_tag_variance_fields,
            undefined,
            true
          )
        },
      },
      {
        name: 'restaurant_tag_aggregate_fields',
        extension: ((extensions as any) || {}).restaurant_tag_aggregate_fields,
      }
    )
  },
  get restaurant_tag_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.restaurant_tag_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.restaurant_tag_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.restaurant_tag_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.restaurant_tag_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(
            schema.restaurant_tag_stddev_pop_order_by,
            true
          )
        },
        get stddev_samp() {
          return new InputNodeField(
            schema.restaurant_tag_stddev_samp_order_by,
            true
          )
        },
        get sum() {
          return new InputNodeField(schema.restaurant_tag_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(
            schema.restaurant_tag_var_pop_order_by,
            true
          )
        },
        get var_samp() {
          return new InputNodeField(
            schema.restaurant_tag_var_samp_order_by,
            true
          )
        },
        get variance() {
          return new InputNodeField(
            schema.restaurant_tag_variance_order_by,
            true
          )
        },
      },
      { name: 'restaurant_tag_aggregate_order_by' }
    )
  },
  get restaurant_tag_append_input() {
    return new InputNode(
      {
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'restaurant_tag_append_input' }
    )
  },
  get restaurant_tag_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_tag_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.restaurant_tag_on_conflict, true)
        },
      },
      { name: 'restaurant_tag_arr_rel_insert_input' }
    )
  },
  get restaurant_tag_avg_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_avg_fields',
        extension: ((extensions as any) || {}).restaurant_tag_avg_fields,
      }
    )
  },
  get restaurant_tag_avg_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_avg_order_by' }
    )
  },
  get restaurant_tag_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_tag_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.restaurant_tag_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_tag_bool_exp, true),
            true
          )
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get rank() {
          return new InputNodeField(schema.Int_comparison_exp, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get reviews() {
          return new InputNodeField(schema.review_bool_exp, true)
        },
        get score() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get sentences() {
          return new InputNodeField(schema.review_tag_sentence_bool_exp, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
      },
      { name: 'restaurant_tag_bool_exp' }
    )
  },
  get restaurant_tag_constraint() {
    return new EnumNode({ name: 'restaurant_tag_constraint' })
  },
  get restaurant_tag_delete_at_path_input() {
    return new InputNode(
      {
        get photos() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get score_breakdown() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
      },
      { name: 'restaurant_tag_delete_at_path_input' }
    )
  },
  get restaurant_tag_delete_elem_input() {
    return new InputNode(
      {
        get photos() {
          return new InputNodeField(schema.Int, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'restaurant_tag_delete_elem_input' }
    )
  },
  get restaurant_tag_delete_key_input() {
    return new InputNode(
      {
        get photos() {
          return new InputNodeField(schema.String, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'restaurant_tag_delete_key_input' }
    )
  },
  get restaurant_tag_inc_input() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.Int, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.numeric, true)
        },
        get score() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'restaurant_tag_inc_input' }
    )
  },
  get restaurant_tag_insert_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rank() {
          return new InputNodeField(schema.Int, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant() {
          return new InputNodeField(
            schema.restaurant_obj_rel_insert_input,
            true
          )
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.numeric, true)
        },
        get reviews() {
          return new InputNodeField(schema.review_arr_rel_insert_input, true)
        },
        get score() {
          return new InputNodeField(schema.numeric, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
        get sentences() {
          return new InputNodeField(
            schema.review_tag_sentence_arr_rel_insert_input,
            true
          )
        },
        get tag() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'restaurant_tag_insert_input' }
    )
  },
  get restaurant_tag_max_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get rank() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_max_fields',
        extension: ((extensions as any) || {}).restaurant_tag_max_fields,
      }
    )
  },
  get restaurant_tag_max_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_max_order_by' }
    )
  },
  get restaurant_tag_min_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get rank() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_min_fields',
        extension: ((extensions as any) || {}).restaurant_tag_min_fields,
      }
    )
  },
  get restaurant_tag_min_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_min_order_by' }
    )
  },
  get restaurant_tag_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'restaurant_tag_mutation_response',
        extension: ((extensions as any) || {}).restaurant_tag_mutation_response,
      }
    )
  },
  get restaurant_tag_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.restaurant_tag_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.restaurant_tag_on_conflict, true)
        },
      },
      { name: 'restaurant_tag_obj_rel_insert_input' }
    )
  },
  get restaurant_tag_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.restaurant_tag_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_tag_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.restaurant_tag_bool_exp, true)
        },
      },
      { name: 'restaurant_tag_on_conflict' }
    )
  },
  get restaurant_tag_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get photos() {
          return new InputNodeField(schema.order_by, true)
        },
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get reviews_aggregate() {
          return new InputNodeField(schema.review_aggregate_order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.order_by, true)
        },
        get sentences_aggregate() {
          return new InputNodeField(
            schema.review_tag_sentence_aggregate_order_by,
            true
          )
        },
        get tag() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_order_by' }
    )
  },
  get restaurant_tag_pk_columns_input() {
    return new InputNode(
      {
        get restaurant_id() {
          return new InputNodeField(schema.uuid, false)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'restaurant_tag_pk_columns_input' }
    )
  },
  get restaurant_tag_prepend_input() {
    return new InputNode(
      {
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'restaurant_tag_prepend_input' }
    )
  },
  get restaurant_tag_select_column() {
    return new EnumNode({ name: 'restaurant_tag_select_column' })
  },
  get restaurant_tag_set_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rank() {
          return new InputNodeField(schema.Int, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.numeric, true)
        },
        get score() {
          return new InputNodeField(schema.numeric, true)
        },
        get score_breakdown() {
          return new InputNodeField(schema.jsonb, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'restaurant_tag_set_input' }
    )
  },
  get restaurant_tag_stddev_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_stddev_fields',
        extension: ((extensions as any) || {}).restaurant_tag_stddev_fields,
      }
    )
  },
  get restaurant_tag_stddev_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_stddev_order_by' }
    )
  },
  get restaurant_tag_stddev_pop_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_stddev_pop_fields',
        extension: ((extensions as any) || {}).restaurant_tag_stddev_pop_fields,
      }
    )
  },
  get restaurant_tag_stddev_pop_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_stddev_pop_order_by' }
    )
  },
  get restaurant_tag_stddev_samp_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_stddev_samp_fields',
        extension: ((extensions as any) || {})
          .restaurant_tag_stddev_samp_fields,
      }
    )
  },
  get restaurant_tag_stddev_samp_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_stddev_samp_order_by' }
    )
  },
  get restaurant_tag_sum_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get score() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_sum_fields',
        extension: ((extensions as any) || {}).restaurant_tag_sum_fields,
      }
    )
  },
  get restaurant_tag_sum_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_sum_order_by' }
    )
  },
  get restaurant_tag_update_column() {
    return new EnumNode({ name: 'restaurant_tag_update_column' })
  },
  get restaurant_tag_var_pop_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_var_pop_fields',
        extension: ((extensions as any) || {}).restaurant_tag_var_pop_fields,
      }
    )
  },
  get restaurant_tag_var_pop_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_var_pop_order_by' }
    )
  },
  get restaurant_tag_var_samp_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_var_samp_fields',
        extension: ((extensions as any) || {}).restaurant_tag_var_samp_fields,
      }
    )
  },
  get restaurant_tag_var_samp_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_var_samp_order_by' }
    )
  },
  get restaurant_tag_variance_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get review_mentions_count() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_tag_variance_fields',
        extension: ((extensions as any) || {}).restaurant_tag_variance_fields,
      }
    )
  },
  get restaurant_tag_variance_order_by() {
    return new InputNode(
      {
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_mentions_count() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_variance_order_by' }
    )
  },
  get restaurant_top_tags_args() {
    return new InputNode(
      {
        get tag_names() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'restaurant_top_tags_args' }
    )
  },
  get restaurant_update_column() {
    return new EnumNode({ name: 'restaurant_update_column' })
  },
  get restaurant_var_pop_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_var_pop_fields',
        extension: ((extensions as any) || {}).restaurant_var_pop_fields,
      }
    )
  },
  get restaurant_var_pop_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_var_pop_order_by' }
    )
  },
  get restaurant_var_samp_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_var_samp_fields',
        extension: ((extensions as any) || {}).restaurant_var_samp_fields,
      }
    )
  },
  get restaurant_var_samp_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_var_samp_order_by' }
    )
  },
  get restaurant_variance_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get score() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get zip() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'restaurant_variance_fields',
        extension: ((extensions as any) || {}).restaurant_variance_fields,
      }
    )
  },
  get restaurant_variance_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get score() {
          return new InputNodeField(schema.order_by, true)
        },
        get zip() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_variance_order_by' }
    )
  },
  get review() {
    return new ObjectNode(
      {
        get authored_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get categories() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get favorited() {
          return new FieldNode(schema.Boolean, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get location() {
          return new FieldNode(schema.geometry, undefined, true)
        },
        get native_data_unique_key() {
          return new FieldNode(schema.String, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get sentiments() {
          return new FieldNode(
            new ArrayNode(schema.review_tag_sentence, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get sentiments_aggregate() {
          return new FieldNode(
            schema.review_tag_sentence_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get source() {
          return new FieldNode(schema.String, undefined, false)
        },
        get tag() {
          return new FieldNode(schema.tag, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get text() {
          return new FieldNode(schema.String, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get user() {
          return new FieldNode(schema.user, undefined, false)
        },
        get user_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get username() {
          return new FieldNode(schema.String, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      { name: 'review', extension: ((extensions as any) || {}).review }
    )
  },
  get review_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.review_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'review_aggregate',
        extension: ((extensions as any) || {}).review_aggregate,
      }
    )
  },
  get review_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.review_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.review_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.review_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.review_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(schema.review_stddev_pop_fields, undefined, true)
        },
        get stddev_samp() {
          return new FieldNode(
            schema.review_stddev_samp_fields,
            undefined,
            true
          )
        },
        get sum() {
          return new FieldNode(schema.review_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(schema.review_var_pop_fields, undefined, true)
        },
        get var_samp() {
          return new FieldNode(schema.review_var_samp_fields, undefined, true)
        },
        get variance() {
          return new FieldNode(schema.review_variance_fields, undefined, true)
        },
      },
      {
        name: 'review_aggregate_fields',
        extension: ((extensions as any) || {}).review_aggregate_fields,
      }
    )
  },
  get review_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.review_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.review_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.review_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.review_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.review_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(schema.review_stddev_samp_order_by, true)
        },
        get sum() {
          return new InputNodeField(schema.review_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.review_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.review_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.review_variance_order_by, true)
        },
      },
      { name: 'review_aggregate_order_by' }
    )
  },
  get review_append_input() {
    return new InputNode(
      {
        get categories() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'review_append_input' }
    )
  },
  get review_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.review_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.review_on_conflict, true)
        },
      },
      { name: 'review_arr_rel_insert_input' }
    )
  },
  get review_avg_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_avg_fields',
        extension: ((extensions as any) || {}).review_avg_fields,
      }
    )
  },
  get review_avg_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_avg_order_by' }
    )
  },
  get review_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.review_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.review_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.review_bool_exp, true),
            true
          )
        },
        get authored_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get categories() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get favorited() {
          return new InputNodeField(schema.Boolean_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get location() {
          return new InputNodeField(schema.geometry_comparison_exp, true)
        },
        get native_data_unique_key() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get sentiments() {
          return new InputNodeField(schema.review_tag_sentence_bool_exp, true)
        },
        get source() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get text() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get type() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get user() {
          return new InputNodeField(schema.user_bool_exp, true)
        },
        get user_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get username() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get vote() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
      },
      { name: 'review_bool_exp' }
    )
  },
  get review_constraint() {
    return new EnumNode({ name: 'review_constraint' })
  },
  get review_delete_at_path_input() {
    return new InputNode(
      {
        get categories() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
      },
      { name: 'review_delete_at_path_input' }
    )
  },
  get review_delete_elem_input() {
    return new InputNode(
      {
        get categories() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'review_delete_elem_input' }
    )
  },
  get review_delete_key_input() {
    return new InputNode(
      {
        get categories() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'review_delete_key_input' }
    )
  },
  get review_inc_input() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get vote() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'review_inc_input' }
    )
  },
  get review_insert_input() {
    return new InputNode(
      {
        get authored_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get categories() {
          return new InputNodeField(schema.jsonb, true)
        },
        get favorited() {
          return new InputNodeField(schema.Boolean, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get native_data_unique_key() {
          return new InputNodeField(schema.String, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant() {
          return new InputNodeField(
            schema.restaurant_obj_rel_insert_input,
            true
          )
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get sentiments() {
          return new InputNodeField(
            schema.review_tag_sentence_arr_rel_insert_input,
            true
          )
        },
        get source() {
          return new InputNodeField(schema.String, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get text() {
          return new InputNodeField(schema.String, true)
        },
        get type() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get user() {
          return new InputNodeField(schema.user_obj_rel_insert_input, true)
        },
        get user_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get username() {
          return new InputNodeField(schema.String, true)
        },
        get vote() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'review_insert_input' }
    )
  },
  get review_max_fields() {
    return new ObjectNode(
      {
        get authored_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get native_data_unique_key() {
          return new FieldNode(schema.String, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get source() {
          return new FieldNode(schema.String, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get text() {
          return new FieldNode(schema.String, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get user_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get username() {
          return new FieldNode(schema.String, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'review_max_fields',
        extension: ((extensions as any) || {}).review_max_fields,
      }
    )
  },
  get review_max_order_by() {
    return new InputNode(
      {
        get authored_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get native_data_unique_key() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get source() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get text() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get user_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get username() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_max_order_by' }
    )
  },
  get review_min_fields() {
    return new ObjectNode(
      {
        get authored_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get native_data_unique_key() {
          return new FieldNode(schema.String, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get source() {
          return new FieldNode(schema.String, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get text() {
          return new FieldNode(schema.String, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get user_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get username() {
          return new FieldNode(schema.String, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'review_min_fields',
        extension: ((extensions as any) || {}).review_min_fields,
      }
    )
  },
  get review_min_order_by() {
    return new InputNode(
      {
        get authored_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get native_data_unique_key() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get source() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get text() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get user_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get username() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_min_order_by' }
    )
  },
  get review_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'review_mutation_response',
        extension: ((extensions as any) || {}).review_mutation_response,
      }
    )
  },
  get review_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.review_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.review_on_conflict, true)
        },
      },
      { name: 'review_obj_rel_insert_input' }
    )
  },
  get review_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.review_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.review_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.review_bool_exp, true)
        },
      },
      { name: 'review_on_conflict' }
    )
  },
  get review_order_by() {
    return new InputNode(
      {
        get authored_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get categories() {
          return new InputNodeField(schema.order_by, true)
        },
        get favorited() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get native_data_unique_key() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get sentiments_aggregate() {
          return new InputNodeField(
            schema.review_tag_sentence_aggregate_order_by,
            true
          )
        },
        get source() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get text() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get user() {
          return new InputNodeField(schema.user_order_by, true)
        },
        get user_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get username() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_order_by' }
    )
  },
  get review_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'review_pk_columns_input' }
    )
  },
  get review_prepend_input() {
    return new InputNode(
      {
        get categories() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'review_prepend_input' }
    )
  },
  get review_select_column() {
    return new EnumNode({ name: 'review_select_column' })
  },
  get review_set_input() {
    return new InputNode(
      {
        get authored_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get categories() {
          return new InputNodeField(schema.jsonb, true)
        },
        get favorited() {
          return new InputNodeField(schema.Boolean, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get native_data_unique_key() {
          return new InputNodeField(schema.String, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get source() {
          return new InputNodeField(schema.String, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get text() {
          return new InputNodeField(schema.String, true)
        },
        get type() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get user_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get username() {
          return new InputNodeField(schema.String, true)
        },
        get vote() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'review_set_input' }
    )
  },
  get review_stddev_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_stddev_fields',
        extension: ((extensions as any) || {}).review_stddev_fields,
      }
    )
  },
  get review_stddev_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_stddev_order_by' }
    )
  },
  get review_stddev_pop_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_stddev_pop_fields',
        extension: ((extensions as any) || {}).review_stddev_pop_fields,
      }
    )
  },
  get review_stddev_pop_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_stddev_pop_order_by' }
    )
  },
  get review_stddev_samp_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_stddev_samp_fields',
        extension: ((extensions as any) || {}).review_stddev_samp_fields,
      }
    )
  },
  get review_stddev_samp_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_stddev_samp_order_by' }
    )
  },
  get review_sum_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'review_sum_fields',
        extension: ((extensions as any) || {}).review_sum_fields,
      }
    )
  },
  get review_sum_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_sum_order_by' }
    )
  },
  get review_tag_sentence() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get ml_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.numeric, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get review() {
          return new FieldNode(schema.review, undefined, false)
        },
        get review_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get sentence() {
          return new FieldNode(schema.String, undefined, false)
        },
        get tag() {
          return new FieldNode(schema.tag, undefined, false)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
      },
      {
        name: 'review_tag_sentence',
        extension: ((extensions as any) || {}).review_tag_sentence,
      }
    )
  },
  get review_tag_sentence_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(
            schema.review_tag_sentence_aggregate_fields,
            undefined,
            true
          )
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.review_tag_sentence, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'review_tag_sentence_aggregate',
        extension: ((extensions as any) || {}).review_tag_sentence_aggregate,
      }
    )
  },
  get review_tag_sentence_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(
            schema.review_tag_sentence_avg_fields,
            undefined,
            true
          )
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(
            schema.review_tag_sentence_max_fields,
            undefined,
            true
          )
        },
        get min() {
          return new FieldNode(
            schema.review_tag_sentence_min_fields,
            undefined,
            true
          )
        },
        get stddev() {
          return new FieldNode(
            schema.review_tag_sentence_stddev_fields,
            undefined,
            true
          )
        },
        get stddev_pop() {
          return new FieldNode(
            schema.review_tag_sentence_stddev_pop_fields,
            undefined,
            true
          )
        },
        get stddev_samp() {
          return new FieldNode(
            schema.review_tag_sentence_stddev_samp_fields,
            undefined,
            true
          )
        },
        get sum() {
          return new FieldNode(
            schema.review_tag_sentence_sum_fields,
            undefined,
            true
          )
        },
        get var_pop() {
          return new FieldNode(
            schema.review_tag_sentence_var_pop_fields,
            undefined,
            true
          )
        },
        get var_samp() {
          return new FieldNode(
            schema.review_tag_sentence_var_samp_fields,
            undefined,
            true
          )
        },
        get variance() {
          return new FieldNode(
            schema.review_tag_sentence_variance_fields,
            undefined,
            true
          )
        },
      },
      {
        name: 'review_tag_sentence_aggregate_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_aggregate_fields,
      }
    )
  },
  get review_tag_sentence_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(
            schema.review_tag_sentence_avg_order_by,
            true
          )
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(
            schema.review_tag_sentence_max_order_by,
            true
          )
        },
        get min() {
          return new InputNodeField(
            schema.review_tag_sentence_min_order_by,
            true
          )
        },
        get stddev() {
          return new InputNodeField(
            schema.review_tag_sentence_stddev_order_by,
            true
          )
        },
        get stddev_pop() {
          return new InputNodeField(
            schema.review_tag_sentence_stddev_pop_order_by,
            true
          )
        },
        get stddev_samp() {
          return new InputNodeField(
            schema.review_tag_sentence_stddev_samp_order_by,
            true
          )
        },
        get sum() {
          return new InputNodeField(
            schema.review_tag_sentence_sum_order_by,
            true
          )
        },
        get var_pop() {
          return new InputNodeField(
            schema.review_tag_sentence_var_pop_order_by,
            true
          )
        },
        get var_samp() {
          return new InputNodeField(
            schema.review_tag_sentence_var_samp_order_by,
            true
          )
        },
        get variance() {
          return new InputNodeField(
            schema.review_tag_sentence_variance_order_by,
            true
          )
        },
      },
      { name: 'review_tag_sentence_aggregate_order_by' }
    )
  },
  get review_tag_sentence_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.review_tag_sentence_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(
            schema.review_tag_sentence_on_conflict,
            true
          )
        },
      },
      { name: 'review_tag_sentence_arr_rel_insert_input' }
    )
  },
  get review_tag_sentence_avg_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_avg_fields',
        extension: ((extensions as any) || {}).review_tag_sentence_avg_fields,
      }
    )
  },
  get review_tag_sentence_avg_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_avg_order_by' }
    )
  },
  get review_tag_sentence_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.review_tag_sentence_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.review_tag_sentence_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.review_tag_sentence_bool_exp, true),
            true
          )
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get ml_sentiment() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.numeric_comparison_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get review() {
          return new InputNodeField(schema.review_bool_exp, true)
        },
        get review_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get sentence() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
      },
      { name: 'review_tag_sentence_bool_exp' }
    )
  },
  get review_tag_sentence_constraint() {
    return new EnumNode({ name: 'review_tag_sentence_constraint' })
  },
  get review_tag_sentence_inc_input() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.numeric, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'review_tag_sentence_inc_input' }
    )
  },
  get review_tag_sentence_insert_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get ml_sentiment() {
          return new InputNodeField(schema.numeric, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get review() {
          return new InputNodeField(schema.review_obj_rel_insert_input, true)
        },
        get review_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get sentence() {
          return new InputNodeField(schema.String, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'review_tag_sentence_insert_input' }
    )
  },
  get review_tag_sentence_max_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get ml_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get review_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get sentence() {
          return new FieldNode(schema.String, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_max_fields',
        extension: ((extensions as any) || {}).review_tag_sentence_max_fields,
      }
    )
  },
  get review_tag_sentence_max_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get sentence() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_max_order_by' }
    )
  },
  get review_tag_sentence_min_fields() {
    return new ObjectNode(
      {
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get ml_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get review_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get sentence() {
          return new FieldNode(schema.String, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_min_fields',
        extension: ((extensions as any) || {}).review_tag_sentence_min_fields,
      }
    )
  },
  get review_tag_sentence_min_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get review_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get sentence() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_min_order_by' }
    )
  },
  get review_tag_sentence_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.review_tag_sentence, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'review_tag_sentence_mutation_response',
        extension: ((extensions as any) || {})
          .review_tag_sentence_mutation_response,
      }
    )
  },
  get review_tag_sentence_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            schema.review_tag_sentence_insert_input,
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(
            schema.review_tag_sentence_on_conflict,
            true
          )
        },
      },
      { name: 'review_tag_sentence_obj_rel_insert_input' }
    )
  },
  get review_tag_sentence_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(
            schema.review_tag_sentence_constraint,
            false
          )
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.review_tag_sentence_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.review_tag_sentence_bool_exp, true)
        },
      },
      { name: 'review_tag_sentence_on_conflict' }
    )
  },
  get review_tag_sentence_order_by() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get review() {
          return new InputNodeField(schema.review_order_by, true)
        },
        get review_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get sentence() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_order_by' }
    )
  },
  get review_tag_sentence_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'review_tag_sentence_pk_columns_input' }
    )
  },
  get review_tag_sentence_select_column() {
    return new EnumNode({ name: 'review_tag_sentence_select_column' })
  },
  get review_tag_sentence_set_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get ml_sentiment() {
          return new InputNodeField(schema.numeric, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get review_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get sentence() {
          return new InputNodeField(schema.String, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'review_tag_sentence_set_input' }
    )
  },
  get review_tag_sentence_stddev_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_stddev_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_stddev_fields,
      }
    )
  },
  get review_tag_sentence_stddev_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_stddev_order_by' }
    )
  },
  get review_tag_sentence_stddev_pop_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_stddev_pop_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_stddev_pop_fields,
      }
    )
  },
  get review_tag_sentence_stddev_pop_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_stddev_pop_order_by' }
    )
  },
  get review_tag_sentence_stddev_samp_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_stddev_samp_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_stddev_samp_fields,
      }
    )
  },
  get review_tag_sentence_stddev_samp_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_stddev_samp_order_by' }
    )
  },
  get review_tag_sentence_sum_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.numeric, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_sum_fields',
        extension: ((extensions as any) || {}).review_tag_sentence_sum_fields,
      }
    )
  },
  get review_tag_sentence_sum_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_sum_order_by' }
    )
  },
  get review_tag_sentence_update_column() {
    return new EnumNode({ name: 'review_tag_sentence_update_column' })
  },
  get review_tag_sentence_var_pop_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_var_pop_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_var_pop_fields,
      }
    )
  },
  get review_tag_sentence_var_pop_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_var_pop_order_by' }
    )
  },
  get review_tag_sentence_var_samp_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_var_samp_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_var_samp_fields,
      }
    )
  },
  get review_tag_sentence_var_samp_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_var_samp_order_by' }
    )
  },
  get review_tag_sentence_variance_fields() {
    return new ObjectNode(
      {
        get ml_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get naive_sentiment() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_tag_sentence_variance_fields',
        extension: ((extensions as any) || {})
          .review_tag_sentence_variance_fields,
      }
    )
  },
  get review_tag_sentence_variance_order_by() {
    return new InputNode(
      {
        get ml_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
        get naive_sentiment() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_tag_sentence_variance_order_by' }
    )
  },
  get review_update_column() {
    return new EnumNode({ name: 'review_update_column' })
  },
  get review_var_pop_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_var_pop_fields',
        extension: ((extensions as any) || {}).review_var_pop_fields,
      }
    )
  },
  get review_var_pop_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_var_pop_order_by' }
    )
  },
  get review_var_samp_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_var_samp_fields',
        extension: ((extensions as any) || {}).review_var_samp_fields,
      }
    )
  },
  get review_var_samp_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_var_samp_order_by' }
    )
  },
  get review_variance_fields() {
    return new ObjectNode(
      {
        get rating() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get vote() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'review_variance_fields',
        extension: ((extensions as any) || {}).review_variance_fields,
      }
    )
  },
  get review_variance_order_by() {
    return new InputNode(
      {
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get vote() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_variance_order_by' }
    )
  },
  get setting() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get key() {
          return new FieldNode(schema.String, undefined, false)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get value() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            false
          )
        },
      },
      { name: 'setting', extension: ((extensions as any) || {}).setting }
    )
  },
  get setting_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.setting_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.setting, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'setting_aggregate',
        extension: ((extensions as any) || {}).setting_aggregate,
      }
    )
  },
  get setting_aggregate_fields() {
    return new ObjectNode(
      {
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.setting_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.setting_min_fields, undefined, true)
        },
      },
      {
        name: 'setting_aggregate_fields',
        extension: ((extensions as any) || {}).setting_aggregate_fields,
      }
    )
  },
  get setting_aggregate_order_by() {
    return new InputNode(
      {
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.setting_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.setting_min_order_by, true)
        },
      },
      { name: 'setting_aggregate_order_by' }
    )
  },
  get setting_append_input() {
    return new InputNode(
      {
        get value() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'setting_append_input' }
    )
  },
  get setting_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.setting_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.setting_on_conflict, true)
        },
      },
      { name: 'setting_arr_rel_insert_input' }
    )
  },
  get setting_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.setting_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.setting_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.setting_bool_exp, true),
            true
          )
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get key() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get value() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
      },
      { name: 'setting_bool_exp' }
    )
  },
  get setting_constraint() {
    return new EnumNode({ name: 'setting_constraint' })
  },
  get setting_delete_at_path_input() {
    return new InputNode(
      {
        get value() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
      },
      { name: 'setting_delete_at_path_input' }
    )
  },
  get setting_delete_elem_input() {
    return new InputNode(
      {
        get value() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'setting_delete_elem_input' }
    )
  },
  get setting_delete_key_input() {
    return new InputNode(
      {
        get value() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'setting_delete_key_input' }
    )
  },
  get setting_insert_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get key() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get value() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'setting_insert_input' }
    )
  },
  get setting_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get key() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'setting_max_fields',
        extension: ((extensions as any) || {}).setting_max_fields,
      }
    )
  },
  get setting_max_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get key() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'setting_max_order_by' }
    )
  },
  get setting_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get key() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'setting_min_fields',
        extension: ((extensions as any) || {}).setting_min_fields,
      }
    )
  },
  get setting_min_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get key() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'setting_min_order_by' }
    )
  },
  get setting_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.setting, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'setting_mutation_response',
        extension: ((extensions as any) || {}).setting_mutation_response,
      }
    )
  },
  get setting_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.setting_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.setting_on_conflict, true)
        },
      },
      { name: 'setting_obj_rel_insert_input' }
    )
  },
  get setting_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.setting_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.setting_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.setting_bool_exp, true)
        },
      },
      { name: 'setting_on_conflict' }
    )
  },
  get setting_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get key() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get value() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'setting_order_by' }
    )
  },
  get setting_pk_columns_input() {
    return new InputNode(
      {
        get key() {
          return new InputNodeField(schema.String, false)
        },
      },
      { name: 'setting_pk_columns_input' }
    )
  },
  get setting_prepend_input() {
    return new InputNode(
      {
        get value() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'setting_prepend_input' }
    )
  },
  get setting_select_column() {
    return new EnumNode({ name: 'setting_select_column' })
  },
  get setting_set_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get key() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get value() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'setting_set_input' }
    )
  },
  get setting_update_column() {
    return new EnumNode({ name: 'setting_update_column' })
  },
  get st_d_within_geography_input() {
    return new InputNode(
      {
        get distance() {
          return new InputNodeField(schema.Float, false)
        },
        get from() {
          return new InputNodeField(schema.geography, false)
        },
        get use_spheroid() {
          return new InputNodeField(schema.Boolean, true)
        },
      },
      { name: 'st_d_within_geography_input' }
    )
  },
  get st_d_within_input() {
    return new InputNode(
      {
        get distance() {
          return new InputNodeField(schema.Float, false)
        },
        get from() {
          return new InputNodeField(schema.geometry, false)
        },
      },
      { name: 'st_d_within_input' }
    )
  },
  get subscription_root() {
    return new ObjectNode(
      {
        get menu_item() {
          return new FieldNode(
            new ArrayNode(schema.menu_item, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, true)
              },
            }),
            false
          )
        },
        get menu_item_aggregate() {
          return new FieldNode(
            schema.menu_item_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.menu_item_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.menu_item_bool_exp, true)
              },
            }),
            false
          )
        },
        get menu_item_by_pk() {
          return new FieldNode(
            schema.menu_item,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get opening_hours() {
          return new FieldNode(
            new ArrayNode(schema.opening_hours, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.opening_hours_bool_exp, true)
              },
            }),
            false
          )
        },
        get opening_hours_aggregate() {
          return new FieldNode(
            schema.opening_hours_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.opening_hours_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.opening_hours_bool_exp, true)
              },
            }),
            false
          )
        },
        get opening_hours_by_pk() {
          return new FieldNode(
            schema.opening_hours,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get photo() {
          return new FieldNode(
            new ArrayNode(schema.photo, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_aggregate() {
          return new FieldNode(
            schema.photo_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_by_pk() {
          return new FieldNode(
            schema.photo,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get photo_xref() {
          return new FieldNode(
            new ArrayNode(schema.photo_xref, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_xref_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_xref_aggregate() {
          return new FieldNode(
            schema.photo_xref_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.photo_xref_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.photo_xref_bool_exp, true)
              },
            }),
            false
          )
        },
        get photo_xref_by_pk() {
          return new FieldNode(
            schema.photo_xref,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get restaurant() {
          return new FieldNode(
            new ArrayNode(schema.restaurant, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_aggregate() {
          return new FieldNode(
            schema.restaurant_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_by_pk() {
          return new FieldNode(
            schema.restaurant,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get restaurant_tag() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_tag_aggregate() {
          return new FieldNode(
            schema.restaurant_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_tag_by_pk() {
          return new FieldNode(
            schema.restaurant_tag,
            new Arguments(
              {
                get restaurant_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get review() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get review_aggregate() {
          return new FieldNode(
            schema.review_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get review_by_pk() {
          return new FieldNode(
            schema.review,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get review_tag_sentence() {
          return new FieldNode(
            new ArrayNode(schema.review_tag_sentence, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get review_tag_sentence_aggregate() {
          return new FieldNode(
            schema.review_tag_sentence_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_tag_sentence_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.review_tag_sentence_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get review_tag_sentence_by_pk() {
          return new FieldNode(
            schema.review_tag_sentence,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get setting() {
          return new FieldNode(
            new ArrayNode(schema.setting, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.setting_bool_exp, true)
              },
            }),
            false
          )
        },
        get setting_aggregate() {
          return new FieldNode(
            schema.setting_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.setting_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.setting_bool_exp, true)
              },
            }),
            false
          )
        },
        get setting_by_pk() {
          return new FieldNode(
            schema.setting,
            new Arguments(
              {
                get key() {
                  return new ArgumentsField(schema.String, false)
                },
              },
              true
            ),
            true
          )
        },
        get tag() {
          return new FieldNode(
            new ArrayNode(schema.tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_aggregate() {
          return new FieldNode(
            schema.tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_by_pk() {
          return new FieldNode(
            schema.tag,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get tag_tag() {
          return new FieldNode(
            new ArrayNode(schema.tag_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_tag_aggregate() {
          return new FieldNode(
            schema.tag_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get tag_tag_by_pk() {
          return new FieldNode(
            schema.tag_tag,
            new Arguments(
              {
                get category_tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get tag_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
        get user() {
          return new FieldNode(
            new ArrayNode(schema.user, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.user_bool_exp, true)
              },
            }),
            false
          )
        },
        get user_aggregate() {
          return new FieldNode(
            schema.user_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.user_bool_exp, true)
              },
            }),
            false
          )
        },
        get user_by_pk() {
          return new FieldNode(
            schema.user,
            new Arguments(
              {
                get id() {
                  return new ArgumentsField(schema.uuid, false)
                },
              },
              true
            ),
            true
          )
        },
      },
      {
        name: 'subscription_root',
        extension: ((extensions as any) || {}).subscription_root,
      }
    )
  },
  get tag() {
    return new ObjectNode(
      {
        get alternates() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get categories() {
          return new FieldNode(
            new ArrayNode(schema.tag_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get categories_aggregate() {
          return new FieldNode(
            schema.tag_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.tag_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get default_images() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get displayName() {
          return new FieldNode(schema.String, undefined, true)
        },
        get frequency() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get icon() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get is_ambiguous() {
          return new FieldNode(schema.Boolean, undefined, false)
        },
        get misc() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get parent() {
          return new FieldNode(schema.tag, undefined, true)
        },
        get parentId() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get restaurant_taxonomies() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_tag, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get restaurant_taxonomies_aggregate() {
          return new FieldNode(
            schema.restaurant_tag_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_tag_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.restaurant_tag_bool_exp, true)
              },
            }),
            false
          )
        },
        get rgb() {
          return new FieldNode(
            schema.jsonb,
            new Arguments({
              get path() {
                return new ArgumentsField(schema.String, true)
              },
            }),
            true
          )
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
      },
      { name: 'tag', extension: ((extensions as any) || {}).tag }
    )
  },
  get tag_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.tag_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.tag, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'tag_aggregate',
        extension: ((extensions as any) || {}).tag_aggregate,
      }
    )
  },
  get tag_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.tag_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.tag_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.tag_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.tag_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(schema.tag_stddev_pop_fields, undefined, true)
        },
        get stddev_samp() {
          return new FieldNode(schema.tag_stddev_samp_fields, undefined, true)
        },
        get sum() {
          return new FieldNode(schema.tag_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(schema.tag_var_pop_fields, undefined, true)
        },
        get var_samp() {
          return new FieldNode(schema.tag_var_samp_fields, undefined, true)
        },
        get variance() {
          return new FieldNode(schema.tag_variance_fields, undefined, true)
        },
      },
      {
        name: 'tag_aggregate_fields',
        extension: ((extensions as any) || {}).tag_aggregate_fields,
      }
    )
  },
  get tag_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.tag_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.tag_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.tag_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.tag_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.tag_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(schema.tag_stddev_samp_order_by, true)
        },
        get sum() {
          return new InputNodeField(schema.tag_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.tag_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.tag_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.tag_variance_order_by, true)
        },
      },
      { name: 'tag_aggregate_order_by' }
    )
  },
  get tag_append_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.jsonb, true)
        },
        get default_images() {
          return new InputNodeField(schema.jsonb, true)
        },
        get misc() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rgb() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'tag_append_input' }
    )
  },
  get tag_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.tag_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.tag_on_conflict, true)
        },
      },
      { name: 'tag_arr_rel_insert_input' }
    )
  },
  get tag_avg_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_avg_fields',
        extension: ((extensions as any) || {}).tag_avg_fields,
      }
    )
  },
  get tag_avg_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_avg_order_by' }
    )
  },
  get tag_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.tag_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.tag_bool_exp, true),
            true
          )
        },
        get alternates() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get categories() {
          return new InputNodeField(schema.tag_tag_bool_exp, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get default_images() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get description() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get displayName() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get frequency() {
          return new InputNodeField(schema.Int_comparison_exp, true)
        },
        get icon() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get is_ambiguous() {
          return new InputNodeField(schema.Boolean_comparison_exp, true)
        },
        get misc() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get name() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get order() {
          return new InputNodeField(schema.Int_comparison_exp, true)
        },
        get parent() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get parentId() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get restaurant_taxonomies() {
          return new InputNodeField(schema.restaurant_tag_bool_exp, true)
        },
        get rgb() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get type() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
      },
      { name: 'tag_bool_exp' }
    )
  },
  get tag_constraint() {
    return new EnumNode({ name: 'tag_constraint' })
  },
  get tag_delete_at_path_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get default_images() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get misc() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get rgb() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
      },
      { name: 'tag_delete_at_path_input' }
    )
  },
  get tag_delete_elem_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.Int, true)
        },
        get default_images() {
          return new InputNodeField(schema.Int, true)
        },
        get misc() {
          return new InputNodeField(schema.Int, true)
        },
        get rgb() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'tag_delete_elem_input' }
    )
  },
  get tag_delete_key_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.String, true)
        },
        get default_images() {
          return new InputNodeField(schema.String, true)
        },
        get misc() {
          return new InputNodeField(schema.String, true)
        },
        get rgb() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'tag_delete_key_input' }
    )
  },
  get tag_inc_input() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.Int, true)
        },
        get order() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'tag_inc_input' }
    )
  },
  get tag_insert_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.jsonb, true)
        },
        get categories() {
          return new InputNodeField(schema.tag_tag_arr_rel_insert_input, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get default_images() {
          return new InputNodeField(schema.jsonb, true)
        },
        get description() {
          return new InputNodeField(schema.String, true)
        },
        get displayName() {
          return new InputNodeField(schema.String, true)
        },
        get frequency() {
          return new InputNodeField(schema.Int, true)
        },
        get icon() {
          return new InputNodeField(schema.String, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get is_ambiguous() {
          return new InputNodeField(schema.Boolean, true)
        },
        get misc() {
          return new InputNodeField(schema.jsonb, true)
        },
        get name() {
          return new InputNodeField(schema.String, true)
        },
        get order() {
          return new InputNodeField(schema.Int, true)
        },
        get parent() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get parentId() {
          return new InputNodeField(schema.uuid, true)
        },
        get restaurant_taxonomies() {
          return new InputNodeField(
            schema.restaurant_tag_arr_rel_insert_input,
            true
          )
        },
        get rgb() {
          return new InputNodeField(schema.jsonb, true)
        },
        get type() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'tag_insert_input' }
    )
  },
  get tag_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get displayName() {
          return new FieldNode(schema.String, undefined, true)
        },
        get frequency() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get icon() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get parentId() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'tag_max_fields',
        extension: ((extensions as any) || {}).tag_max_fields,
      }
    )
  },
  get tag_max_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get displayName() {
          return new InputNodeField(schema.order_by, true)
        },
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get icon() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
        get parentId() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_max_order_by' }
    )
  },
  get tag_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
        },
        get displayName() {
          return new FieldNode(schema.String, undefined, true)
        },
        get frequency() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get icon() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get parentId() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'tag_min_fields',
        extension: ((extensions as any) || {}).tag_min_fields,
      }
    )
  },
  get tag_min_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get displayName() {
          return new InputNodeField(schema.order_by, true)
        },
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get icon() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
        get parentId() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_min_order_by' }
    )
  },
  get tag_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.tag, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'tag_mutation_response',
        extension: ((extensions as any) || {}).tag_mutation_response,
      }
    )
  },
  get tag_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.tag_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.tag_on_conflict, true)
        },
      },
      { name: 'tag_obj_rel_insert_input' }
    )
  },
  get tag_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.tag_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.tag_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
      },
      { name: 'tag_on_conflict' }
    )
  },
  get tag_order_by() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.order_by, true)
        },
        get categories_aggregate() {
          return new InputNodeField(schema.tag_tag_aggregate_order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get default_images() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
          return new InputNodeField(schema.order_by, true)
        },
        get displayName() {
          return new InputNodeField(schema.order_by, true)
        },
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get icon() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get is_ambiguous() {
          return new InputNodeField(schema.order_by, true)
        },
        get misc() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
        get parent() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get parentId() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_taxonomies_aggregate() {
          return new InputNodeField(
            schema.restaurant_tag_aggregate_order_by,
            true
          )
        },
        get rgb() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_order_by' }
    )
  },
  get tag_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'tag_pk_columns_input' }
    )
  },
  get tag_prepend_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.jsonb, true)
        },
        get default_images() {
          return new InputNodeField(schema.jsonb, true)
        },
        get misc() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rgb() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'tag_prepend_input' }
    )
  },
  get tag_select_column() {
    return new EnumNode({ name: 'tag_select_column' })
  },
  get tag_set_input() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.jsonb, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get default_images() {
          return new InputNodeField(schema.jsonb, true)
        },
        get description() {
          return new InputNodeField(schema.String, true)
        },
        get displayName() {
          return new InputNodeField(schema.String, true)
        },
        get frequency() {
          return new InputNodeField(schema.Int, true)
        },
        get icon() {
          return new InputNodeField(schema.String, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get is_ambiguous() {
          return new InputNodeField(schema.Boolean, true)
        },
        get misc() {
          return new InputNodeField(schema.jsonb, true)
        },
        get name() {
          return new InputNodeField(schema.String, true)
        },
        get order() {
          return new InputNodeField(schema.Int, true)
        },
        get parentId() {
          return new InputNodeField(schema.uuid, true)
        },
        get rgb() {
          return new InputNodeField(schema.jsonb, true)
        },
        get type() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'tag_set_input' }
    )
  },
  get tag_stddev_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_stddev_fields',
        extension: ((extensions as any) || {}).tag_stddev_fields,
      }
    )
  },
  get tag_stddev_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_stddev_order_by' }
    )
  },
  get tag_stddev_pop_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_stddev_pop_fields',
        extension: ((extensions as any) || {}).tag_stddev_pop_fields,
      }
    )
  },
  get tag_stddev_pop_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_stddev_pop_order_by' }
    )
  },
  get tag_stddev_samp_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_stddev_samp_fields',
        extension: ((extensions as any) || {}).tag_stddev_samp_fields,
      }
    )
  },
  get tag_stddev_samp_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_stddev_samp_order_by' }
    )
  },
  get tag_sum_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, true)
        },
      },
      {
        name: 'tag_sum_fields',
        extension: ((extensions as any) || {}).tag_sum_fields,
      }
    )
  },
  get tag_sum_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_sum_order_by' }
    )
  },
  get tag_tag() {
    return new ObjectNode(
      {
        get category() {
          return new FieldNode(schema.tag, undefined, false)
        },
        get category_tag_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get main() {
          return new FieldNode(schema.tag, undefined, false)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
      },
      { name: 'tag_tag', extension: ((extensions as any) || {}).tag_tag }
    )
  },
  get tag_tag_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.tag_tag_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.tag_tag, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'tag_tag_aggregate',
        extension: ((extensions as any) || {}).tag_tag_aggregate,
      }
    )
  },
  get tag_tag_aggregate_fields() {
    return new ObjectNode(
      {
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.tag_tag_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.tag_tag_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.tag_tag_min_fields, undefined, true)
        },
      },
      {
        name: 'tag_tag_aggregate_fields',
        extension: ((extensions as any) || {}).tag_tag_aggregate_fields,
      }
    )
  },
  get tag_tag_aggregate_order_by() {
    return new InputNode(
      {
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.tag_tag_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.tag_tag_min_order_by, true)
        },
      },
      { name: 'tag_tag_aggregate_order_by' }
    )
  },
  get tag_tag_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.tag_tag_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.tag_tag_on_conflict, true)
        },
      },
      { name: 'tag_tag_arr_rel_insert_input' }
    )
  },
  get tag_tag_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.tag_tag_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.tag_tag_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.tag_tag_bool_exp, true),
            true
          )
        },
        get category() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get category_tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get main() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
      },
      { name: 'tag_tag_bool_exp' }
    )
  },
  get tag_tag_constraint() {
    return new EnumNode({ name: 'tag_tag_constraint' })
  },
  get tag_tag_insert_input() {
    return new InputNode(
      {
        get category() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get category_tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get main() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'tag_tag_insert_input' }
    )
  },
  get tag_tag_max_fields() {
    return new ObjectNode(
      {
        get category_tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'tag_tag_max_fields',
        extension: ((extensions as any) || {}).tag_tag_max_fields,
      }
    )
  },
  get tag_tag_max_order_by() {
    return new InputNode(
      {
        get category_tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_tag_max_order_by' }
    )
  },
  get tag_tag_min_fields() {
    return new ObjectNode(
      {
        get category_tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
      },
      {
        name: 'tag_tag_min_fields',
        extension: ((extensions as any) || {}).tag_tag_min_fields,
      }
    )
  },
  get tag_tag_min_order_by() {
    return new InputNode(
      {
        get category_tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_tag_min_order_by' }
    )
  },
  get tag_tag_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.tag_tag, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'tag_tag_mutation_response',
        extension: ((extensions as any) || {}).tag_tag_mutation_response,
      }
    )
  },
  get tag_tag_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.tag_tag_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.tag_tag_on_conflict, true)
        },
      },
      { name: 'tag_tag_obj_rel_insert_input' }
    )
  },
  get tag_tag_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.tag_tag_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.tag_tag_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.tag_tag_bool_exp, true)
        },
      },
      { name: 'tag_tag_on_conflict' }
    )
  },
  get tag_tag_order_by() {
    return new InputNode(
      {
        get category() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get category_tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get main() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_tag_order_by' }
    )
  },
  get tag_tag_pk_columns_input() {
    return new InputNode(
      {
        get category_tag_id() {
          return new InputNodeField(schema.uuid, false)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'tag_tag_pk_columns_input' }
    )
  },
  get tag_tag_select_column() {
    return new EnumNode({ name: 'tag_tag_select_column' })
  },
  get tag_tag_set_input() {
    return new InputNode(
      {
        get category_tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
      },
      { name: 'tag_tag_set_input' }
    )
  },
  get tag_tag_update_column() {
    return new EnumNode({ name: 'tag_tag_update_column' })
  },
  get tag_update_column() {
    return new EnumNode({ name: 'tag_update_column' })
  },
  get tag_var_pop_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_var_pop_fields',
        extension: ((extensions as any) || {}).tag_var_pop_fields,
      }
    )
  },
  get tag_var_pop_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_var_pop_order_by' }
    )
  },
  get tag_var_samp_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_var_samp_fields',
        extension: ((extensions as any) || {}).tag_var_samp_fields,
      }
    )
  },
  get tag_var_samp_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_var_samp_order_by' }
    )
  },
  get tag_variance_fields() {
    return new ObjectNode(
      {
        get frequency() {
          return new FieldNode(schema.Float, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'tag_variance_fields',
        extension: ((extensions as any) || {}).tag_variance_fields,
      }
    )
  },
  get tag_variance_order_by() {
    return new InputNode(
      {
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'tag_variance_order_by' }
    )
  },
  get timestamptz() {
    return new ScalarNode({
      name: 'timestamptz',
      extension: ((extensions as any) || {}).timestamptz,
    })
  },
  get timestamptz_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get _gt() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get _gte() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get _in() {
          return new InputNodeField(
            new ArrayNode(schema.timestamptz, true),
            true
          )
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get _lte() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get _neq() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get _nin() {
          return new InputNodeField(
            new ArrayNode(schema.timestamptz, true),
            true
          )
        },
      },
      { name: 'timestamptz_comparison_exp' }
    )
  },
  get tsrange() {
    return new ScalarNode({
      name: 'tsrange',
      extension: ((extensions as any) || {}).tsrange,
    })
  },
  get tsrange_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.tsrange, true)
        },
        get _gt() {
          return new InputNodeField(schema.tsrange, true)
        },
        get _gte() {
          return new InputNodeField(schema.tsrange, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.tsrange, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.tsrange, true)
        },
        get _lte() {
          return new InputNodeField(schema.tsrange, true)
        },
        get _neq() {
          return new InputNodeField(schema.tsrange, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.tsrange, true), true)
        },
      },
      { name: 'tsrange_comparison_exp' }
    )
  },
  get user() {
    return new ObjectNode(
      {
        get about() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_email() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_refresh_token() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_secret() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_uid() {
          return new FieldNode(schema.String, undefined, true)
        },
        get avatar() {
          return new FieldNode(schema.String, undefined, true)
        },
        get charIndex() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get email() {
          return new FieldNode(schema.String, undefined, true)
        },
        get has_onboarded() {
          return new FieldNode(schema.Boolean, undefined, false)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get location() {
          return new FieldNode(schema.String, undefined, true)
        },
        get password() {
          return new FieldNode(schema.String, undefined, false)
        },
        get reviews() {
          return new FieldNode(
            new ArrayNode(schema.review, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get reviews_aggregate() {
          return new FieldNode(
            schema.review_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_select_column, true),
                  true
                )
              },
              get limit() {
                return new ArgumentsField(schema.Int, true)
              },
              get offset() {
                return new ArgumentsField(schema.Int, true)
              },
              get order_by() {
                return new ArgumentsField(
                  new ArrayNode(schema.review_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.review_bool_exp, true)
              },
            }),
            false
          )
        },
        get role() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get username() {
          return new FieldNode(schema.String, undefined, false)
        },
      },
      { name: 'user', extension: ((extensions as any) || {}).user }
    )
  },
  get user_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.user_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.user, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'user_aggregate',
        extension: ((extensions as any) || {}).user_aggregate,
      }
    )
  },
  get user_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.user_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.user_select_column, true),
                  true
                )
              },
              get distinct() {
                return new ArgumentsField(schema.Boolean, true)
              },
            }),
            true
          )
        },
        get max() {
          return new FieldNode(schema.user_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.user_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.user_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(schema.user_stddev_pop_fields, undefined, true)
        },
        get stddev_samp() {
          return new FieldNode(schema.user_stddev_samp_fields, undefined, true)
        },
        get sum() {
          return new FieldNode(schema.user_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(schema.user_var_pop_fields, undefined, true)
        },
        get var_samp() {
          return new FieldNode(schema.user_var_samp_fields, undefined, true)
        },
        get variance() {
          return new FieldNode(schema.user_variance_fields, undefined, true)
        },
      },
      {
        name: 'user_aggregate_fields',
        extension: ((extensions as any) || {}).user_aggregate_fields,
      }
    )
  },
  get user_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.user_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.user_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.user_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.user_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.user_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(schema.user_stddev_samp_order_by, true)
        },
        get sum() {
          return new InputNodeField(schema.user_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.user_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.user_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.user_variance_order_by, true)
        },
      },
      { name: 'user_aggregate_order_by' }
    )
  },
  get user_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.user_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.user_on_conflict, true)
        },
      },
      { name: 'user_arr_rel_insert_input' }
    )
  },
  get user_avg_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_avg_fields',
        extension: ((extensions as any) || {}).user_avg_fields,
      }
    )
  },
  get user_avg_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_avg_order_by' }
    )
  },
  get user_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.user_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.user_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.user_bool_exp, true),
            true
          )
        },
        get about() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get apple_email() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get apple_refresh_token() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get apple_secret() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get apple_uid() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get avatar() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get charIndex() {
          return new InputNodeField(schema.Int_comparison_exp, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get email() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get has_onboarded() {
          return new InputNodeField(schema.Boolean_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get location() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get password() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get reviews() {
          return new InputNodeField(schema.review_bool_exp, true)
        },
        get role() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get username() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
      },
      { name: 'user_bool_exp' }
    )
  },
  get user_constraint() {
    return new EnumNode({ name: 'user_constraint' })
  },
  get user_inc_input() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'user_inc_input' }
    )
  },
  get user_insert_input() {
    return new InputNode(
      {
        get about() {
          return new InputNodeField(schema.String, true)
        },
        get apple_email() {
          return new InputNodeField(schema.String, true)
        },
        get apple_refresh_token() {
          return new InputNodeField(schema.String, true)
        },
        get apple_secret() {
          return new InputNodeField(schema.String, true)
        },
        get apple_uid() {
          return new InputNodeField(schema.String, true)
        },
        get avatar() {
          return new InputNodeField(schema.String, true)
        },
        get charIndex() {
          return new InputNodeField(schema.Int, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get email() {
          return new InputNodeField(schema.String, true)
        },
        get has_onboarded() {
          return new InputNodeField(schema.Boolean, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get location() {
          return new InputNodeField(schema.String, true)
        },
        get password() {
          return new InputNodeField(schema.String, true)
        },
        get reviews() {
          return new InputNodeField(schema.review_arr_rel_insert_input, true)
        },
        get role() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get username() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'user_insert_input' }
    )
  },
  get user_max_fields() {
    return new ObjectNode(
      {
        get about() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_email() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_refresh_token() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_secret() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_uid() {
          return new FieldNode(schema.String, undefined, true)
        },
        get avatar() {
          return new FieldNode(schema.String, undefined, true)
        },
        get charIndex() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get email() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get location() {
          return new FieldNode(schema.String, undefined, true)
        },
        get password() {
          return new FieldNode(schema.String, undefined, true)
        },
        get role() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get username() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      {
        name: 'user_max_fields',
        extension: ((extensions as any) || {}).user_max_fields,
      }
    )
  },
  get user_max_order_by() {
    return new InputNode(
      {
        get about() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_email() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_refresh_token() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_secret() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_uid() {
          return new InputNodeField(schema.order_by, true)
        },
        get avatar() {
          return new InputNodeField(schema.order_by, true)
        },
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get email() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get password() {
          return new InputNodeField(schema.order_by, true)
        },
        get role() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get username() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_max_order_by' }
    )
  },
  get user_min_fields() {
    return new ObjectNode(
      {
        get about() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_email() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_refresh_token() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_secret() {
          return new FieldNode(schema.String, undefined, true)
        },
        get apple_uid() {
          return new FieldNode(schema.String, undefined, true)
        },
        get avatar() {
          return new FieldNode(schema.String, undefined, true)
        },
        get charIndex() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get email() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get location() {
          return new FieldNode(schema.String, undefined, true)
        },
        get password() {
          return new FieldNode(schema.String, undefined, true)
        },
        get role() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get username() {
          return new FieldNode(schema.String, undefined, true)
        },
      },
      {
        name: 'user_min_fields',
        extension: ((extensions as any) || {}).user_min_fields,
      }
    )
  },
  get user_min_order_by() {
    return new InputNode(
      {
        get about() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_email() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_refresh_token() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_secret() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_uid() {
          return new InputNodeField(schema.order_by, true)
        },
        get avatar() {
          return new InputNodeField(schema.order_by, true)
        },
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get email() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get password() {
          return new InputNodeField(schema.order_by, true)
        },
        get role() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get username() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_min_order_by' }
    )
  },
  get user_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.user, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'user_mutation_response',
        extension: ((extensions as any) || {}).user_mutation_response,
      }
    )
  },
  get user_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.user_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.user_on_conflict, true)
        },
      },
      { name: 'user_obj_rel_insert_input' }
    )
  },
  get user_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.user_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.user_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.user_bool_exp, true)
        },
      },
      { name: 'user_on_conflict' }
    )
  },
  get user_order_by() {
    return new InputNode(
      {
        get about() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_email() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_refresh_token() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_secret() {
          return new InputNodeField(schema.order_by, true)
        },
        get apple_uid() {
          return new InputNodeField(schema.order_by, true)
        },
        get avatar() {
          return new InputNodeField(schema.order_by, true)
        },
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get email() {
          return new InputNodeField(schema.order_by, true)
        },
        get has_onboarded() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get password() {
          return new InputNodeField(schema.order_by, true)
        },
        get reviews_aggregate() {
          return new InputNodeField(schema.review_aggregate_order_by, true)
        },
        get role() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get username() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_order_by' }
    )
  },
  get user_pk_columns_input() {
    return new InputNode(
      {
        get id() {
          return new InputNodeField(schema.uuid, false)
        },
      },
      { name: 'user_pk_columns_input' }
    )
  },
  get user_select_column() {
    return new EnumNode({ name: 'user_select_column' })
  },
  get user_set_input() {
    return new InputNode(
      {
        get about() {
          return new InputNodeField(schema.String, true)
        },
        get apple_email() {
          return new InputNodeField(schema.String, true)
        },
        get apple_refresh_token() {
          return new InputNodeField(schema.String, true)
        },
        get apple_secret() {
          return new InputNodeField(schema.String, true)
        },
        get apple_uid() {
          return new InputNodeField(schema.String, true)
        },
        get avatar() {
          return new InputNodeField(schema.String, true)
        },
        get charIndex() {
          return new InputNodeField(schema.Int, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get email() {
          return new InputNodeField(schema.String, true)
        },
        get has_onboarded() {
          return new InputNodeField(schema.Boolean, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get location() {
          return new InputNodeField(schema.String, true)
        },
        get password() {
          return new InputNodeField(schema.String, true)
        },
        get role() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get username() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'user_set_input' }
    )
  },
  get user_stddev_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_stddev_fields',
        extension: ((extensions as any) || {}).user_stddev_fields,
      }
    )
  },
  get user_stddev_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_stddev_order_by' }
    )
  },
  get user_stddev_pop_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_stddev_pop_fields',
        extension: ((extensions as any) || {}).user_stddev_pop_fields,
      }
    )
  },
  get user_stddev_pop_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_stddev_pop_order_by' }
    )
  },
  get user_stddev_samp_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_stddev_samp_fields',
        extension: ((extensions as any) || {}).user_stddev_samp_fields,
      }
    )
  },
  get user_stddev_samp_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_stddev_samp_order_by' }
    )
  },
  get user_sum_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Int, undefined, true)
        },
      },
      {
        name: 'user_sum_fields',
        extension: ((extensions as any) || {}).user_sum_fields,
      }
    )
  },
  get user_sum_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_sum_order_by' }
    )
  },
  get user_update_column() {
    return new EnumNode({ name: 'user_update_column' })
  },
  get user_var_pop_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_var_pop_fields',
        extension: ((extensions as any) || {}).user_var_pop_fields,
      }
    )
  },
  get user_var_pop_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_var_pop_order_by' }
    )
  },
  get user_var_samp_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_var_samp_fields',
        extension: ((extensions as any) || {}).user_var_samp_fields,
      }
    )
  },
  get user_var_samp_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_var_samp_order_by' }
    )
  },
  get user_variance_fields() {
    return new ObjectNode(
      {
        get charIndex() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'user_variance_fields',
        extension: ((extensions as any) || {}).user_variance_fields,
      }
    )
  },
  get user_variance_order_by() {
    return new InputNode(
      {
        get charIndex() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'user_variance_order_by' }
    )
  },
  get uuid() {
    return new ScalarNode({
      name: 'uuid',
      extension: ((extensions as any) || {}).uuid,
    })
  },
  get uuid_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.uuid, true)
        },
        get _gt() {
          return new InputNodeField(schema.uuid, true)
        },
        get _gte() {
          return new InputNodeField(schema.uuid, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.uuid, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.uuid, true)
        },
        get _lte() {
          return new InputNodeField(schema.uuid, true)
        },
        get _neq() {
          return new InputNodeField(schema.uuid, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.uuid, true), true)
        },
      },
      { name: 'uuid_comparison_exp' }
    )
  },
}

lazyGetters(schema)
