---
title: Hello World!
author: Joshua Bemenderfer
date: 2015-5-28
tags:
    - iceblerg
    - Testing
    - Markdown
    - Development
---
Hello! Welcome to the initial field test of [iceblerg](https://github.com/Tribex/iceblerg), a no-frills static blog generator with an emphasis on easy integration.

So far the basic jade templates have been made and it seems to be integrating well with this site.
The remainder of this post will be testing Markdown features, for which I will by adding custom styles in the future.
==[END PREVIEW]==

**Bold**

*Italic*

Automatic Linking:
http://tribex.github.io

Implicit Linking:
[Link](http://tribex.github.io)

Image:

![Iceblerg Logo](https://raw.githubusercontent.com/Tribex/iceblerg/master/assets/iceblerg-full.png)

# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

Blockquote:

> I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.
<cite>Galatians 2:20 (KJV)</cite>

Code:

Inline: `var pie = { slices: [slice1, slice2, slice3, slice4, slice5, slice6, slice7, slice8] };`

Block:

```
for (var sliceIndex = 0; sliceIndex < pie.slices.length; sliceIndex++) {
    if (parents.allow(me.actions.EAT_MORE)) {
        me.eat(pie.slices[sliceIndex]);
    }
}
```


* Unordered
* List


1. Ordered
2. List

Table:

| Column1  | Column2  |
| -------- | -------- |
| Row1Col1 | Row1Col2 |
| Row2Col1 | Row2Col2 |
| Row3Col1 | Row3Col2 |

Have a nice day!
