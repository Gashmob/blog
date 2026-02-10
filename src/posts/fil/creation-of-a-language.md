---
slug: creation-of-a-language
title: "Creation of a language"
description: "Let's create a programming language from scratch. First chapter of a long story about writing a compiler.
For now we'll define the features of the language and its grammar as well as the tool to use it. In short the acceptance
criteria for the whole project"
date: 2026-02-15
author: "Kevin Traini"
tags: [ "fil" ]
story: "fil"
---

> The simplest way to create a world is to begin.

Since my studies I always wanted to create my own language and I started many years ago. I made many errors as well on
the method than the software architecture, shortly all the errors you can make as a junior developer. Today I still
consider myself as a junior, but I already acquired some experience I want to use. One good point, is that by making all
those errors I learned many things (and should not repeat them theoretically).

For those who know me, you should remember that it is not the first time I start again this project with the goal of
finishing it by using my latest knowledge. For those who don't know me, it is the third time 😅.

I take inspiration from C++, Rust and Haskell.

Well, let's begin with the name: fil. It means thread in French, and you will understand why later.

Also, a link that may interest you: https://github.com/gashmob/fil. This is the repository in which all the development
will take place. I created a GitHub project to easily track the advancement and discussions are enabled if you have any
questions.

## [The language features](#the-language-features)

