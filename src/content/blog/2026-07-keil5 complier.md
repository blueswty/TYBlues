---
title: "Keil安装AC5编译器"
description: "新版Keil5 不再默认安装AC5编译器。"
pubDate: 2026-07-09
tags:
  - Keil
  - 嵌入式
---

## # 前言

安装Keil 537版本，编译工程报错。原因是新版Keil不再默认安装AC5编译器。

>  *** Target 'hub' uses ARM-Compiler 'Default Compiler Version 5' which is not available.

## # 下载AC5编译器

官方下载地址[ARM(戳此链接)]([Downloads - Arm Developer](https://developer.arm.com/downloads/view/ACOMP5))

官网需要注册登录，并且需要时间审核，比较麻烦

可以使用[百度网盘(戳此链接)]([pan.baidu.com/s/1Qfqzaemwtm1Cjq1orvooww?pwd=t7u6](http://pan.baidu.com/s/1Qfqzaemwtm1Cjq1orvooww?pwd=t7u6))进行下载

## # 安装AC5编译器

安装路径和AC6的并行，否则可能报安装不正确

![](https://picgocloud.com/m/6f91de7b-b32d-47f2-86ba-2fc103714deb.png)

进入项目管理项，添加已经安装的编译器

![](https://picgocloud.com/m/5a85065f-ffdc-4db4-ac14-62f8d9f851ef.png)

进入编译器选择，可以看到能够使用AC5

![](https://picgocloud.com/m/50008ed0-5549-43fd-82c8-e01e5370b6ef.png)

## # 参考

[Keil MDK v5.43 添加AC5(ARMCC)编译器 - 辛亚平 - 博客园](https://www.cnblogs.com/yapingxin/p/19084006)
