const maze2 = [
  [0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe],
  [0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe],
  [0xfc, 0xda, 0x40, 0xde, 0xd8, 0xd2, 0xd2, 0xd2, 0xd2, 0xd2, 0xd2, 0xd2, 0xd6, 0xd8, 0xd2, 0xd2, 0xd2, 0xd2, 0xd4, 0xfc, 0xfc, 0xfc, 0xfc, 0xda, 0x40, 0xde, 0xd8, 0xd2, 0xd2, 0xd2, 0xd2, 0xd4],
  [0xfc, 0xda, 0x40, 0xde, 0xe4, 0x14, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0xdc, 0xfc, 0xfc, 0xfc, 0xfc, 0xda, 0x40, 0xde, 0xe4, 0x14, 0x10, 0x10, 0x10, 0xdc],
  [0xfc, 0xda, 0x40, 0xde, 0xe4, 0x10, 0xe6, 0xe8, 0xe8, 0xe8, 0xea, 0x10, 0xde, 0xe4, 0x10, 0xe6, 0xea, 0x10, 0xe7, 0xd2, 0xd2, 0xd2, 0xd2, 0xeb, 0x40, 0xe7, 0xeb, 0x10, 0xe6, 0xea, 0x10, 0xdc],
  [0xfc, 0xda, 0x40, 0xde, 0xe4, 0x10, 0xde, 0xf3, 0xe9, 0xe9, 0xeb, 0x10, 0xde, 0xe4, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x10, 0xdc],
  [0xfc, 0xda, 0x40, 0xde, 0xe4, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x10, 0xde, 0xf2, 0xe8, 0xe8, 0xe8, 0xea, 0x10, 0xe6, 0xea, 0x10, 0xe6, 0xe8, 0xe8, 0xf4, 0xe4, 0x10, 0xdc],
  [0xfc, 0xda, 0x40, 0xe7, 0xeb, 0x10, 0xde, 0xe4, 0x10, 0xe6, 0xea, 0x10, 0xe7, 0xeb, 0x10, 0xe7, 0xe9, 0xe9, 0xe9, 0xe9, 0xeb, 0x10, 0xde, 0xe4, 0x10, 0xe7, 0xe9, 0xe9, 0xe9, 0xeb, 0x10, 0xdc],
  [0xfc, 0xda, 0x40, 0x40, 0x40, 0x10, 0xde, 0xe4, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xdc],
  [0xfc, 0xfa, 0xe8, 0xe8, 0xea, 0x10, 0xde, 0xe4, 0x10, 0xde, 0xf2, 0xe8, 0xe8, 0xe8, 0xe8, 0xea, 0x40, 0xe6, 0xe8, 0xe8, 0xea, 0x10, 0xde, 0xf2, 0xe8, 0xe8, 0xea, 0x10, 0xe6, 0xea, 0x10, 0xdc],
  [0xfc, 0xfb, 0xe9, 0xe9, 0xeb, 0x10, 0xe7, 0xeb, 0x10, 0xe7, 0xe9, 0xe9, 0xe9, 0xe9, 0xe9, 0xeb, 0x40, 0xe7, 0xe9, 0xf5, 0xe4, 0x10, 0xde, 0xf3, 0xe9, 0xe9, 0xeb, 0x10, 0xde, 0xe4, 0x10, 0xdc],
  [0xfc, 0xda, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0xde, 0xe4, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x10, 0xdc],
  [0xfc, 0xda, 0x10, 0xe6, 0xea, 0x10, 0xe6, 0xe8, 0xe8, 0xe8, 0xe8, 0xea, 0x40, 0xec, 0xd3, 0xd3, 0xd3, 0xee, 0x40, 0xe7, 0xeb, 0x10, 0xe7, 0xeb, 0x10, 0xe6, 0xea, 0x10, 0xde, 0xe4, 0x10, 0xdc],
  [0xfc, 0xda, 0x10, 0xde, 0xe4, 0x10, 0xe7, 0xe9, 0xe9, 0xe9, 0xf5, 0xe4, 0x40, 0xdc, 0xfc, 0xfc, 0xfc, 0xda, 0x40, 0x40, 0x40, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x10, 0xe7, 0xeb, 0x10, 0xdc],
  [0xfc, 0xda, 0x10, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0x10, 0xde, 0xe4, 0x40, 0xf0, 0xfc, 0xfc, 0xfc, 0xda, 0x40, 0xe6, 0xe8, 0xe8, 0xe8, 0xea, 0x40, 0xde, 0xe4, 0x10, 0x10, 0x10, 0x10, 0xdc],
  [0xfc, 0xda, 0x10, 0xde, 0xf2, 0xe8, 0xe8, 0xe8, 0xea, 0x10, 0xde, 0xe4, 0x40, 0xce, 0xfc, 0xfc, 0xfc, 0xda, 0x40, 0xde, 0xc0, 0xc0, 0xc0, 0xe4, 0x40, 0xde, 0xf2, 0xe8, 0xe8, 0xea, 0x10, 0xdc],
  [0xfd, 0xdb, 0x10, 0xdf, 0xf3, 0xe9, 0xe9, 0xe9, 0xeb, 0x10, 0xdf, 0xe5, 0x40, 0xcf, 0xfd, 0xfd, 0xfd, 0xdb, 0x40, 0xdf, 0xc1, 0xc1, 0xc1, 0xe5, 0x40, 0xdf, 0xf3, 0xe9, 0xe9, 0xeb, 0x10, 0xdd],
  [0xfd, 0xdb, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x40, 0xf1, 0xfd, 0xfd, 0xfd, 0xdb, 0x40, 0xe7, 0xe9, 0xe9, 0xe9, 0xeb, 0x40, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0xdd],
  [0xfd, 0xdb, 0x10, 0xdf, 0xe5, 0x10, 0xe6, 0xe8, 0xe8, 0xe8, 0xf4, 0xe5, 0x40, 0xdd, 0xfd, 0xfd, 0xfd, 0xdb, 0x40, 0x40, 0x40, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x10, 0xe6, 0xea, 0x10, 0xdd],
  [0xfd, 0xdb, 0x10, 0xe7, 0xeb, 0x10, 0xe7, 0xe9, 0xe9, 0xe9, 0xe9, 0xeb, 0x40, 0xed, 0xd2, 0xd2, 0xd2, 0xef, 0x40, 0xe6, 0xea, 0x10, 0xe6, 0xea, 0x10, 0xe7, 0xeb, 0x10, 0xdf, 0xe5, 0x10, 0xdd],
  [0xfd, 0xdb, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0x40, 0xdf, 0xe5, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x10, 0xdd],
  [0xfd, 0xfa, 0xe8, 0xe8, 0xea, 0x10, 0xe6, 0xea, 0x10, 0xe6, 0xe8, 0xe8, 0xe8, 0xe8, 0xe8, 0xea, 0x40, 0xe6, 0xe8, 0xf4, 0xe5, 0x10, 0xdf, 0xf2, 0xe8, 0xe8, 0xea, 0x10, 0xdf, 0xe5, 0x10, 0xdd],
  [0xfd, 0xfb, 0xe9, 0xe9, 0xeb, 0x10, 0xdf, 0xe5, 0x10, 0xdf, 0xf3, 0xe9, 0xe9, 0xe9, 0xe9, 0xeb, 0x40, 0xe7, 0xe9, 0xe9, 0xeb, 0x10, 0xdf, 0xf3, 0xe9, 0xe9, 0xeb, 0x10, 0xe7, 0xeb, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0x40, 0x40, 0x10, 0xdf, 0xe5, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0xe6, 0xea, 0x10, 0xdf, 0xe5, 0x10, 0xe7, 0xeb, 0x10, 0xe6, 0xea, 0x10, 0xe6, 0xe8, 0xe8, 0xe8, 0xe8, 0xea, 0x10, 0xdf, 0xe5, 0x10, 0xe6, 0xe8, 0xe8, 0xe8, 0xea, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0xdf, 0xe5, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x10, 0xdf, 0xf3, 0xe9, 0xe9, 0xe9, 0xeb, 0x10, 0xe7, 0xeb, 0x10, 0xe7, 0xe9, 0xe9, 0xf5, 0xe5, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0xdf, 0xe5, 0x10, 0xdf, 0xf2, 0xe8, 0xe8, 0xea, 0x10, 0xdf, 0xe5, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0xdf, 0xe5, 0x10, 0xe7, 0xe9, 0xe9, 0xe9, 0xeb, 0x10, 0xdf, 0xe5, 0x10, 0xe7, 0xeb, 0x10, 0xe6, 0xd3, 0xd3, 0xd3, 0xd3, 0xea, 0x40, 0xe6, 0xea, 0x10, 0xe7, 0xeb, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0xdf, 0xe5, 0x14, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0xdf, 0xe5, 0x10, 0x10, 0x10, 0x10, 0xdd, 0xfd, 0xfd, 0xfd, 0xfd, 0xdb, 0x40, 0xdf, 0xe5, 0x14, 0x10, 0x10, 0x10, 0xdd],
  [0xfd, 0xdb, 0x40, 0xdf, 0xd9, 0xd3, 0xd3, 0xd3, 0xd3, 0xd3, 0xd3, 0xd3, 0xd7, 0xd9, 0xd3, 0xd3, 0xd3, 0xd3, 0xd5, 0xfd, 0xfd, 0xfd, 0xfd, 0xdb, 0x40, 0xdf, 0xd9, 0xd3, 0xd3, 0xd3, 0xd3, 0xd5],
  [0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe],
  [0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0x40, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe, 0xfe]
];