In terms of paradigm, this language is a [functional](https://en.wikipedia.org/wiki/Functional_programming) language.
Everything is an expression, everything returns a value even function declaration. Unlike some hard functional
languages, you can write sequence of expression in your functions and simply discard their result, only the last
expression result will be used.

Let start gentle with an abstract, we'll see details later.

Like almost every language, you can define variables and constants. There is also function and anonymous functions
(lambda). You can write while, indexed and iterator loop. There is also condition branching from simple true/false
branching to pattern matching.

The type system is strict, you cannot natively assign a float to an integer. There is scalar types like integer,
floating point, boolean and character but also data types. Those last are complex type with a structure of
different type organized by keys. They can have a specific behavior by implementing traits.

### [Value storage](#value-storage)

A.k.a. variables and constants. Variables have a single type which cannot be changed but the stored value can change. On
the other hand constants have also a single type which cannot be changed and the stored value too cannot be changed.
When you assign a constant it is forever.

```fil
// Variables are declared with the keyword var
var foo = 42;
// Constants are declared with the keyword val
val bar = 'c';
```

Both can store any kind of value, from scalar type to data type and functions or even data type declaration. When you
store a function or a data type it is equivalent to making an alias.

When declaring a constant it is not mandatory to precise its type, it can be inferred from its assignation (the
assignation is mandatory). For variables, it is only if assignation is not in the same scope of declaration.

### [Types](#types)

Types are separated in 2 categories: scalar types and data types. There is also function types, but we'll see that in
function section, and it can be considered as a data type.

Scalar types are easy simple types:

- integers stored on 8/16/32/64/128 bit. The default size for the integer depends on the system architecture. Can be
  signed or unsigned
- floating point numbers stored on 32 or 64 bits, signed or not.
- booleans that can be either true or false.
- characters, in fact just a one byte unsigned integer but still a different type in its usage

```fil
val number_1: i8 = 1;
val number_2: i16 = 2;
val number_3: i32 = 3;
val number_4: i64 = 4;
val number_5: i128 = 5;
val number_6: int = 6; // Architecture based size

val unsigned_number_1: ui8 = 1;
val unsigned_number_2: ui16 = 2;
val unsigned_number_3: ui32 = 3;
val unsigned_number_4: ui64 = 4;
val unsigned_number_5: ui128 = 5;
val unsigned_number_6: uint = 6; // Architecture based size

val float_1: f32 = 3.14;
val float_2: f64 = 6.022;
val float_3: float = 9.81; // Architecture based size

val boolean: bool = true;

val character: char = 'c';
```

There is also some complex types:

- arrays with a fixed size indexed from 0 and a single type. Like in C, the size is not stored within, it is up to you
  to know if you are out of bounds or not. The compiler will try to catch most of the errors but some may be missed.
- tuples that are an association of different value of different type. Cannot be empty.
- pointers to store address of values.
- references acts like a pointer but without the need of dereferencing.

```fil
// Can be seen as int* too
val some_array: int[] = [0, 1, 2];
some_array[1]; // 1
val some_tuple: (int, bool) = (3, false);
some_tuple[0]; // 3

val foo: int = 3;
val pointer: int* = &foo; // Access the value with *pointer
// for data types it is pointer->value (or (*pointer).value)
val reference: int& = foo;
```

Finally, there is a type useful only for functions returning nothing: `void`. It cannot be used anywhere else, you
cannot store it in a variable.

#### [Data types](#data-types)

Data types are a way of organizing multiple types into a single one. You can even have a data type with data types in
it. You can then access to the stored values by their name. You can store variables but also constants, your whole data
type can be a constant. The stored value can also be private, it is useful in case of trait implementation.

```fil
data Complex {
    val real: int;
    val imaginary: int;
}

val number = Complex(2, 3);
```

Traits are like interfaces in object-oriented languages, they are a collection of function type as a behavior and your
data type can implement them. This way, several data types can share same behavior.

```fil
use fil.string

trait Stringifiable {
    fun toString(): string;
}

data Complex: Stringifiable {
    val real: int;
    val imaginary: int;

    fun toString(): string = sprintf("%d + %di", real, imaginary);
}

val foo = Complex(2, 3);
val bar = foo.toString(); // "2 + 3i"
```

A data type can have its own functions without the need of a trait.

```fil
data Complex {
    val real: int;
    val imaginary: int;

    fun toTuple(): (int, int) = (real, imaginary);

    static fun build(): Complex = Complex(0, 0)
}

Complex.build().toTuple(); // result is (0, 0)
```

To avoid duplication of data types sharing same structure and behavior, you can use generic types. Those are like
arguments of the data type. They are resolved into real types at compile time along what it is needed.

```fil
data Store<N> {
    val value: N;
}

val foo = Store<char>('c'); // foo.value is a char
```

### [Operators](#operators)

#### [Arithmetic operations](#arithmetic-operations)

You can add, subtract, multiply, divide and get <abbr title="division reminder">modulo</abbr> with any number type (
integers and floating point). The type of the result will correspond to the bigger type of the operation, it is to avoid
any data loss.

For each of these operations there is an equivalent with direct assignation, except for modulo.

You can also use increment and decrement as a shorthand for addition/subtraction to 1.

```fil
var a = 1 + 2;
a += 3;
a++;
++a;
var b = 1 - 2;
b -= 3;
b--;
--b;
var c = 1 * 2;
c *= 3;
var d = 1.0 / 2.0;
d /= 3.0;
var e = 4 % 3;
```

#### [Comparisons](#comparisons)

There is 2 types of comparison: 2-way and 3-way.

2-way comparison is equality/inequality and all variants of lesser than and greater than. It always returns a boolean.

```fil
1 == 1;
1 != 2;
1 < 2;
1 <= 1;
2 > 1;
2 >= 2;
```

3-way comparison is relative ordering, it checks if left operand is less, equal or greater than right operand by
returning strictly negative, null or strictly positive integer respectively.

```fil
1 <=> 2; // returns < 0
1 <=> 1; // returns 0
2 <=> 1; // returns > 0
```

#### [Boolean logic](#boolean-logic)

There is only two boolean value: true and false. With them, you can do 3 operations: logical OR, logical AND and logical
NOT.

```fil
true || false;
true && true;
!false;
```

#### [Bitwise operations](#bitwise-operations)

Only with integer types, you can manipulate bits directly through 4 operations: bitwise AND, bitwise OR, bitwise XOR and
bitwise NOT ([ones' complement](https://en.wikipedia.org/wiki/Ones'_complement)).

```fil
4 & 6; // AND
4 | 6; // OR
4 ^ 6; // XOR
~4; // NOT
```

#### [Operator override](#operator-override)

All previously described operators can be overridden to implement new behavior with other types (with data types for
examples).

```fil
fun operator+(a: Complex, b: Complex): Complex =
    Complex(a.real + b.real, a.imaginary + b.imaginary);
```

### [Functions](#functions)

There is two kind of function: named and anonymous (aka lambda). Function declaration is also an expression, thus you
can assign it to a variable or a constant. It means your function can return another one or take one as
parameter ([first-class functions](https://en.wikipedia.org/wiki/First-class_function)). So there is a special type for
functions.

```fil
// Anonymous function assigned to a constant.
val sum: (int, int): int = (a: int, b: int): int (a + b);
sum(2, 3);

// It is equivalent to
fun sum(a: int, b: int): int = a + b

// There is 2 forms of body
fun equal(): string = "Hello" // The function body is one expression
// The function body is one or multiple expression.
// The last one is the used for the return
// Expressions are separated by ;
fun braces(): int {
    val a = 1;
    val b = 2;
    a + b
}

// If your function returns nothing, it has the type void
fun doSomething(): void {
    print("Hello");
    // The last expression has a ;
    // thus the function does not return any expression (void)
}
```

### [Conditions](#conditions)

Conditional branching can be done two ways: boolean condition and pattern matching.

This first one is the old classic `if else`. In the case you use the resulting expression of it, you must specify an
else branch. It's the same as with the ternary operator.

```fil
val result_1 = if (condition) "foo" else "bar";
val result_1 = condition ? "foo" : "bar";

// You can chain branches
if (condition_1) "foo"
else if (condition_2) "bar"
else if (condition_3) "acme"
```

The second one is an enhanced switch. With it, you not only check the value of the parameter but its pattern. This is
useful when manipulating data types or tuples (it does not work with arrays). You should always have a default case, if
there is no branch for the pattern the program will [panic](#errors).

```fil
// Works on scalar types
match (value) {
    0 -> "This is 0",
    1 -> "Or 1",
    _ -> "Default case"
}

// and on data types too
match (complex) {
    Complex(0, 0) -> "This is 0 + 0i",
    Complex(1, _) -> "The real part is 1",
    Complex(_, 2) -> "The imaginary part is 2",
    _ -> "This is another complex",
    // The default case can be also be done with Complex(_, _)
}
```

### [Loops](#loops)

To continue on branching, now it is loops. There are three kind of loop, the plain old while loop, the indexed loop and
the iterative one.

While loop takes only one argument, a boolean expression (the condition) and execute its body while the condition is
true.

```fil
var counter = 0;
while (counter < 10) {
    counter++;
}
```

The indexed loop takes 3 optional expression: initial state, condition and iteration. It can be seen as
a [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) of while loop. If you give not the second operation
(the condition), it results in an infinite loop. You can then use the `break` keyword to force stop the loop. `skip` is
used to skip the current iteration.

```fil
for (var counter = 0; counter < 10; counter++) {
    if (condition) skip;
    else break;
}
```

The iterative loop is useful when you have an array to iterate over its values. It is syntactic sugar too.

```fil
val array = [1, 2, 3];
for (val value in array) {
    // ...
}

for (val key => val value in array) {
    // ...
}
```

You can also use loops as an array generator

```fil
// This array will be [0, 1, 2, 3, 4]
val array = for (var i = 0; i < 5; i++) i;
```

### [Comments](#comments)

You can write single line or multi line comments.

```fil
// One line comment

/* Multi line comment
 * The * for this line is optional
 */
```

When a multi line comment starts with `/**` on the line just before an expression then the comment will be used as
documentation. For compilation, it does not change anything.

### [Modules](#modules)

When splitting your code into multiple files, each source file is considered as a module. In
the [package configuration](#tools) file you can define the root module name, then each file in `src` directory will be
a submodule of it. For example, if your root module name is `com.acme`, file `src/foo.fil` will be named `com.acme.foo`.
There is an exception for file `main.fil` which act as an index file and results thus to module name `com.acme`.

You can then import other modules and publish some expression.

```fil
use fil.io // Import a whole module
use string from fil.string // Import part of a module

pub val PI = 3.1415

pub fun add(a: int, b: int): int = a + b
```

In case multiple modules expose same name, you can differentiate usages by using the full name, `fil.string.string` for
example.

### [Errors](#errors)

There is no exception system, there is only errors that can be handled or not. If they cannot be handled, the program
exit directly. If they can be handled, then the calling code must handle it. This system is equivalent to the one in
rust. If a function may fail, then its signature is adapted in consequence.

```fil
use fil.result

// You can either choose to handle the error
fun divide(a: int, b: int): Result<int, Fault> {
    if (b == 0) err(Fault.fromMessage("You cannot divide by 0"))
    else ok(a / b)
}

divide(4, 2).match(
    (result) => printf("4 / 2 = %d", result),
    (fault) => printf("Oh no! %s", fault)
);

// Or not handle it at all
fun divide2(a: int, b: int): int {
    if (b == 0) panic("You cannot divide by 0")
    else a / b
}
```

The same way, null value does not exist. In other languages it is used when your variable has no value. Here I prefer
using a strict type telling my function may return no value.

```fil
use fil.option

// Let's imagining a function which search a user in a database
// It may not find the user, in this case it returns nothing
// If it find the user, then it returns some value
fun findUser(id: int): Option<User> {
    if (user_find) some(user)
    else nothing()
}
```

### [Standard library](#standard-library)

In all previous code snippet you may have noticed imports from a module named `fil`. This is the standard library. I'll
not define its content here, it is way too early for that. At this moment I just know the topic I want to include at
least in it: string, Result, Option, math, container, fs.

## [Tools](#tools)

The main tool will obviously be the compiler. I plan to make it a complete tool for project lifecycle: init of the
project, configuration, dependencies, testing, building, project documentation, ... I don't want to have one tool per
job, but a unified one.

As I want to use this language for some side projects, I also plan to write plugins for some IDE, at least VS Code and
JetBrains. Probably there will be a plugin for Shiki, this way this article will have syntax highlight. And a GitHub
action.

---

As a reminder, you can retrieve the repository here: https://github.com/gashmob/fil. With it, you can track the
development. I'll try to write posts here at each step or when there is something to say.
