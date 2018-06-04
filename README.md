# Wine Manager

a rest-api to manage your wine vault

## Setup
A setup file with fixtures is available:
Run the following command after deployment
```console
NODE_ENV=development; node src/setup.js
```

## API Documentation

### GET /wines/

Lists all wines stored in the db.

#### Query Params

Optional filtering parameters:

- year
- name
- country
- type

#### Response - Success 200:

Example:
```json
[
    {
        "id": 0,
        "name": "Cabernet sauvignon",
        "year": 2013,
        "country": "France",
        "type": "red",
        "description": "The Sean Connery of red wines"
    },
    {
        "id": 1,
        "name": "Pinot noir",
        "year": 2011,
        "country": "France",
        "type": "red",
        "description": "Sensual and understated"
    },
    {
        "id": 2,
        "name": "Zinfandel",
        "year": 1990,
        "country": "Croatia",
        "type": "red",
        "description": "Thick and jammy (test)"
    }
]
```

#### Example curl
```bash
curl -i -X GET https://wine-manager.herokuapp.com/wines/  \
  -H 'Content-Type: application/json'
```

### POST /wines/

Store a new wines entity in the db.

#### Body Parameter (JSON)

| name | type | mandatory | valid |
| --- | --- | --- | --- |
|**name** | `String` | (Required) | |
|**year** | `Number{4}` | (Required)  | (0 - current) |
|**country** | `String` | (Required) | |
|**type** | `String` | (Required) | `[red|rose|white]` |
|**description** |  `String` | (Optional) | |

Example:

```json
{
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated"
}
```

#### Response - Success 200:

Example:
```json
{
    "id": 0,
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated"
}
```

#### Response - Error 4xx:

- **400** - **VALIDATION_ERROR**
One or more body params were invalid.
With `validation` containing a list of params that are `MISSING` or `INVALID`.

Example:
```json
{
    "error": "VALIDATION_ERROR",
    "validation": {
        "name": "MISSING",
        "year": "MISSING",
        "country": "MISSING",
        "type": "INVALID"
    }
}
```

#### Example curl
```bash
curl -i -X POST \
  https://wine-manager.herokuapp.com/wines/ \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated"
}'
```

### PUT /wines/:id

Update an existing wine entity by id.

#### URL Parameter

| name | type |
| --- | --- |
| **id** | Number |

#### Body Parameter (JSON)

| name | type | mandatory | valid |
| --- | --- | --- | --- |
|**name** | `String` | (Required) | |
|**year** | `Number{4}` | (Required)  | (0 - current) |
|**country** | `String` | (Required) | |
|**type** | `String` | (Required) | `[red|rose|white]` |
|**description** |  `String` | (Optional) | |

Example:

```json
{
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated (Strawberry, raspberry, cherry)"
}
```

#### Response - Success 200:

Example:
```json
{
    "id": 0,
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated"
}
```

#### Response - Error 4xx:

- **400** - **VALIDATION_ERROR**
One or more body params were invalid.
With `validation` containing a list of params that are `MISSING` or `INVALID`.
- **404** - **UNKNOWN_OBJECT**
The entity with the given id was not found.

Example:
```json
{
    "error": "VALIDATION_ERROR",
    "validation": {
        "name": "MISSING",
        "year": "MISSING",
        "country": "MISSING",
        "type": "INVALID"
    }
}
```

#### Example curl
```bash
curl -i -X PUT \
  https://wine-manager.herokuapp.com/wines/0 \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated"
}'
```

### GET /wines/:id

Get an existing wine entity by id.

#### URL Parameter

| name | type |
| --- | --- |
| **id** | Number |

#### Response - Success 200:

Example:
```json
{
    "id": 0,
    "name": "Pinot noir",
    "year": 2011,
    "country": "France",
    "type": "red",
    "description": "Sensual and understated"
}
```

#### Response - Error 4xx:

- **404** - **UNKNOWN_OBJECT**
The entity with the given id was not found.

Example:
```json
{
    "error": "UNKNOWN_OBJECT"
}
```

#### Example curl
```bash
curl -i -X GET \
  https://wine-manager.herokuapp.com/wines/0 \
  -H 'Content-Type: application/json'
```

### DELETE /wines/:id

Deletes an existing wine entity by id.

#### URL Parameter

| name | type |
| --- | --- |
| **id** | Number |

#### Response - Success 200:

Example:
```json
{
    "success": true
}
```

#### Response - Error 4xx:

- **404** - **UNKNOWN_OBJECT**
The entity with the given id was not found.

Example:
```json
{
    "error": "UNKNOWN_OBJECT"
}
```

#### Example curl
```bash
curl -i -X DELETE \
  https://wine-manager.herokuapp.com/wines/0 \
  -H 'Content-Type: application/json'
```