# [guttespinat.no](https://www.guttespinat.no)
  *-network:0 UNCLAIMED     
       description: Network controller
       product: Intel Corporation
       vendor: Intel Corporation
       physical id: 14.3
       bus info: pci@0000:00:14.3
       version: 00
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix cap_list
       configuration: latency=0
       resources: iomemory:500-4ff memory:5019304000-5019307fff
  *-network:1
       description: Ethernet interface
       product: Intel Corporation
       vendor: Intel Corporation
       physical id: 1f.6
       bus info: pci@0000:00:1f.6
       logical name: eno1
       version: 00
       serial: 10:b6:76:26:e6:9b
       size: 1Gbit/s
       capacity: 1Gbit/s
       width: 32 bits
       clock: 33MHz
       capabilities: pm msi bus_master cap_list ethernet physical tp 10bt 10bt-fd 100bt 100bt-fd 1000bt-fd autonegotiation
       configuration: autonegotiation=on broadcast=yes driver=e1000e driverversion=6.8.0-90-generic duplex=full firmware=0.1-4 ip=192.168.0.200 latency=0 link=yes multicast=yes port=twisted pair speed=1Gbit/s
       resources: irq:148 memory:8c100000-8c11ffff
