import os from 'os'
export function getLocalIP() {
  const interfaces = os.networkInterfaces()

  // 遍历网络接口
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName]
    if (!interfaceInfo) continue

    // 过滤出 IPv4 地址和非回环地址
    const filteredAddresses = interfaceInfo.filter(
      (address) => address.family === 'IPv4' && !address.internal
    )

    // 返回第一个符合条件的 IP 地址
    if (filteredAddresses.length > 0) {
      return filteredAddresses[0].address
    }
  }

  // 如果没有找到符合条件的 IP 地址，则返回 undefined
  return undefined
}
