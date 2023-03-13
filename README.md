# biking-log

## Route handlers

Route handlers are new to next.js version 13.2. 

They reside in the new appDir, but don't necessarily have to be exclusive to the /app/api folder, though I have reasons why I think that is preferable... eg: they won't conflict with pages because a route could have a page and route associated with it.

They make constructing api routes easier than was the case prior to their adoption.

### Using route handlers

Route handlers must be used in the /app folder and must have the file name of **route.ts** (or .js if you're not using typescript).

The basic structure of a route handler is to export an async function with the name of the http method it is to be used for.

```ts
export async function GET(request: Request) { }

export async function HEAD(request: Request) { }

export async function POST(request: Request) { }

export async function PUT(request: Request) { }

export async function DELETE(request: Request) { }

export async function PATCH(request: Request) { }

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) { }
```

This is a benefit because in the past you would have to check that any requests to a route were of the right type.

```ts
// only allow PUT requests on this route
if (req.method !== 'PUT') return res.status(401).end();
```

You can access the dynamic route parameters and the query string parameters as follows.

The folder/file structure: **/app/api/users/[id]/route.js**,

...would handle a url of: http://localhost:3000/api/users/1234?status=active

...this way:

```ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }) {
    const id = params.id;
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    return NextResponse.json({ msg: 'Hello user ' + id + '! Status is: ' + status + '.' });
}

// would return { msg: 'Hello user 1234! Status is: active' }
```

---
