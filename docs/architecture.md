# Architecture

On the surface, forms seem rather straightforward to implement. The user
just has to fill an input and the data is submitted to a server or a store
in a single page application. In other words, we have to mutate data somewhere.
Mutations often involve side-effects (sending a request to a server) and in
complex forms, fields usually have complex dependencies between each other. Oh
and they are usually dynamic, too!

To counterbalance this complexity, `mobx-form-reactions` follows a few key
architectural structures.

## Template-based forms vs reactive/model-based forms

When researching forms you'll realize soon, that there are two approaches to
building forms. There is the template-based way and the reactive way. Template-
based means that the form is defined inside templates. This is the most popular
way since the dawn of html.

The HTML5 spec improves on this concept by giving us a nice Validation API with
the option to write custom validators and shorthand attributes like `pattern`
in case the validation can be done with a simple regex. This works great for
forms where each field can validate itself and has no dependencies to another
one. And let's be real, that includes about 90% of forms one can find on the
web.

```html
<input type="text" name="username" placeholder="Username" pattern="[a-z]{1,15}">
```

When building complex and dynamic you'll quickly run into the limits of a
template-based approach, though. We gain a lot by seperating the validation
logic from our template, in particular easier unit testing and the ability to
build dependencies for validations between input fields.

## Why validators return objects

The first version of this library specified that `Validators` directly return
an array of error messages. They had this type signature:

```ts
type Validator = (value: any) => string[] | Promise<string[]>;
```

This works great for most validations, but leads to duplicated code in the
many situations. Let's say we have to input fields in our form that is
part of the ordering process of a shop. There is one input for the item amount
and another one where the user can specify the amount he wants to pay. Both
fields have a minimum value. The user must buy 2 items and at least pay 10€.
In code that would look something like this:

```ts
import { min } from "mobx-form-reactions";

// validate amount
const amount = min(2);
console.log(amount(1)); // Logs errors: { min: true }

// validate price
const price = min(10);
console.log(price(5)); // Logs errors: { min: true }
```

As you can see we can easily reuse the same validation function for different
fields. The caveat is that we do want to dispay different error messages to our
user. For the amount field we want do display something like `You need to order
at least 2 items` and for the price field something similar to `Price must be
at least 10€`. If we had specified the error message inside our validation
function we would have to either duplicate it or pass a message argument around.

But in our component we only need to know which validation failed. We'll only care
about the specific error message once we have to display something to our user and
that can better be handled inside the ui component.

Unfortunately we cannot use the function name as an identifier, because the name
will be mangled upon minification. We could also return a string, but for validations
that take longer to process (like async network requests), you'll usually want to
run multiple validations on the async response.

Thus a much better type signature for `Validators` is:

```ts
export type ValidationError = { [error: string]: any } | null;
export type Validator<T> = (value: T) => ValidationError | Promise<ValidationError>;
```

We do return `null` on success, because `null` is cheaper to construct compared
to an `Object`.

And a custom `Validator`:

```ts
const foo = value => value === "foo" ? null : { foo: true };
```

This design choice is heavily inspired by Angular 2's awesome `reactive-forms`
module.
