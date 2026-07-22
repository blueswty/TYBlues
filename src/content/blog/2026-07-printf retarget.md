---
title: "Printf 重定向Retarget"
description: "将printf输出到串口，则需要将fputc里面的输出指向串口。"
pubDate: 2026-07-09
tags:
  - Keil
  - 嵌入式
---

## 前言

HAL库新工程烧录后无法运行，keil在线调试STM32，点3次运行才能跑到main？

>  1. **第1次点击运行**：CPU从`Reset_Handler`启动，执行到`main`，再执行到`printf`。此时`printf`试图通过半主机通道向调试器（MDK/IAR）请求打印服务。但调试器还没完全准备好接管这个I/O请求，导致CPU进入**HardFault**或**卡死在BKPT指令**上。程序“看起来”没跑起来。
>  2. **第2或第3次点击运行**：调试器被强制唤醒，处理了挂起的半主机请求，或者你手动复位后，调试器内部状态机被刷新，程序才勉强跳过那个陷阱。

## 解决方式



推荐**方案2**，使用微库较为局限，在实际工程中不建议这么做。

### 方案1：勾选微库（MicroLIB）

- 在Keil中，点击魔术棒（Options for Target） -> **Target** 选项卡。
- 勾选 **“Use MicroLIB”**。

> **为什么必须勾？** 标准C库的`printf`体积大，且依赖半主机。微库是一个轻量级库，它明确允许用户重写底层的`fputc`函数，而不走半主机通道。

### 方案2：**手动屏蔽半主机**

程序中加入以下代码：

```C
#pragma import(__use_no_semihosting)

struct __FILE
{
  int handle;
};

FILE __stdout;

int _sys_exit(int x)
{
  return x = x;
}
```

### < 不要忘记重定义fputc >

```C
#include "stdio.h"

int fputc(int ch, FILE *f)
{
  HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, 0xffff);
  return ch;
}
```

## 其他

- 可以选择删除printf，调用或者重新封装串口发送函数，因为是重定向才导致这个问题。

- 在实际工程中，若打印频次高，建议使用DMA方式操作串口发送。
- 本文只讨论Keil下的HAL库操作，不保证其他平台其他库可以如此使用。

