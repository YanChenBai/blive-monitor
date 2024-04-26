import os from 'os'

export function getLocalIP() {
  const interfaces = Object.entries(os.networkInterfaces())

  for (const [, networks] of interfaces) {
    if (!networks) continue
    for (const network of networks) {
      const { internal, family, address } = network
      if (internal || family !== 'IPv4' || address.startsWith('172.')) continue
      return address
    }
  }
}
