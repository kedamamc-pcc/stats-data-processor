module.exports = [
  ['time_lived', {
    title: '在线时间 TOP10',
    unit: '小时',
    formatter: function (val) {
      return Math.round(val / 3600);
    },
    description: '「青春啊……」',
  }],
  ['stat.deaths', {
    title: '死亡 TOP10',
    unit: '次',
    description: '「死亡只是下一次冒险的开始」',
  }],
  ['stat.killEntity.Creeper', {
    title: '击杀爬行者 TOP10',
    unit: '只',
    description: '「你在我眼里只是会走的火药而已」',
  }],
  ['stat.entityKilledBy.Creeper', {
    title: '死于爬行者 TOP10',
    description: '「怕酱爱你们爱得奋不顾身」',
    unit: '次',
  }],
  ['stat.playerKills', {
    title: '击杀玩家数 TOP10',
    description: '只计直接杀害的次数',
    unit: '人',
  }],
  ['stat.aviateOneCm', {
    title: '鞘翅飞行距离 TOP10',
    unit: '千米',
    formatter: function (val) {
      return Math.round(val / 100 / 1000);
    },
  }],
  ['stat.minecartOneCm', {
    title: '矿车移动距离 TOP10',
    unit: '千米',
    formatter: function (val) {
      return Math.round(val / 100 / 1000);
    },
  }],
  ['stat.horseOneCm', {
    title: '骑马移动距离 TOP10',
    unit: '千米',
    formatter: function (val) {
      return Math.round(val / 100 / 1000);
    },
  }],
  ['stat.sprintOneCm', {
    title: '疾跑距离 TOP10',
    unit: '千米',
    formatter: function (val) {
      return Math.round(val / 100 / 1000);
    },
  }],
  ['stat.killEntity.Shulker', {
    title: '击杀潜影贝 TOP10',
    unit: '只',
    description: '「让你飞得更高，你却恩将仇报」',
  }],
  ['stat.killEntity.WitherSkeleton', {
    title: '击杀凋灵骷髅 TOP10',
    unit: '只',
    description: '「死也不交出我的头颅」',
  }],
  ['stat.mineBlock.minecraft.quartz_ore', {
    title: '开采下界石英矿石 TOP10',
    unit: '块',
  }],
  ['stat.pickup.minecraft.quartz', {
    title: '拾取下界石英 TOP10',
    unit: '个',
  }],
  ['stat.mineBlock.minecraft.diamond_ore', {
    title: '开采钻石矿石 TOP10',
    unit: '块',
  }],
  ['stat.mineBlock.minecraft.iron_ore', {
    title: '开采铁矿石 TOP10',
    unit: '块',
  }],
  ['stat.mineBlock.minecraft.stone', {
    title: '开采石头 TOP10',
    unit: '块',
  }],
  ['stat.mineBlock.minecraft.clay', {
    title: '开采粘土块 TOP10',
    unit: '块',
    description: '就是河底湖底那个',
  }],
  ['stat.mineBlock.minecraft.packed_ice', {
    title: '开采浮冰 TOP10',
    unit: '块',
  }],
  ['stat.mineBlock.minecraft.log', {
    title: '砍树 TOP10',
    unit: '块',
  }],
  ['stat.useItem.minecraft.sapling', {
    title: '种树 TOP10',
    unit: '棵',
  }],
  ['stat.cakeSlicesEaten', {
    title: '吃蛋糕 TOP10',
    unit: '片',
    description: '「谎言总是很甜」',
  }],
  ['stat.animalsBred', {
    title: '繁殖动物 TOP10',
    unit: '次',
    description: '「物种保护大使」',
  }],
  ['stat.talkedToVillager', {
    title: '村民对话 TOP10',
    unit: '次',
    description: '「你是话痨吗？」',
  }],
  ['stat.tradedWithVillager', {
    title: '村民交易 TOP10',
    unit: '次',
    description: '「你能交易点别的东西吗？」'
  }],
  // ['stat.sleepInBed', {
  //   title: '躺床 TOP10',
  //   description: '躺下就算',
  //   unit: '次',
  // }],
  ['stat.craftItem.minecraft.banner', {
    title: '合成旗帜 TOP10',
    unit: '个',
  }],
  ['stat.fishCaught', {
    title: '钓到鱼 TOP10',
    unit: '个',
    description: '包括所有种类的鱼',
  }],
  ['stat.useItem.minecraft.fishing_rod', {
    title: '甩竿 TOP10',
    unit: '次',
  }],
  ['stat.useItem.minecraft.writable_book', {
    title: '写书 TOP10',
    unit: '次',
    description: '点开书与笔就算',
  }],
  ['Net potato', {
    title: '拾取土豆 TOP10',
    unit: '个',
    description: '拾取量－丢弃量',
    handler(p) {
      return p.stats['stat.pickup.minecraft.potato'] - p.stats['stat.drop.minecraft.potato'];
    },
  }],
  ['stat.useItem.minecraft.potato', {
    title: '使用土豆 TOP10',
    unit: '个',
    description: '吃了？烤了？喂猪了？',
  }],
];
