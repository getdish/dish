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
} from 'gqless'

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
  get dish() {
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
        get restaurant_parent() {
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
        get restaurant_parent_aggregate() {
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
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
      },
      { name: 'dish', extension: ((extensions as any) || {}).dish }
    )
  },
  get dish_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.dish_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.dish, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'dish_aggregate',
        extension: ((extensions as any) || {}).dish_aggregate,
      }
    )
  },
  get dish_aggregate_fields() {
    return new ObjectNode(
      {
        get avg() {
          return new FieldNode(schema.dish_avg_fields, undefined, true)
        },
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
          return new FieldNode(schema.dish_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.dish_min_fields, undefined, true)
        },
        get stddev() {
          return new FieldNode(schema.dish_stddev_fields, undefined, true)
        },
        get stddev_pop() {
          return new FieldNode(schema.dish_stddev_pop_fields, undefined, true)
        },
        get stddev_samp() {
          return new FieldNode(schema.dish_stddev_samp_fields, undefined, true)
        },
        get sum() {
          return new FieldNode(schema.dish_sum_fields, undefined, true)
        },
        get var_pop() {
          return new FieldNode(schema.dish_var_pop_fields, undefined, true)
        },
        get var_samp() {
          return new FieldNode(schema.dish_var_samp_fields, undefined, true)
        },
        get variance() {
          return new FieldNode(schema.dish_variance_fields, undefined, true)
        },
      },
      {
        name: 'dish_aggregate_fields',
        extension: ((extensions as any) || {}).dish_aggregate_fields,
      }
    )
  },
  get dish_aggregate_order_by() {
    return new InputNode(
      {
        get avg() {
          return new InputNodeField(schema.dish_avg_order_by, true)
        },
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.dish_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.dish_min_order_by, true)
        },
        get stddev() {
          return new InputNodeField(schema.dish_stddev_order_by, true)
        },
        get stddev_pop() {
          return new InputNodeField(schema.dish_stddev_pop_order_by, true)
        },
        get stddev_samp() {
          return new InputNodeField(schema.dish_stddev_samp_order_by, true)
        },
        get sum() {
          return new InputNodeField(schema.dish_sum_order_by, true)
        },
        get var_pop() {
          return new InputNodeField(schema.dish_var_pop_order_by, true)
        },
        get var_samp() {
          return new InputNodeField(schema.dish_var_samp_order_by, true)
        },
        get variance() {
          return new InputNodeField(schema.dish_variance_order_by, true)
        },
      },
      { name: 'dish_aggregate_order_by' }
    )
  },
  get dish_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.dish_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.dish_on_conflict, true)
        },
      },
      { name: 'dish_arr_rel_insert_input' }
    )
  },
  get dish_avg_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_avg_fields',
        extension: ((extensions as any) || {}).dish_avg_fields,
      }
    )
  },
  get dish_avg_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_avg_order_by' }
    )
  },
  get dish_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.dish_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.dish_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.dish_bool_exp, true),
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
        get restaurant_parent() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
      },
      { name: 'dish_bool_exp' }
    )
  },
  get dish_constraint() {
    return new EnumNode({ name: 'dish_constraint' })
  },
  get dish_inc_input() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'dish_inc_input' }
    )
  },
  get dish_insert_input() {
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
        get restaurant_parent() {
          return new InputNodeField(
            schema.restaurant_arr_rel_insert_input,
            true
          )
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'dish_insert_input' }
    )
  },
  get dish_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
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
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'dish_max_fields',
        extension: ((extensions as any) || {}).dish_max_fields,
      }
    )
  },
  get dish_max_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
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
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_max_order_by' }
    )
  },
  get dish_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get description() {
          return new FieldNode(schema.String, undefined, true)
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
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'dish_min_fields',
        extension: ((extensions as any) || {}).dish_min_fields,
      }
    )
  },
  get dish_min_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
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
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_min_order_by' }
    )
  },
  get dish_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.dish, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'dish_mutation_response',
        extension: ((extensions as any) || {}).dish_mutation_response,
      }
    )
  },
  get dish_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.dish_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.dish_on_conflict, true)
        },
      },
      { name: 'dish_obj_rel_insert_input' }
    )
  },
  get dish_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.dish_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.dish_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.dish_bool_exp, true)
        },
      },
      { name: 'dish_on_conflict' }
    )
  },
  get dish_order_by() {
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
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant_parent_aggregate() {
          return new InputNodeField(schema.restaurant_aggregate_order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_order_by' }
    )
  },
  get dish_select_column() {
    return new EnumNode({ name: 'dish_select_column' })
  },
  get dish_set_input() {
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
      { name: 'dish_set_input' }
    )
  },
  get dish_stddev_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_stddev_fields',
        extension: ((extensions as any) || {}).dish_stddev_fields,
      }
    )
  },
  get dish_stddev_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_stddev_order_by' }
    )
  },
  get dish_stddev_pop_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_stddev_pop_fields',
        extension: ((extensions as any) || {}).dish_stddev_pop_fields,
      }
    )
  },
  get dish_stddev_pop_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_stddev_pop_order_by' }
    )
  },
  get dish_stddev_samp_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_stddev_samp_fields',
        extension: ((extensions as any) || {}).dish_stddev_samp_fields,
      }
    )
  },
  get dish_stddev_samp_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_stddev_samp_order_by' }
    )
  },
  get dish_sum_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Int, undefined, true)
        },
      },
      {
        name: 'dish_sum_fields',
        extension: ((extensions as any) || {}).dish_sum_fields,
      }
    )
  },
  get dish_sum_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_sum_order_by' }
    )
  },
  get dish_update_column() {
    return new EnumNode({ name: 'dish_update_column' })
  },
  get dish_var_pop_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_var_pop_fields',
        extension: ((extensions as any) || {}).dish_var_pop_fields,
      }
    )
  },
  get dish_var_pop_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_var_pop_order_by' }
    )
  },
  get dish_var_samp_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_var_samp_fields',
        extension: ((extensions as any) || {}).dish_var_samp_fields,
      }
    )
  },
  get dish_var_samp_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_var_samp_order_by' }
    )
  },
  get dish_variance_fields() {
    return new ObjectNode(
      {
        get price() {
          return new FieldNode(schema.Float, undefined, true)
        },
      },
      {
        name: 'dish_variance_fields',
        extension: ((extensions as any) || {}).dish_variance_fields,
      }
    )
  },
  get dish_variance_order_by() {
    return new InputNode(
      {
        get price() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'dish_variance_order_by' }
    )
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
  get mutation_root() {
    return new ObjectNode(
      {
        get delete_dish() {
          return new FieldNode(
            schema.dish_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.dish_bool_exp, false)
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
        get delete_scrape() {
          return new FieldNode(
            schema.scrape_mutation_response,
            new Arguments(
              {
                get where() {
                  return new ArgumentsField(schema.scrape_bool_exp, false)
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
        get insert_dish() {
          return new FieldNode(
            schema.dish_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.dish_on_conflict, true)
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
        get insert_scrape() {
          return new FieldNode(
            schema.scrape_mutation_response,
            new Arguments({
              get objects() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_insert_input, false),
                  false
                )
              },
              get on_conflict() {
                return new ArgumentsField(schema.scrape_on_conflict, true)
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
        get update_dish() {
          return new FieldNode(
            schema.dish_mutation_response,
            new Arguments({
              get _inc() {
                return new ArgumentsField(schema.dish_inc_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.dish_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, false)
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
        get update_scrape() {
          return new FieldNode(
            schema.scrape_mutation_response,
            new Arguments({
              get _append() {
                return new ArgumentsField(schema.scrape_append_input, true)
              },
              get _delete_at_path() {
                return new ArgumentsField(
                  schema.scrape_delete_at_path_input,
                  true
                )
              },
              get _delete_elem() {
                return new ArgumentsField(schema.scrape_delete_elem_input, true)
              },
              get _delete_key() {
                return new ArgumentsField(schema.scrape_delete_key_input, true)
              },
              get _prepend() {
                return new ArgumentsField(schema.scrape_prepend_input, true)
              },
              get _set() {
                return new ArgumentsField(schema.scrape_set_input, true)
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, false)
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
        get update_user() {
          return new FieldNode(
            schema.user_mutation_response,
            new Arguments({
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
  get order_by() {
    return new EnumNode({ name: 'order_by' })
  },
  get query_root() {
    return new ObjectNode(
      {
        get dish() {
          return new FieldNode(
            new ArrayNode(schema.dish, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
                  new ArrayNode(schema.dish_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, true)
              },
            }),
            false
          )
        },
        get dish_aggregate() {
          return new FieldNode(
            schema.dish_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
                  new ArrayNode(schema.dish_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, true)
              },
            }),
            false
          )
        },
        get dish_by_pk() {
          return new FieldNode(
            schema.dish,
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
        get scrape() {
          return new FieldNode(
            new ArrayNode(schema.scrape, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
                  new ArrayNode(schema.scrape_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, true)
              },
            }),
            false
          )
        },
        get scrape_aggregate() {
          return new FieldNode(
            schema.scrape_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
                  new ArrayNode(schema.scrape_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, true)
              },
            }),
            false
          )
        },
        get scrape_by_pk() {
          return new FieldNode(
            schema.scrape,
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
        get dishes() {
          return new FieldNode(
            new ArrayNode(schema.dish, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
                  new ArrayNode(schema.dish_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, true)
              },
            }),
            false
          )
        },
        get dishes_aggregate() {
          return new FieldNode(
            schema.dish_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
                  new ArrayNode(schema.dish_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, true)
              },
            }),
            false
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
        get scrapes() {
          return new FieldNode(
            new ArrayNode(schema.scrape, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
                  new ArrayNode(schema.scrape_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, true)
              },
            }),
            false
          )
        },
        get scrapes_aggregate() {
          return new FieldNode(
            schema.scrape_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
                  new ArrayNode(schema.scrape_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, true)
              },
            }),
            false
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
        get hours() {
          return new InputNodeField(schema.jsonb, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rating_factors() {
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
        get dishes() {
          return new InputNodeField(schema.dish_bool_exp, true)
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
        get scrapes() {
          return new InputNodeField(schema.scrape_bool_exp, true)
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
        get hours() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get photos() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
        get rating_factors() {
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
        get hours() {
          return new InputNodeField(schema.Int, true)
        },
        get photos() {
          return new InputNodeField(schema.Int, true)
        },
        get rating_factors() {
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
        get hours() {
          return new InputNodeField(schema.String, true)
        },
        get photos() {
          return new InputNodeField(schema.String, true)
        },
        get rating_factors() {
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
        get dishes() {
          return new InputNodeField(schema.dish_arr_rel_insert_input, true)
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
        get reviews() {
          return new InputNodeField(schema.review_arr_rel_insert_input, true)
        },
        get scrapes() {
          return new InputNodeField(schema.scrape_arr_rel_insert_input, true)
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
        get dishes_aggregate() {
          return new InputNodeField(schema.dish_aggregate_order_by, true)
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
        get scrapes_aggregate() {
          return new InputNodeField(schema.scrape_aggregate_order_by, true)
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
  get restaurant_prepend_input() {
    return new InputNode(
      {
        get hours() {
          return new InputNodeField(schema.jsonb, true)
        },
        get photos() {
          return new InputNodeField(schema.jsonb, true)
        },
        get rating_factors() {
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
      },
      { name: 'restaurant_tag_inc_input' }
    )
  },
  get restaurant_tag_insert_input() {
    return new InputNode(
      {
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
        get rank() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
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
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_tag_max_order_by' }
    )
  },
  get restaurant_tag_min_fields() {
    return new ObjectNode(
      {
        get rank() {
          return new FieldNode(schema.Int, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
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
        get rank() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
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
  get restaurant_tag_prepend_input() {
    return new InputNode(
      {
        get photos() {
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
      },
      { name: 'restaurant_tag_variance_order_by' }
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
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, false)
        },
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get tag_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get taxonomy() {
          return new FieldNode(schema.tag, undefined, true)
        },
        get text() {
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
        get categories() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
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
        get tag_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get taxonomy() {
          return new InputNodeField(schema.tag_bool_exp, true)
        },
        get text() {
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
  get review_insert_input() {
    return new InputNode(
      {
        get categories() {
          return new InputNodeField(schema.jsonb, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
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
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get taxonomy() {
          return new InputNodeField(schema.tag_obj_rel_insert_input, true)
        },
        get text() {
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
      },
      { name: 'review_insert_input' }
    )
  },
  get review_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get text() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
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
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get text() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'review_max_order_by' }
    )
  },
  get review_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get rating() {
          return new FieldNode(schema.numeric, undefined, true)
        },
        get text() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
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
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get rating() {
          return new InputNodeField(schema.order_by, true)
        },
        get text() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
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
        get categories() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
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
        get tag_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get taxonomy() {
          return new InputNodeField(schema.tag_order_by, true)
        },
        get text() {
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
      },
      { name: 'review_order_by' }
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
        get categories() {
          return new InputNodeField(schema.jsonb, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get rating() {
          return new InputNodeField(schema.numeric, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get tag_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get text() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get user_id() {
          return new InputNodeField(schema.uuid, true)
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
      },
      { name: 'review_sum_order_by' }
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
      },
      { name: 'review_variance_order_by' }
    )
  },
  get scrape() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get data() {
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
        get id_from_source() {
          return new FieldNode(schema.String, undefined, false)
        },
        get location() {
          return new FieldNode(schema.geometry, undefined, true)
        },
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, true)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get source() {
          return new FieldNode(schema.String, undefined, false)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
      },
      { name: 'scrape', extension: ((extensions as any) || {}).scrape }
    )
  },
  get scrape_aggregate() {
    return new ObjectNode(
      {
        get aggregate() {
          return new FieldNode(schema.scrape_aggregate_fields, undefined, true)
        },
        get nodes() {
          return new FieldNode(
            new ArrayNode(schema.scrape, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'scrape_aggregate',
        extension: ((extensions as any) || {}).scrape_aggregate,
      }
    )
  },
  get scrape_aggregate_fields() {
    return new ObjectNode(
      {
        get count() {
          return new FieldNode(
            schema.Int,
            new Arguments({
              get columns() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
          return new FieldNode(schema.scrape_max_fields, undefined, true)
        },
        get min() {
          return new FieldNode(schema.scrape_min_fields, undefined, true)
        },
      },
      {
        name: 'scrape_aggregate_fields',
        extension: ((extensions as any) || {}).scrape_aggregate_fields,
      }
    )
  },
  get scrape_aggregate_order_by() {
    return new InputNode(
      {
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.scrape_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.scrape_min_order_by, true)
        },
      },
      { name: 'scrape_aggregate_order_by' }
    )
  },
  get scrape_append_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'scrape_append_input' }
    )
  },
  get scrape_arr_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(
            new ArrayNode(schema.scrape_insert_input, false),
            false
          )
        },
        get on_conflict() {
          return new InputNodeField(schema.scrape_on_conflict, true)
        },
      },
      { name: 'scrape_arr_rel_insert_input' }
    )
  },
  get scrape_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.scrape_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.scrape_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.scrape_bool_exp, true),
            true
          )
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get data() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get id_from_source() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get location() {
          return new InputNodeField(schema.geometry_comparison_exp, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get source() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
      },
      { name: 'scrape_bool_exp' }
    )
  },
  get scrape_constraint() {
    return new EnumNode({ name: 'scrape_constraint' })
  },
  get scrape_delete_at_path_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(new ArrayNode(schema.String, true), true)
        },
      },
      { name: 'scrape_delete_at_path_input' }
    )
  },
  get scrape_delete_elem_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.Int, true)
        },
      },
      { name: 'scrape_delete_elem_input' }
    )
  },
  get scrape_delete_key_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.String, true)
        },
      },
      { name: 'scrape_delete_key_input' }
    )
  },
  get scrape_insert_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get data() {
          return new InputNodeField(schema.jsonb, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get id_from_source() {
          return new InputNodeField(schema.String, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
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
        get source() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'scrape_insert_input' }
    )
  },
  get scrape_max_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id_from_source() {
          return new FieldNode(schema.String, undefined, true)
        },
        get source() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'scrape_max_fields',
        extension: ((extensions as any) || {}).scrape_max_fields,
      }
    )
  },
  get scrape_max_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id_from_source() {
          return new InputNodeField(schema.order_by, true)
        },
        get source() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'scrape_max_order_by' }
    )
  },
  get scrape_min_fields() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
        get id_from_source() {
          return new FieldNode(schema.String, undefined, true)
        },
        get source() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
        },
      },
      {
        name: 'scrape_min_fields',
        extension: ((extensions as any) || {}).scrape_min_fields,
      }
    )
  },
  get scrape_min_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id_from_source() {
          return new InputNodeField(schema.order_by, true)
        },
        get source() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'scrape_min_order_by' }
    )
  },
  get scrape_mutation_response() {
    return new ObjectNode(
      {
        get affected_rows() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get returning() {
          return new FieldNode(
            new ArrayNode(schema.scrape, false),
            undefined,
            false
          )
        },
      },
      {
        name: 'scrape_mutation_response',
        extension: ((extensions as any) || {}).scrape_mutation_response,
      }
    )
  },
  get scrape_obj_rel_insert_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.scrape_insert_input, false)
        },
        get on_conflict() {
          return new InputNodeField(schema.scrape_on_conflict, true)
        },
      },
      { name: 'scrape_obj_rel_insert_input' }
    )
  },
  get scrape_on_conflict() {
    return new InputNode(
      {
        get constraint() {
          return new InputNodeField(schema.scrape_constraint, false)
        },
        get update_columns() {
          return new InputNodeField(
            new ArrayNode(schema.scrape_update_column, false),
            false
          )
        },
        get where() {
          return new InputNodeField(schema.scrape_bool_exp, true)
        },
      },
      { name: 'scrape_on_conflict' }
    )
  },
  get scrape_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get data() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
          return new InputNodeField(schema.order_by, true)
        },
        get id_from_source() {
          return new InputNodeField(schema.order_by, true)
        },
        get location() {
          return new InputNodeField(schema.order_by, true)
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get source() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'scrape_order_by' }
    )
  },
  get scrape_prepend_input() {
    return new InputNode(
      {
        get data() {
          return new InputNodeField(schema.jsonb, true)
        },
      },
      { name: 'scrape_prepend_input' }
    )
  },
  get scrape_select_column() {
    return new EnumNode({ name: 'scrape_select_column' })
  },
  get scrape_set_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get data() {
          return new InputNodeField(schema.jsonb, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
        },
        get id_from_source() {
          return new InputNodeField(schema.String, true)
        },
        get location() {
          return new InputNodeField(schema.geometry, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid, true)
        },
        get source() {
          return new InputNodeField(schema.String, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
      },
      { name: 'scrape_set_input' }
    )
  },
  get scrape_update_column() {
    return new EnumNode({ name: 'scrape_update_column' })
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
        get dish() {
          return new FieldNode(
            new ArrayNode(schema.dish, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
                  new ArrayNode(schema.dish_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, true)
              },
            }),
            false
          )
        },
        get dish_aggregate() {
          return new FieldNode(
            schema.dish_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.dish_select_column, true),
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
                  new ArrayNode(schema.dish_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.dish_bool_exp, true)
              },
            }),
            false
          )
        },
        get dish_by_pk() {
          return new FieldNode(
            schema.dish,
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
        get scrape() {
          return new FieldNode(
            new ArrayNode(schema.scrape, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
                  new ArrayNode(schema.scrape_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, true)
              },
            }),
            false
          )
        },
        get scrape_aggregate() {
          return new FieldNode(
            schema.scrape_aggregate,
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.scrape_select_column, true),
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
                  new ArrayNode(schema.scrape_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.scrape_bool_exp, true)
              },
            }),
            false
          )
        },
        get scrape_by_pk() {
          return new FieldNode(
            schema.scrape,
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
        get displayName() {
          return new FieldNode(schema.String, undefined, true)
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
        get displayName() {
          return new InputNodeField(schema.String_comparison_exp, true)
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
        get displayName() {
          return new InputNodeField(schema.String, true)
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
        get displayName() {
          return new FieldNode(schema.String, undefined, true)
        },
        get icon() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, true)
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
        get displayName() {
          return new InputNodeField(schema.order_by, true)
        },
        get icon() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
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
        get displayName() {
          return new FieldNode(schema.String, undefined, true)
        },
        get icon() {
          return new FieldNode(schema.String, undefined, true)
        },
        get name() {
          return new FieldNode(schema.String, undefined, true)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, true)
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
        get displayName() {
          return new InputNodeField(schema.order_by, true)
        },
        get icon() {
          return new InputNodeField(schema.order_by, true)
        },
        get name() {
          return new InputNodeField(schema.order_by, true)
        },
        get order() {
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
        get displayName() {
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
  get tag_prepend_input() {
    return new InputNode(
      {
        get alternates() {
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
        get displayName() {
          return new InputNodeField(schema.String, true)
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
  get user() {
    return new ObjectNode(
      {
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
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
        get count() {
          return new InputNodeField(schema.order_by, true)
        },
        get max() {
          return new InputNodeField(schema.user_max_order_by, true)
        },
        get min() {
          return new InputNodeField(schema.user_min_order_by, true)
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
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
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
  get user_insert_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
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
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
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
        get created_at() {
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
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, true)
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
        get created_at() {
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
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
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
  get user_select_column() {
    return new EnumNode({ name: 'user_select_column' })
  },
  get user_set_input() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.timestamptz, true)
        },
        get id() {
          return new InputNodeField(schema.uuid, true)
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
  get user_update_column() {
    return new EnumNode({ name: 'user_update_column' })
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
