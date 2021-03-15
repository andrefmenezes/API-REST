// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: `${process.cwd()}` + '/fiscal_note.db',
    },
    migrations: {
      directory: './src/database/migrations/',
    },
    useNullAsDefault: true,
    debug: false,
    pool: { min: 0, max: 7 },
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: `${process.cwd()}` + '/fiscal_note.db',
    },
    migrations: {
      directory: './src/database/migrations/',
    },
    useNullAsDefault: true,
    debug: false,
    pool: { min: 0, max: 7 },
  },
};
