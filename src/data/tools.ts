export type ToolCategoryId = "data" | "protocol" | "mcu" | "circuit" | "code";

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  description: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  categoryId: ToolCategoryId;
  name: string;
  summary: string;
  keywords: string[];
  intro: string;
  inputs: string[];
  outputs: string[];
  scenarios: string[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "data",
    name: "数据处理",
    description: "围绕报文、字节流、编码与校验的高频小工具。"
  },
  {
    id: "protocol",
    name: "通信协议",
    description: "服务串口、总线与工控协议联调的工具组合。"
  },
  {
    id: "mcu",
    name: "MCU 开发",
    description: "聚焦寄存器、时钟、定时器、串口等底层开发场景。"
  },
  {
    id: "circuit",
    name: "电路计算",
    description: "面向板级设计与模拟前端的轻量计算器。"
  },
  {
    id: "code",
    name: "代码辅助",
    description: "把调试结果和输入数据更快转成工程可用文本。"
  }
];

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: "crc-checksum",
    slug: "crc-checksum",
    categoryId: "data",
    name: "CRC / Checksum 计算器",
    summary: "支持 CRC8、CRC16、CRC32、Modbus CRC、XOR、LRC 与字节和校验。",
    keywords: ["CRC", "Checksum", "Modbus", "XOR", "LRC"],
    intro: "适合串口协议、自定义帧格式、固件包校验等场景，支持文本和 HEX 两种输入方式。",
    inputs: ["文本或 HEX 报文", "校验算法", "多项式与初值等高级参数"],
    outputs: ["HEX / DEC 校验结果", "附加校验后的完整报文", "C 数组复制格式"],
    scenarios: ["串口命令帧校验", "Modbus RTU 调试", "Bootloader 数据包验证"]
  },
  {
    id: "base-convert",
    slug: "base-convert",
    categoryId: "data",
    name: "进制与字节流转换",
    summary: "在 BIN、DEC、HEX、OCT 之间联动换算，并支持有符号/无符号解释。",
    keywords: ["binary", "hex", "decimal", "signed", "unsigned"],
    intro: "适合寄存器值、协议字段和日志数据的快速解释，尤其适合分析边界值和补码。",
    inputs: ["输入值", "输入格式", "位宽与符号方式"],
    outputs: ["多进制联动结果", "高低字节拆分", "补码说明"],
    scenarios: ["寄存器值分析", "协议字段拆解", "故障日志排查"]
  },
  {
    id: "text-hex-convert",
    slug: "text-hex-convert",
    categoryId: "data",
    name: "HEX / ASCII / UTF-8 转换",
    summary: "在文本、HEX 字节流、十进制数组和 C 数组格式之间双向转换。",
    keywords: ["HEX", "ASCII", "UTF-8", "bytes", "C array"],
    intro: "适合构造 AT 命令、蓝牙串口报文、网络协议原始负载以及嵌入式数组初始化文本。",
    inputs: ["文本或 HEX 输入", "编码方式", "输出格式"],
    outputs: ["文本结果", "HEX 字节流", "字节数组和 C 代码片段"],
    scenarios: ["AT 指令构造", "串口报文检查", "调试数据转 C 数组"]
  },
  {
    id: "hash",
    slug: "hash",
    categoryId: "data",
    name: "Hash 摘要工具",
    summary: "支持 MD5、SHA-1、SHA-256 与 SHA-512 文本摘要。",
    keywords: ["MD5", "SHA1", "SHA256", "SHA512", "digest"],
    intro: "适合校验配置文本、固件元数据、版本字符串和临时调试内容的摘要值。",
    inputs: ["待摘要文本", "摘要算法"],
    outputs: ["摘要值", "大小写切换", "长度提示"],
    scenarios: ["固件标签校验", "配置比对", "版本内容摘要"]
  },
  {
    id: "ieee754",
    slug: "ieee754",
    categoryId: "data",
    name: "IEEE754 浮点互转",
    summary: "在 float32 / float64 与 HEX 表示之间转换，并显示符号位、指数位、尾数位。",
    keywords: ["IEEE754", "float", "double", "endianness"],
    intro: "适合分析设备回传浮点数据、检查字节序以及理解采样值在底层中的真实表示。",
    inputs: ["浮点或 HEX 输入", "精度选择", "字节序选择"],
    outputs: ["HEX 值", "浮点值", "位级拆解结果"],
    scenarios: ["Modbus 浮点解析", "CAN 数据映射", "传感器读数验证"]
  },
  {
    id: "aes",
    slug: "aes",
    categoryId: "data",
    name: "AES 文本加解密",
    summary: "支持 AES-CBC 和 AES-ECB 模式的调试级文本加解密。",
    keywords: ["AES", "CBC", "ECB", "crypto"],
    intro: "用于开发调试、协议联调和密文字段验证，所有处理默认在浏览器本地完成。",
    inputs: ["明文或密文", "Key / IV", "AES 模式", "输入输出编码"],
    outputs: ["Base64 结果", "HEX 结果", "解密后的文本"],
    scenarios: ["接口联调", "设备激活码验证", "本地协议测试"]
  },
  {
    id: "modbus-rtu",
    slug: "modbus-rtu",
    categoryId: "protocol",
    name: "Modbus RTU 工具",
    summary: "构造常见功能码请求帧，并解析 RTU 原始报文的字段和 CRC。",
    keywords: ["Modbus", "RTU", "CRC16", "industrial"],
    intro: "支持快速生成读取、写入类请求帧，也能把响应报文拆成地址、功能码、数据区和校验。",
    inputs: ["从站地址", "功能码", "寄存器地址与数量", "原始报文"],
    outputs: ["完整请求帧", "字段解析", "CRC 校验结果"],
    scenarios: ["工控设备联调", "485 报文排错", "仪表寄存器读取"]
  },
  {
    id: "register-parser",
    slug: "register-parser",
    categoryId: "mcu",
    name: "寄存器位域解析器",
    summary: "将 8/16/32 位数值拆成 bit 状态、字节视图与可选字段说明。",
    keywords: ["register", "bitfield", "mask", "MCU"],
    intro: "适合查看状态寄存器、告警字、控制字等内容，并快速定位使能位和字段值。",
    inputs: ["HEX / DEC / BIN 输入", "位宽", "可选字段定义"],
    outputs: ["位表", "字节拆分", "字段结果", "掩码值"],
    scenarios: ["驱动调试", "寄存器配置核对", "状态字分析"]
  },
  {
    id: "baudrate-calculator",
    slug: "baudrate-calculator",
    categoryId: "mcu",
    name: "波特率计算器",
    summary: "根据时钟、过采样和目标波特率，生成 UART 分频建议与误差估算。",
    keywords: ["baudrate", "UART", "USART", "clock"],
    intro: "适合 STM32、AVR、8051 等常见单片机场景，用于快速评估某一时钟下的串口误差。",
    inputs: ["外设时钟", "目标波特率", "过采样方式"],
    outputs: ["推荐分频值", "实际波特率", "误差百分比", "候选列表"],
    scenarios: ["串口初始化", "时钟方案评估", "误码风险判断"]
  },
  {
    id: "timer-pwm-adc",
    slug: "timer-pwm-adc",
    categoryId: "mcu",
    name: "Timer / PWM / ADC 计算器",
    summary: "把定时器周期、PWM 占空比和 ADC/DAC 电压换算整合在一个多标签工具里。",
    keywords: ["timer", "PWM", "ADC", "DAC", "frequency"],
    intro: "适合 MCU 基础外设配置与参数反推，减少翻表和手算的重复工作。",
    inputs: ["时钟与分频", "自动重装和比较值", "参考电压与分辨率"],
    outputs: ["周期与频率", "PWM 占空比", "ADC/DAC 电压和码值"],
    scenarios: ["1 ms 定时器配置", "PWM 输出调试", "采样电压估算"]
  },
  {
    id: "ohms-law",
    slug: "ohms-law",
    categoryId: "circuit",
    name: "欧姆定律计算器",
    summary: "根据已知的电压、电流、电阻、功率中的任意两项，联动求出其余参数。",
    keywords: ["Ohm", "Voltage", "Current", "Resistance", "Power"],
    intro: "适合板级供电、传感器回路、驱动负载和基础维修场景，快速完成 V / I / R / P 换算。",
    inputs: ["任选两项作为已知值", "单位默认采用 V、A、Ohm、W"],
    outputs: ["完整的 V / I / R / P 结果", "基础功耗和负载关系"],
    scenarios: ["电源回路估算", "负载电流判断", "板级维修粗算"]
  },
  {
    id: "voltage-divider",
    slug: "voltage-divider",
    categoryId: "circuit",
    name: "电阻分压计算器",
    summary: "根据 Vin、R1、R2 计算 Vout，也支持反向求未知电阻值。",
    keywords: ["divider", "resistor", "ADC", "voltage"],
    intro: "适合 MCU ADC 输入保护、电平转换、传感器量程缩放和采样网络设计。",
    inputs: ["输入电压", "上下臂电阻", "可选目标输出电压"],
    outputs: ["输出电压", "分压比", "总电流", "反推电阻建议"],
    scenarios: ["ADC 采样前端", "高压转低压检测", "电平匹配"]
  },
  {
    id: "led-resistor",
    slug: "led-resistor",
    categoryId: "circuit",
    name: "LED 限流电阻计算器",
    summary: "根据电源电压、LED 压降和目标电流，计算串联限流电阻与功耗。",
    keywords: ["LED", "resistor", "current limit", "power"],
    intro: "适合指示灯、状态灯和简单照明回路设计，快速估算串联电阻及其功率余量。",
    inputs: ["供电电压", "单颗 LED 压降", "串联颗数", "目标电流"],
    outputs: ["推荐电阻值", "电阻功耗", "LED 总压降", "回路余量"],
    scenarios: ["板载指示灯设计", "面板灯路计算", "维修替换估算"]
  },
  {
    id: "rc-calculator",
    slug: "rc-calculator",
    categoryId: "circuit",
    name: "RC 时间常数 / 截止频率",
    summary: "根据 R 和 C 计算时间常数 tau、截止频率 fc 和充放电特征点。",
    keywords: ["RC", "tau", "cutoff", "filter"],
    intro: "适合一阶低通、高通、按键消抖、采样保持和模拟前端的快速估算。",
    inputs: ["电阻值", "电容值"],
    outputs: ["时间常数", "截止频率", "63.2% 充电时间", "约 5tau 稳定时间"],
    scenarios: ["RC 滤波设计", "按键消抖", "模拟前端响应估算"]
  },
  {
    id: "opamp-gain",
    slug: "opamp-gain",
    categoryId: "circuit",
    name: "运放增益计算器",
    summary: "计算同相与反相运放的电压增益，并根据目标增益反推电阻比。",
    keywords: ["opamp", "gain", "inverting", "non-inverting"],
    intro: "适合传感器信号调理、ADC 前级放大和模拟链路调试，快速校核增益与输出范围。",
    inputs: ["运放拓扑", "反馈电阻", "输入电阻", "输入信号幅值"],
    outputs: ["闭环增益", "理论输出幅值", "目标增益下的电阻比"],
    scenarios: ["传感器前端设计", "采样信号放大", "模拟链路调试"]
  }
];

export function toolPath(tool: ToolDefinition) {
  return `/tools/${tool.categoryId}/${tool.slug}`;
}

export const TOOLS_BY_CATEGORY = TOOL_CATEGORIES.map((category) => ({
  ...category,
  tools: TOOL_DEFINITIONS.filter((tool) => tool.categoryId === category.id)
}));

export function getToolByParams(categoryId: string, slug: string) {
  return TOOL_DEFINITIONS.find((tool) => tool.categoryId === categoryId && tool.slug === slug);
}
