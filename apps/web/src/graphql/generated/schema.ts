// @ts-nocheck
import * as extensions from '../extensions'
import { lazyGetters } from '@gqless/utils'
import {
  ScalarNode,
  InputNode,
  InputNodeField,
  ArrayNode,
  ObjectNode,
  FieldNode,
  EnumNode,
  Arguments,
  ArgumentsField,
} from 'gqless'

export const schema = {
  get Boolean() {
    return new ScalarNode({
      name: 'Boolean',
      extension: ((extensions as any) || {}).Boolean,
    })
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
  get bigint() {
    return new ScalarNode({
      name: 'bigint',
      extension: ((extensions as any) || {}).bigint,
    })
  },
  get bigint_comparison_exp() {
    return new InputNode(
      {
        get _eq() {
          return new InputNodeField(schema.bigint, true)
        },
        get _gt() {
          return new InputNodeField(schema.bigint, true)
        },
        get _gte() {
          return new InputNodeField(schema.bigint, true)
        },
        get _in() {
          return new InputNodeField(new ArrayNode(schema.bigint, true), true)
        },
        get _is_null() {
          return new InputNodeField(schema.Boolean, true)
        },
        get _lt() {
          return new InputNodeField(schema.bigint, true)
        },
        get _lte() {
          return new InputNodeField(schema.bigint, true)
        },
        get _neq() {
          return new InputNodeField(schema.bigint, true)
        },
        get _nin() {
          return new InputNodeField(new ArrayNode(schema.bigint, true), true)
        },
      },
      { name: 'bigint_comparison_exp' }
    )
  },
  get dish() {
    return new ObjectNode(
      {
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
      },
      { name: 'dish', extension: ((extensions as any) || {}).dish }
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
      },
      { name: 'dish_bool_exp' }
    )
  },
  get dish_order_by() {
    return new InputNode(
      {
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
      },
      { name: 'dish_order_by' }
    )
  },
  get dish_select_column() {
    return new EnumNode({ name: 'dish_select_column' })
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
        get restaurant_taxonomy() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_taxonomy, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_taxonomy_select_column, true),
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
                  new ArrayNode(schema.restaurant_taxonomy_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.restaurant_taxonomy_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get restaurant_taxonomy_by_pk() {
          return new FieldNode(
            schema.restaurant_taxonomy,
            new Arguments(
              {
                get restaurant_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get taxonomy_id() {
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
        get taxonomy() {
          return new FieldNode(
            new ArrayNode(schema.taxonomy, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.taxonomy_select_column, true),
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
                  new ArrayNode(schema.taxonomy_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.taxonomy_bool_exp, true)
              },
            }),
            false
          )
        },
        get taxonomy_by_pk() {
          return new FieldNode(
            schema.taxonomy,
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
        get top_dishes() {
          return new FieldNode(
            new ArrayNode(schema.top_dishes_results, false),
            new Arguments({
              get args() {
                return new ArgumentsField(schema.top_dishes_args, false)
              },
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.top_dishes_results_select_column, true),
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
                  new ArrayNode(schema.top_dishes_results_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.top_dishes_results_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get top_dishes_results() {
          return new FieldNode(
            new ArrayNode(schema.top_dishes_results, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.top_dishes_results_select_column, true),
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
                  new ArrayNode(schema.top_dishes_results_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.top_dishes_results_bool_exp,
                  true
                )
              },
            }),
            false
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
        get tag_rankings() {
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
            new ArrayNode(schema.restaurant_taxonomy, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_taxonomy_select_column, true),
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
                  new ArrayNode(schema.restaurant_taxonomy_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.restaurant_taxonomy_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get telephone() {
          return new FieldNode(schema.String, undefined, true)
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
        get reviews() {
          return new InputNodeField(schema.review_bool_exp, true)
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
        get tag_rankings() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get tags() {
          return new InputNodeField(schema.restaurant_taxonomy_bool_exp, true)
        },
        get telephone() {
          return new InputNodeField(schema.String_comparison_exp, true)
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
  get restaurant_order_by() {
    return new InputNode(
      {
        get address() {
          return new InputNodeField(schema.order_by, true)
        },
        get city() {
          return new InputNodeField(schema.order_by, true)
        },
        get description() {
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
        get slug() {
          return new InputNodeField(schema.order_by, true)
        },
        get sources() {
          return new InputNodeField(schema.order_by, true)
        },
        get state() {
          return new InputNodeField(schema.order_by, true)
        },
        get tag_rankings() {
          return new InputNodeField(schema.order_by, true)
        },
        get telephone() {
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
  get restaurant_select_column() {
    return new EnumNode({ name: 'restaurant_select_column' })
  },
  get restaurant_taxonomy() {
    return new ObjectNode(
      {
        get restaurant() {
          return new FieldNode(schema.restaurant, undefined, false)
        },
        get restaurant_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get taxonomy() {
          return new FieldNode(schema.taxonomy, undefined, false)
        },
        get taxonomy_id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
      },
      {
        name: 'restaurant_taxonomy',
        extension: ((extensions as any) || {}).restaurant_taxonomy,
      }
    )
  },
  get restaurant_taxonomy_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_taxonomy_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.restaurant_taxonomy_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.restaurant_taxonomy_bool_exp, true),
            true
          )
        },
        get restaurant() {
          return new InputNodeField(schema.restaurant_bool_exp, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get taxonomy() {
          return new InputNodeField(schema.taxonomy_bool_exp, true)
        },
        get taxonomy_id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
      },
      { name: 'restaurant_taxonomy_bool_exp' }
    )
  },
  get restaurant_taxonomy_order_by() {
    return new InputNode(
      {
        get restaurant() {
          return new InputNodeField(schema.restaurant_order_by, true)
        },
        get restaurant_id() {
          return new InputNodeField(schema.order_by, true)
        },
        get taxonomy() {
          return new InputNodeField(schema.taxonomy_order_by, true)
        },
        get taxonomy_id() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'restaurant_taxonomy_order_by' }
    )
  },
  get restaurant_taxonomy_select_column() {
    return new EnumNode({ name: 'restaurant_taxonomy_select_column' })
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
  get review_select_column() {
    return new EnumNode({ name: 'review_select_column' })
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
        get restaurant_taxonomy() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_taxonomy, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_taxonomy_select_column, true),
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
                  new ArrayNode(schema.restaurant_taxonomy_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.restaurant_taxonomy_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get restaurant_taxonomy_by_pk() {
          return new FieldNode(
            schema.restaurant_taxonomy,
            new Arguments(
              {
                get restaurant_id() {
                  return new ArgumentsField(schema.uuid, false)
                },
                get taxonomy_id() {
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
        get taxonomy() {
          return new FieldNode(
            new ArrayNode(schema.taxonomy, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.taxonomy_select_column, true),
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
                  new ArrayNode(schema.taxonomy_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(schema.taxonomy_bool_exp, true)
              },
            }),
            false
          )
        },
        get taxonomy_by_pk() {
          return new FieldNode(
            schema.taxonomy,
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
        get top_dishes() {
          return new FieldNode(
            new ArrayNode(schema.top_dishes_results, false),
            new Arguments({
              get args() {
                return new ArgumentsField(schema.top_dishes_args, false)
              },
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.top_dishes_results_select_column, true),
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
                  new ArrayNode(schema.top_dishes_results_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.top_dishes_results_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get top_dishes_results() {
          return new FieldNode(
            new ArrayNode(schema.top_dishes_results, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.top_dishes_results_select_column, true),
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
                  new ArrayNode(schema.top_dishes_results_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.top_dishes_results_bool_exp,
                  true
                )
              },
            }),
            false
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
  get taxonomy() {
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
        get created_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
        get icon() {
          return new FieldNode(schema.String, undefined, true)
        },
        get id() {
          return new FieldNode(schema.uuid, undefined, false)
        },
        get name() {
          return new FieldNode(schema.String, undefined, false)
        },
        get order() {
          return new FieldNode(schema.Int, undefined, false)
        },
        get parentId() {
          return new FieldNode(schema.uuid, undefined, true)
        },
        get parentType() {
          return new FieldNode(schema.String, undefined, true)
        },
        get restaurant_taxonomies() {
          return new FieldNode(
            new ArrayNode(schema.restaurant_taxonomy, false),
            new Arguments({
              get distinct_on() {
                return new ArgumentsField(
                  new ArrayNode(schema.restaurant_taxonomy_select_column, true),
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
                  new ArrayNode(schema.restaurant_taxonomy_order_by, true),
                  true
                )
              },
              get where() {
                return new ArgumentsField(
                  schema.restaurant_taxonomy_bool_exp,
                  true
                )
              },
            }),
            false
          )
        },
        get type() {
          return new FieldNode(schema.String, undefined, true)
        },
        get updated_at() {
          return new FieldNode(schema.timestamptz, undefined, false)
        },
      },
      { name: 'taxonomy', extension: ((extensions as any) || {}).taxonomy }
    )
  },
  get taxonomy_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.taxonomy_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.taxonomy_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.taxonomy_bool_exp, true),
            true
          )
        },
        get alternates() {
          return new InputNodeField(schema.jsonb_comparison_exp, true)
        },
        get created_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
        get icon() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get id() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get name() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get order() {
          return new InputNodeField(schema.Int_comparison_exp, true)
        },
        get parentId() {
          return new InputNodeField(schema.uuid_comparison_exp, true)
        },
        get parentType() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get restaurant_taxonomies() {
          return new InputNodeField(schema.restaurant_taxonomy_bool_exp, true)
        },
        get type() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get updated_at() {
          return new InputNodeField(schema.timestamptz_comparison_exp, true)
        },
      },
      { name: 'taxonomy_bool_exp' }
    )
  },
  get taxonomy_order_by() {
    return new InputNode(
      {
        get alternates() {
          return new InputNodeField(schema.order_by, true)
        },
        get created_at() {
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
        get parentType() {
          return new InputNodeField(schema.order_by, true)
        },
        get type() {
          return new InputNodeField(schema.order_by, true)
        },
        get updated_at() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'taxonomy_order_by' }
    )
  },
  get taxonomy_select_column() {
    return new EnumNode({ name: 'taxonomy_select_column' })
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
  get top_dishes_args() {
    return new InputNode(
      {
        get lat() {
          return new InputNodeField(schema.numeric, true)
        },
        get lon() {
          return new InputNodeField(schema.numeric, true)
        },
        get radius() {
          return new InputNodeField(schema.numeric, true)
        },
      },
      { name: 'top_dishes_args' }
    )
  },
  get top_dishes_results() {
    return new ObjectNode(
      {
        get dish() {
          return new FieldNode(schema.String, undefined, true)
        },
        get frequency() {
          return new FieldNode(schema.bigint, undefined, true)
        },
      },
      {
        name: 'top_dishes_results',
        extension: ((extensions as any) || {}).top_dishes_results,
      }
    )
  },
  get top_dishes_results_bool_exp() {
    return new InputNode(
      {
        get _and() {
          return new InputNodeField(
            new ArrayNode(schema.top_dishes_results_bool_exp, true),
            true
          )
        },
        get _not() {
          return new InputNodeField(schema.top_dishes_results_bool_exp, true)
        },
        get _or() {
          return new InputNodeField(
            new ArrayNode(schema.top_dishes_results_bool_exp, true),
            true
          )
        },
        get dish() {
          return new InputNodeField(schema.String_comparison_exp, true)
        },
        get frequency() {
          return new InputNodeField(schema.bigint_comparison_exp, true)
        },
      },
      { name: 'top_dishes_results_bool_exp' }
    )
  },
  get top_dishes_results_order_by() {
    return new InputNode(
      {
        get dish() {
          return new InputNodeField(schema.order_by, true)
        },
        get frequency() {
          return new InputNodeField(schema.order_by, true)
        },
      },
      { name: 'top_dishes_results_order_by' }
    )
  },
  get top_dishes_results_select_column() {
    return new EnumNode({ name: 'top_dishes_results_select_column' })
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
  get user_order_by() {
    return new InputNode(
      {
        get created_at() {
          return new InputNodeField(schema.order_by, true)
        },
        get id() {
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
      { name: 'user_order_by' }
    )
  },
  get user_select_column() {
    return new EnumNode({ name: 'user_select_column' })
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
