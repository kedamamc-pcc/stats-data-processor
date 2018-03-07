## Data Schemes

The actual file may contain extra keys which are not documented here. Those keys were just not striped out from the original data and may be removed in the future.

Current version: 2.0

### day/*.json

One file for every day (currently). The filename is the date when the data was updated, in YYYY-MM-DD format.

```js
{
  _update: Number, // Date in milliseconds, when the file was updated
  world_lived: Number, // How long has the server been running in seconds
  players: [ Player, ... ], // The latest state of all players till this day
}
```

Where `Player` is:

```js
{
  _update: Number, // Date in milliseconds
  stats: PlayerStats,
  advancements: PlayerAdvancements,
  data: PlayerData,
}
```

Where `PlayerStats` is:

_To Be Edited_

Where `PlayerAdvancements` is:

_To Be Edited_

Where `PlayerData` is:

```js
{
  time_start: Number, // Date in milliseconds, for when the player joined server
  time_last: Number, // Date in milliseconds, for the last time the player logged in
  time_lived: Number, // Seconds, for how long has the player played
  playername: String,
  names: [ PlayerNameRecord, ... ],
  uuid: String,
  uuid_short: String, // `uuid` without hyphens
  banned: Boolean,
}
```

Where `PlayerNameRecord` is:

```js
{
  name: String,
  changedToAt?: Number, // Date in milliseconds, for the time when the player changed to this name, may not exist if this is the inital name
}
```

### player/*.json

One file for each player, the filename is the `uuid_short` of the player.

```js
{
  uuid: String,
  uuid_short: String, // `uuid` without hyphens
  data: {
    [_update: Number]: // Date in milliseconds, same as the value of `_update` in `PlayerData`
      Player,
    ...
  },
}
```

### players.json

Contains the latest version of `PlayerData` of every player. Usually used for player info index.

```js
[ PlayerData, ... ]
```

### Changes

- **2.0**
  + `day/*.json`: Root key `data_update` renamed to `_update`.