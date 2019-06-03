menu_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "required": ["pizza_id", "name", "price_small", "price_big", "ingredients", "pizza_img"],
        "properties": {
            "pizza_id": {"type":"integer"},
            "name": {"type":"string"},
            "price_small": {"type": "number"},
            "price_big": {"type": "number"},
            "ingredients": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "pizza_img": {"type": "string"}
        }
    }
}

new_order_schema_w_id = {
    "type": "object",
    "required": ["order_id", "state", "orders"],
    "properties": {
        "order_id": {"type": "string"},
        "state": {"type": "string"},
        "orders": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["pizza", "size"],
                "properties": {
                    "pizza": {"type":"string"},
                    "size": {"type":"string"}
                }
            }
        },
        "address": {
            "type": "object",
            "required": ["city", "street", "building", "flat"],
            "properties": {
                "city": {"type": "string"},
                "street": {"type": "string"},
                "building": {"type": "string"},
                "flat": {"type": "string"}
            }
        }
    }
}

new_order_schema_wo_id = {
    "type": "object",
    "required": ["orders"],
    "properties": {
        "state": {"type": "string"},
        "orders": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["pizza", "size"],
                "properties": {
                    "pizza": {"type": "string"},
                    "size": {"type": "string"}
                }
            }
        },
        "address": {
            "type": "object",
            "required": ["city"],
            "properties": {
                "city": {"type": "string"},
                "street": {"type": "string"},
                "building": {"type": "string"},
                "flat": {"type": "string"}
            }
        }
    }
}

update_menu_schema = {
    "type": "object",
    "required": ["pizza_id", "name", "price_small", "price_big", "ingredients", "pizza_img"],
    "properties": {
        "pizza_id": {"type": "integer"},
        "name": {"type": "string"},
        "price_small": {"type": "number"},
        "price_big": {"type": "number"},
        "ingredients": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "pizza_img": {"type": "string"}
    }
}

test_schema = {
    "type": "object",
    "required": ["test_msg"],
    "properties": {
        "test_msg": {"type": "string"}
    }
}

update_order_schema = {
    "type": "object",
    "required": ["order_id", "state"],
    "properties": {
        "order_id": {"type": "integer"},
        "state": {"type": "string"}
    }
}

get_state_schema = {
    "type": "object",
    "required": ["order_id"],
    "properties": {
        "order_id": {"type": "integer"}
    }
}

# new_menu = {
#   "id": "asd",
#   "orders": [{
#     "pizza": "a",
#     "size": "a"
#   }],
#   "address": {
#     "city": "a",
#     "street": "a",
#     "building": "a",
#     "flat": "a"
#   }
# }

# # # new_menu_json = dumps(new_menu)
# try:
#     jsonschema.validate(instance=new_menu, schema=new_order_schema)
# except jsonschema.ValidationError as ex:
#     print("JSON Validation Error, bad data. Entry not added do DB")
