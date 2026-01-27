---
slug: interactive-terminal
title: "Interactive terminal user input"
description: "How to make cli user input interactive"
date: 2026-01-31
author: "Kevin Traini"
tags: ["terminal", "cli"]
---

Have you ever wondered how `pnpm`, `cargo`, `composer`, ... do to present you beautiful interactive inputs when you're
still stuck to classic user ugly input. Well I wondered too.

Long story short, 3 years ago, as I was making a cli in C++, I was looking for library equivalent
to [enquirer](https://github.com/enquirer/enquirer) which is for JavaScript. Unable to find any, I made
my [own version](https://github.com/Gashmob/Enquirer) for C++. And with that I discovered many things.

In the next chapters of this article we'll see several way to enhance your outputs and inputs. The demonstration code
will be in bash, so note that it is thus possible in almost every language.

## [Colors](#colors)

Ahh colors, bored with white text on black screen. Let's introduce some colors:

| Color   | Text | Background |
| :------ | :--- | :--------- |
| Black   | 30   | 40         |
| Red     | 31   | 41         |
| Green   | 32   | 42         |
| Yellow  | 33   | 43         |
| Blue    | 34   | 44         |
| Magenta | 35   | 45         |
| Cyan    | 36   | 46         |
| White   | 37   | 47         |

| Effect    | Apply | Revert |
| :-------- | :---- | :----- |
| Reset     | 0     |        |
| Bold      | 1     | 21     |
| Underline | 4     | 24     |
| Blink     | 5     | 25     |
| Inversed  | 7     | 27     |

But what is all that? Well each of these codes can be used to transform the following text. To use it, simply use the
corresponding code in this snippet:

```shell
'\033[E;T;Bm' # Effect ; Text ; Background
```

For example, to print "Hello World!" underlined in <span class="text-red-500">red</span> with
a <span class="text-cyan-500">cyan</span> background, just do:

```shell
echo '\033[1;31;46mHello World!'
```

You can even apply multiple effects, but not multiple colors, it will have no change:

```shell
echo '\033[1;4;32mAmazing!'
```

When you want to come back to default text, you can use the reset code `\033[0m`:

```shell
echo '\033[32mgreen \033[0mdefault'
```

Please note that the blink effect may not work depending on the terminal emulator capacity.

## [Manipulate the cursor](#manipulate-the-cursor)

The `\033[` string is magic in a terminal, with it, you can do many things.

### [Moving](#moving)

The cursor can be moved in the 4 directions by a specific amount. The directions are noted with a letter, `A` for up,
`B` for down, `C` for right and `D` for left.

For example to move the cursor to the left

```shell
echo 'This sentence is short\033[5Dlong...'
# Should print "This sentence is long..."
```

You can notice that the word "short" is completely erased. In fact when you move the cursor anywhere and then write, it
does not move the surrounding content, but juste write over it. So think carefully when you do this, it can lead to
strange display. For example

```shell
echo 'This sentence is short\033[8Dlong'
# Should print "This sentence longhort"
```

### [Clear line](#clear-line)

To erase the line, there is the fastidious way: moving the cursor all the way to the left and then print spaces all the
way to the right. But it needs to know the width of the terminal, else you'll go next line.

Otherwise, you can do `\033[2K`. The suffix `K` is for line clearing, there is then 3 modes (0, 1 and 2). 0 erase the
line from the cursor to the end of the line, 1 from the cursor to the start of the line and 2 the full line.

For example, you can erase the beginning of a sentence this way:

```shell
echo 'Hello World!\033[7D\033[1K'
# Will print "      World!"
```

Note that at the end, the cursor is placed on the space just before "World".

### [Hide cursor](#hide-cursor)

When doing long operation, you may want to display some loading text, but if the blinking cursor is displayed along, it
is not pretty. To fix that you can hide the cursor during the needing time and show it again after. Well, there is 2
special code just for that. `\033[?25l` will hide the cursor while `\033[?25h` will show it again.

You can try with this script bellow. If you uncomment line 3, the cursor will be hidden during the 10 seconds process.

```shell
#!/usr/bin/env bash
i=0;
# echo -ne '\033[?25l'
while [ $i -le 10 ]
do
    sleep 0.25
    echo -n '.'
    sleep 0.25
    echo -n '.'
    sleep 0.25
    echo -n '.'
    sleep 0.25
    echo -ne '\033[3D\033[2K'
    ((i++))
done
echo -ne '\033[?25h'
```

## [Raw mode](#raw-mode)

With the previous script, if you try to type something during the loop, it breaks the display. To avoid this, we should
disallow user to type anything or at least not display what the user. In bash, you can use `stty` utility to change
settings of the terminal. To disable echoing of input characters we just need to call `stty -echo`. And to enable it
again it is `stty echo`.

Applied to our previous script, it makes:

```shell
#!/usr/bin/env bash
stty -echo
i=0;
echo -ne '\033[?25l'
while [ $i -le 10 ]
do
    sleep 0.25
    echo -n '.'
    sleep 0.25
    echo -n '.'
    sleep 0.25
    echo -n '.'
    sleep 0.25
    echo -ne '\033[3D\033[2K'
    ((i++))
done
echo -ne '\033[?25h'
stty echo
```

You can try to type anything, it will not be displayed. But be careful, it is in reality stored in the stdin descriptor
and will be read by your terminal after the process exit (so don't type dangerous command).

In C/C++, you can do the equivalent with `<termios.h>` library. I let you read the associated documentation and the
equivalents in others languages.

## [Go further](#go-further)

With all described above, you should already be able to make the majority of cli. But there is another full world of
terminal programs called TUI: terminal user interface. [vim](https://www.vim.org/) is one of them, but I can also
cite [htop](https://htop.dev/).

If you want to develop a complete terminal user interface, you can take a look
at [ncurses](https://invisible-island.net/ncurses.), htop uses this library.

---

And this concludes this post. I hope you enjoyed reading it and learned something.
